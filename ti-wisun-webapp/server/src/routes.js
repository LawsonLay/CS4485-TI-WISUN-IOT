const express = require('express');
const cors = require('cors');
const {httpLogger, borderRouterLogger} = require('./logger.js');
const {ClientState, setProp, resetTopology, defaultAutoPing} = require('./ClientState.js');
const {PingExecutor} = require('./PingExecutor.js');
const {BorderRouterManager} = require('./BorderRouterManager.js');
const path = require('path');
const {sendDBusMessage} = require('./dbusCommands.js');
const {CONSTANTS} = require('./AppConstants');
const {SerialPort} = require('serialport');
const {postLEDStates, getOADFirmwareVersion, startOAD, turnOnLightManual} = require('./coapCommands.js');
const {deviceOperations, relationshipOperations} = require('./database.js');
const multer = require('multer');
const fs = require('fs');

// Configure storage for device images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../data/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/**
 * This function sets up all of the webserver endpoints
 * for the client to update and retrieve information from
 * the server.
 * @param {*} app
 * @param {PingExecutor} pingExecutor
 * @param {BorderRouterManager} borderRouterManager
 * @param {SocketIOServer} io
 */
function initializeRoutes(app, pingExecutor, borderRouterManager, io) {
  app.use(cors());
  app.use(express.json());

  /**
   * Send the built React files (html, css, js) to
   * the client at the root endpoint.
   */
  const REACT_FILES_PATH = path.resolve(path.join(__dirname, '../../client/build'));
  app.use(express.static(REACT_FILES_PATH));
  app.use(express.static(CONSTANTS.OUTPUT_DIR_PATH));
  app.use((req, res, next) => {
    httpLogger.info(`${req.ip} ${req.method} ${req.originalUrl}`);
    next();
  });

  /**
   * Webserver endpoint for getting the topology
   * from the ClientState object.
   */
  app.get('/topology', (req, res) => {
    res.json(ClientState.topology);
  });

  /**
   * Webserver endpoint to create a single pingburst
   * with the ping settings specified from the body
   * of the HTTP request.
   */
  app.post('/pingbursts', (req, res) => {
    const id = pingExecutor.handleRequest(req.body);
    if (id === -1) {
      res.json({wasSuccess: false, message: 'Border Router does not have IP'});
    } else {
      res.json({id});
    }
  });

  /**
   * Webserver endpoint to abort a single pingburst
   * with the destination IP specified from the body
   * of the HTTP request.
   */
  app.post('/abortpingburst', (req, res) => {
    const destIP = req.body.destIP;
    const wasAbortSuccess = pingExecutor.abort(destIP);
    res.json({destIP, wasAbortSuccess});
  });

  /**
   * Webserver endpoint to abort all of the active pingbursts
   */
  app.get('/abortAllPingbursts', (req, res) => {
    pingExecutor.abortAll();
  });

  /**
   * Webserver endpoint to cancel auto pinging.
   * This endpoint also aborts all of the current pingbursts.
   */
  app.get('/cancelAutoPing', (req, res) => {
    ClientState.autoPing = defaultAutoPing();
    pingExecutor.abortAll();
  });

  /**
   * Webserver endpoint to set LED states for the selected nodes
   * Either turns on/off the green/red LEDs
   */
  app.post('/setLEDStates', (req, res) => {
    const {ipAddresses, color, newValue} = req.body;
    for (const ipAddr of ipAddresses) {
      postLEDStates(ipAddr, color, newValue);
    }
    res.json('success');
  });

  /**
   * Webserver endpoint for getting the connected value
   * from the ClientState object.
   */
  app.get('/connected', (req, res) => {
    res.json(ClientState.connected);
  });

  /**
   * Webserver endpoint for getting an NCP property.
   * Parameters are passed through the query
   * with the following structure:
   * `property=<NCP property of choice>`
   *
   * Example getting the CCA Threshold:
   * get /getProp?property=NCP:CCAThreshold
   *
   * Sends a json response with @param {wasSuccess} to indicate
   * if the property was retrieved successfully.
   */
  app.get('/getProp', (req, res) => {
    const propertyValue = ClientState.ncpProperties[req.query.property];
    if (propertyValue === undefined) {
      res.json({wasSuccess: false});
    } else {
      res.json({
        [req.query.property]: propertyValue,
      });
    }
  });

  /**
   * Webserver endpoint for getting the stored NCP properties
   * from the ClientState object.
   */
  app.get('/getProps', (req, res) => {
    res.json(ClientState.ncpProperties);
  });

  /**
   * Webserver endpoint for resetting the BR (NCP)
   *
   * Sends a json response with @param {wasSuccess} to indicate
   * if the BR was reset successfully.
   */
  app.get('/reset', async (req, res) => {
    resetTopology();
    try {
      await sendDBusMessage('ResetNCP', '', '');
      res.json({wasSuccess: true});
    } catch (e1) {
      borderRouterLogger.error('DBus Reset Unsuccessful, attempting direct UART reset...');
      try {
        await borderRouterManager.reset();
        borderRouterLogger.info('UART Reset successful!');
        res.json({wasSuccess: true});
      } catch (e2) {
        borderRouterLogger.error('UART reset also unsuccessful');
        res.json({wasSuccess: false, message: `${e1.message}\n${e2.message}`});
      }
    }
  });

  /**
   * Webserver endpoint for setting an NCP property.
   * Parameters are passed through the query
   * with the following structure:
   * `property=<NCP property of choice>`
   * `newValue=<new value for NCP property>`
   *
   * Example setting the CCA Threshold to -60:
   * get /setProp?property=NCP:CCAThreshold&newValue=-60
   *
   * Sends a json response with @param {wasSuccess} to indicate
   * if the property was set successfully.
   */
  app.get('/setProp', async (req, res) => {
    if (ClientState.connected) {
      try {
        await setProp(req.query.property, req.query.newValue);
        res.json({wasSuccess: true});
      } catch (error) {
        res.json({wasSuccess: false, message: error.message});
      }
    } else {
      res.json({wasSuccess: false, message: 'Border Router Not Connected'});
    }
  });

  /**
   * Webserver endpoint to manually trigger an update of NCP properties and topology.
   */
  app.get('/api/network/refresh', async (req, res) => {
    if (!ClientState.connected) {
      return res.status(400).json({ error: 'Border Router not connected' });
    }
    try {
      // Trigger updates concurrently
      await Promise.all([
        borderRouterManager.updateNCPProperties(),
        borderRouterManager.updateTopology()
      ]);
      res.json({ success: true, message: 'Network properties and topology refreshed.' });
    } catch (error) {
      httpLogger.error(`Error refreshing network state: ${error.message}`);
      res.status(500).json({ error: 'Failed to refresh network state.' });
    }
  });

  /**
   * Webserver endpoint for inserting or removing from the
   * macfilterlist. Parameters are passed through the query
   * with the following structure:
   * `newValue=<16 hex digit mac address>`
   * `insert=<true or false>`
   *
   * Example removing a macfilter aaaabbbbccccdddd:
   * get /macfilterUpdate?newValue=aaaabbbbccccdddd&insert=false
   *
   * Example adding a macfilter aaaabbbbccccdddd:
   * get /macfilterUpdate?newValue=aaaabbbbccccdddd&insert=true
   *
   * Sends a json response with @param {wasSuccess} to indicate
   * if the macfilter was added or removed successfully.
   */
  app.get('/macfilterUpdate', async (req, res) => {
    if (ClientState.connected) {
      try {
        if (req.query.insert === 'true') {
          await sendDBusMessage('PropInsert', 'macfilterlist', req.query.newValue);
        } else if (req.query.insert === 'false') {
          await sendDBusMessage('PropRemove', 'macfilterlist', req.query.newValue);
        }
        res.json({wasSuccess: true});
      } catch (error) {
        res.json({wasSuccess: false, message: error.message});
      }
    } else {
      res.json({wasSuccess: false, message: 'Border Router Not Connected'});
    }
  });

  /** 
   * Webserver endpoint for gathering OAD Firmware Versions
  */
  
  app.post('/OADFirmwareVersion', async (req, res) => {
    const {ipAddresses} = req.body;
    for(const ipAddr of ipAddresses) {
      getOADFirmwareVersion(ipAddr);
    }
    
    res.json("success");
  });

  app.post('/OADStart', async (req, res) => {
    const {ipAddresses, payload, filePath} = req.body;
    for (const ipAddr of ipAddresses) {
      startOAD(ipAddr, payload, filePath);
    }

    res.json({wasSuccess: true});
  });

  /**
   * Device management API endpoints
   */
  // Get all devices
  app.get('/api/devices', async (req, res) => {
    try {
      const devices = await deviceOperations.getAllDevices();
      res.json(devices);
    } catch (error) {
      httpLogger.error(`Error fetching devices: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific device by MAC address
  app.get('/api/devices/:mac', async (req, res) => {
    try {
      const device = await deviceOperations.getDeviceByMac(req.params.mac);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      res.json(device);
    } catch (error) {
      httpLogger.error(`Error fetching device: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Add a new device
  app.post('/api/devices', upload.single('image'), async (req, res) => {
    try {
      let device = req.body;
      
      // If an image was uploaded, save its path
      if (req.file) {
        device.image_path = `/data/images/${req.file.filename}`;
      }
      
      // Default name to vendor_class_type if not provided
      if (!device.name) {
        device.name = device.vendor_class_type;
      }
      
      const result = await deviceOperations.addDevice(device);
      io.emit('devices_updated');
      res.status(201).json(result);
    } catch (error) {
      httpLogger.error(`Error adding device: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a device
  app.put('/api/devices/:mac', upload.single('image'), async (req, res) => {
    try {
      let updates = req.body;
      
      // If an image was uploaded, save its path
      if (req.file) {
        updates.image_path = `/data/images/${req.file.filename}`;
      }

      // Convert manual_mode to boolean if it's a string
      if (updates.manual_mode !== undefined && typeof updates.manual_mode === 'string') {
        updates.manual_mode = updates.manual_mode === 'true';
      }
      if (updates.activated !== undefined && typeof updates.activated === 'string') {
        updates.activated = updates.activated === 'true';
      }
      
      const result = await deviceOperations.updateDevice(req.params.mac, updates);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Device not found' });
      }

      io.emit('devices_updated');
      res.json({ updated: true, mac_address: req.params.mac });
    } catch (error) {
      httpLogger.error(`Error updating device: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a device
  app.delete('/api/devices/:mac', async (req, res) => {
    try {
      const result = await deviceOperations.deleteDevice(req.params.mac);
      if (!result.deleted) {
        return res.status(404).json({ error: 'Device not found' });
      }

      io.emit('devices_updated');
      res.json({ deleted: true, mac_address: req.params.mac });
    } catch (error) {
      httpLogger.error(`Error deleting device: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Get devices by type (sensors)
  app.get('/api/devices/type/sensors', async (req, res) => {
    try {
      const sensorDevices = await deviceOperations.getDevicesByType('sensor');
      const fsrDevices = await deviceOperations.getDevicesByType('fsr');

      const combinedDevicesMap = new Map();
      sensorDevices.forEach(device => combinedDevicesMap.set(device.mac_address, device));
      fsrDevices.forEach(device => combinedDevicesMap.set(device.mac_address, device));

      const devices = Array.from(combinedDevicesMap.values());
      
      res.json(devices);
    } catch (error) {
      httpLogger.error(`Error fetching sensor devices: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Get devices by type (actuators)
  app.get('/api/devices/type/actuators', async (req, res) => {
    try {
      const actuatorDevices = await deviceOperations.getDevicesByType('actuator');
      const lightDevices = await deviceOperations.getDevicesByType('light');

      const combinedDevicesMap = new Map();
      actuatorDevices.forEach(device => combinedDevicesMap.set(device.mac_address, device));
      lightDevices.forEach(device => combinedDevicesMap.set(device.mac_address, device));

      const devices = Array.from(combinedDevicesMap.values());
      
      res.json(devices);
    } catch (error) {
      httpLogger.error(`Error fetching actuator devices: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // New endpoint to control device mode (manual on/off, auto)
  app.post('/api/devices/:mac/control', async (req, res) => {
    const { mac } = req.params;
    const { mode } = req.body; // mode: 'manual-on', 'manual-off', 'automatic'

    try {
      const device = await deviceOperations.getDeviceByMac(mac);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      if (device.device_type === 'sensor' || device.device_type === 'fsr') {
        return res.status(400).json({ error: 'Device is not an actuator' });
      }
      if (!device.ipv6_address) {
        return res.status(400).json({ error: 'Device IPv6 address not available for CoAP command.' });
      }

      let coapState;
      let coapManualMode;
      let dbUpdates = {};

      switch (mode) {
        case 'manual-on':
          coapState = 1;
          coapManualMode = 1;
          dbUpdates = { activated: true, manual_mode: true, activation_type: 'manual-on' };
          break;
        case 'manual-off':
          coapState = 0;
          coapManualMode = 1;
          dbUpdates = { activated: false, manual_mode: true, activation_type: 'manual-off' };
          break;
        case 'automatic':
          coapState = 0; // Set light off initially when switching to auto
          coapManualMode = 0;
          dbUpdates = { activated: false, manual_mode: false, activation_type: 'automatic' };
          break;
        default:
          return res.status(400).json({ error: 'Invalid mode specified' });
      }

      // Call CoAP command
      turnOnLightManual(device.ipv6_address, coapState, coapManualMode);
      httpLogger.info(`CoAP command turnOnLightManual(${device.ipv6_address}, ${coapState}, ${coapManualMode}) sent for device ${mac} in mode ${mode}.`);

      // Update database
      await deviceOperations.updateDevice(mac, dbUpdates);
      io.emit('devices_updated');
      
      // Fetch the updated device to return
      const updatedDevice = await deviceOperations.getDeviceByMac(mac);
      res.json(updatedDevice);

    } catch (error) {
      httpLogger.error(`Error controlling device ${mac} to mode ${mode}: ${error.message}`);
      res.status(500).json({ error: `Failed to control device: ${error.message}` });
    }
  });

  /**
   * Relationship management API endpoints
   */
  // Get all relationships
  app.get('/api/relationships', async (req, res) => {
    try {
      const relationships = await relationshipOperations.getAllRelationships();
      res.json(relationships);
    } catch (error) {
      httpLogger.error(`Error fetching relationships: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all relationships with device information
  app.get('/api/relationships/full', async (req, res) => {
    try {
      const relationships = await relationshipOperations.getRelationshipsWithDeviceInfo();
      res.json(relationships);
    } catch (error) {
      httpLogger.error(`Error fetching relationships with device info: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Add a new relationship
  app.post('/api/relationships', async (req, res) => {
    try {
      const result = await relationshipOperations.addRelationship(req.body);
      res.status(201).json(result);
    } catch (error) {
      httpLogger.error(`Error adding relationship: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a relationship
  app.put('/api/relationships/:id', async (req, res) => {
    try {
      const result = await relationshipOperations.updateRelationship(req.params.id, req.body);
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Relationship not found' });
      }
      res.json({ updated: true, id: req.params.id });
    } catch (error) {
      httpLogger.error(`Error updating relationship: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a relationship
  app.delete('/api/relationships/:id', async (req, res) => {
    try {
      const result = await relationshipOperations.deleteRelationship(req.params.id);
      if (!result.deleted) {
        return res.status(404).json({ error: 'Relationship not found' });
      }
      res.json({ deleted: true, id: req.params.id });
    } catch (error) {
      httpLogger.error(`Error deleting relationship: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Get relationships by sensor MAC
  app.get('/api/relationships/sensor/:mac', async (req, res) => {
    try {
      const relationships = await relationshipOperations.getRelationshipsBySensor(req.params.mac);
      res.json(relationships);
    } catch (error) {
      httpLogger.error(`Error fetching relationships: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Get relationships by actuator MAC
  app.get('/api/relationships/actuator/:mac', async (req, res) => {
    try {
      const relationships = await relationshipOperations.getRelationshipsByActuator(req.params.mac);
      res.json(relationships);
    } catch (error) {
      httpLogger.error(`Error fetching relationships: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  });

  // Serve static files for device images
  app.use('/data/images', express.static(path.join(__dirname, '../data/images')));
}

module.exports = {initializeRoutes};
