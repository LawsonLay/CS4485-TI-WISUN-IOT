const coap = require('coap');
const { deviceOperations, relationshipOperations } = require('./database'); // Import deviceOperations and relationshipOperations
const { httpLogger } = require('./logger'); // Assuming logger is setup
const {BorderRouterManager} = require('./BorderRouterManager.js'); // Import BorderRouterManager
const { postLEDStates } = require('./coapCommands.js'); // Import postLEDStates

const server = coap.createServer(
    {
        type: 'udp6',
        sendAcksForNonConfirmablePackets: false
    })

function startCoapServer(borderRouterManager) {

    server.listen(5683, () => {
        console.log('CoAP server is listening on port 5683');
        httpLogger.info('CoAP server is listening on port 5683'); // Use logger
    })

    server.on('request', async (req, res) => { // Make handler async
        console.log(`Received CoAP request - Method: ${req.method}, URL: ${req.url}, From: ${req.rsinfo.address}`);
        httpLogger.info(`Received CoAP request - Method: ${req.method}, URL: ${req.url}, From: ${req.rsinfo.address}`);

        // Check if it's a POST request to /connect_web_app
        if (req.method === 'POST' && req.url === '/connect_web_app') {
            const incomingAddress = req.rsinfo.address;
            const payloadBuffer = req.payload;
            let payloadJson;
            let vendorClass = "Unknown"; // Default vendor class
            let macHex = null;

            try {
                const payloadString = payloadBuffer.toString('utf8');
                httpLogger.info(`Received payload string on /connect_web_app: ${payloadString}`);
                payloadJson = JSON.parse(payloadString);

                // Validate JSON structure
                if (!payloadJson || typeof payloadJson.mac !== 'string' || typeof payloadJson.vendor_class !== 'string') {
                    throw new Error('Invalid JSON payload structure. Missing or invalid "mac" or "vendor_class".');
                }
                
                macHex = payloadJson.mac;
                vendorClass = payloadJson.vendor_class; // Use received vendor class

            } catch (error) {
                httpLogger.error(`Failed to parse JSON payload from ${incomingAddress}: ${error.message}`);
                res.code = '4.00'; // Bad Request
                res.end('Invalid JSON payload');
                return; // Stop processing
            }

            // Assuming the payload mac is a 6-byte or 8-byte address hex string
            if (macHex && (macHex.length === 12 || macHex.length === 16)) { // Check for 6 or 8 bytes hex string
                const bytes = [];
                for (let i = 0; i < macHex.length; i += 2) {
                    bytes.push(macHex.substring(i, i + 2));
                }
                const mac = bytes.join(':').toUpperCase(); // Standardize MAC format
                httpLogger.info(`Device ${incomingAddress} reported MAC Address: ${mac}, Vendor Class: ${vendorClass}`);

                // Add or update the device in the database
                try {
                    await deviceOperations.ensureDeviceExists(
                        mac,
                        incomingAddress,
                        "NEW DEVICE", // Default name
                        vendorClass,  // Use extracted vendor class
                        vendorClass      // Default type
                    );
                    httpLogger.info(`Successfully processed connection for MAC: ${mac}`);

                    try {
                        // Trigger updates concurrently
                        await Promise.all([
                            borderRouterManager.updateNCPProperties(),
                            borderRouterManager.updateTopology()
                        ]);
                    } catch (error) {
                        httpLogger.error(`Error refreshing network state: ${error.message}`);
                    }
                    
                } catch (error) {
                    httpLogger.error(`Database operation failed for MAC ${mac}: ${error.message}`);
                    // Consider sending 5.00 Server Error if DB fails
                }

            } else {
                httpLogger.warn(`Received invalid MAC hex (${macHex}) from ${incomingAddress} in JSON payload. Requires 12 or 16 hex chars.`);
                // Optionally send a Bad Request response if MAC format is wrong
                res.code = '4.00'; 
                res.end('Invalid MAC format in JSON');
                return; 
            }

            res.code = '2.05'; // Content
            res.end('Received connection request');
        } else if (req.method === 'POST' && req.url === '/button_activated') {
            const sensorIPv6 = req.rsinfo.address;
            httpLogger.info(`Received button activation from ${sensorIPv6}`);

            try {
                // 1. Find the sensor device by its IPv6 address
                const sensorDevice = await deviceOperations.getDeviceByIPv6(sensorIPv6);
                if (!sensorDevice) {
                    httpLogger.warn(`Button activation from unknown device IP: ${sensorIPv6}`);
                    res.code = '4.04'; // Not Found
                    res.end('Sensor device not found');
                    return;
                }
                const sensorMac = sensorDevice.mac_address;
                httpLogger.info(`Button activation identified from sensor MAC: ${sensorMac}`);

                // 2. Find relationships where this device is the sensor
                const relationships = await relationshipOperations.getRelationshipsBySensor(sensorMac);
                if (!relationships || relationships.length === 0) {
                    httpLogger.info(`No relationships found for sensor MAC: ${sensorMac}`);
                    res.code = '2.05'; // Content (Acknowledged, but no action)
                    res.end('No actuator relationships found');
                    return;
                }

                httpLogger.info(`Found ${relationships.length} relationship(s) for sensor ${sensorMac}`);

                // 3. For each relationship, find the actuator and trigger it
                let actuatorsTriggered = 0;
                for (const relationship of relationships) {
                    const actuatorMac = relationship.actuator_mac;
                    const actuatorDevice = await deviceOperations.getDeviceByMac(actuatorMac);

                    if (actuatorDevice && actuatorDevice.ipv6_address) {
                        httpLogger.info(`Triggering actuator ${actuatorMac} (${actuatorDevice.ipv6_address}) via relationship ${relationship.id}`);
                        // Call postLEDStates: targetIP = actuator IPv6, color = 'red', newValue = 0
                        postLEDStates(actuatorDevice.ipv6_address, 'red', 0);
                        actuatorsTriggered++;
                    } else {
                        httpLogger.warn(`Actuator ${actuatorMac} in relationship ${relationship.id} not found or has no IPv6 address.`);
                    }
                }

                res.code = '2.04'; // Changed
                res.end(`Triggered ${actuatorsTriggered} actuator(s)`);

            } catch (error) {
                httpLogger.error(`Error processing button activation from ${sensorIPv6}: ${error.message}`);
                res.code = '5.00'; // Internal Server Error
                res.end('Error processing request');
            }
        } else {
            // Handle other requests or send a default response
            httpLogger.info(`Received unhandled CoAP request: ${req.method} ${req.url}`);
            res.code = '4.04'; // Not Found or appropriate code
            res.end('Not Found'); // Changed response message
        }
    })
}

module.exports = {startCoapServer};