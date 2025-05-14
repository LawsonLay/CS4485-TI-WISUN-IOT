const coap = require('coap');
const { deviceOperations, relationshipOperations } = require('./database'); 
const { httpLogger } = require('./logger'); 
const {BorderRouterManager} = require('./BorderRouterManager.js'); 
const { turnOnLightForSetTime } = require('./coapCommands.js'); 

const server = coap.createServer(
    {
        type: 'udp6',
        sendAcksForNonConfirmablePackets: false
    })

function startCoapServer(borderRouterManager, io) {

    server.listen(5683, () => {
        httpLogger.info('CoAP server is listening on port 5683'); 
    })

    server.on('error', (err) => {
        httpLogger.error(`CoAP server error: ${err.message}`, err);
        console.error('CoAP server encountered an error:', err);
        // Avoid crashing the process for timeout errors specifically
        if (err instanceof coap.RetrySendError) {
            httpLogger.warn('Caught a RetrySendError at the server level, likely due to client timeout.');
        } else if (err.code === 'EADDRINUSE') {
             console.error('CoAP server error: Address in use, exiting.');
             process.exit(1); // Exit for critical errors like port conflict
        }
    });

    server.on('request', async (req, res) => { 
        //console.log(`Received CoAP request - Method: ${req.method}, URL: ${req.url}, From: ${req.rsinfo.address}`);
        httpLogger.info(`Received CoAP request - Method: ${req.method}, URL: ${req.url}, From: ${req.rsinfo.address}`);

        // Check if it's a POST request to /connect_web_app
        if (req.method === 'POST' && req.url === '/connect_web_app') {
            const incomingAddress = req.rsinfo.address;
            const payloadBuffer = req.payload;
            let payloadJson;
            let vendorClass = "Unknown"; 
            let macHex = null;

            try {
                const payloadString = payloadBuffer.toString('utf8');
                //httpLogger.info(`Received payload string on /connect_web_app: ${payloadString}`);
                payloadJson = JSON.parse(payloadString);

                // Validate JSON structure
                if (!payloadJson || typeof payloadJson.mac !== 'string' || typeof payloadJson.vendor_class !== 'string') {
                    throw new Error('Invalid JSON payload structure. Missing or invalid "mac" or "vendor_class".');
                }
                
                macHex = payloadJson.mac;
                vendorClass = payloadJson.vendor_class; 

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
                        "NEW DEVICE",
                        vendorClass,  
                        vendorClass      
                    );
                    //httpLogger.info(`Successfully processed connection for MAC: ${mac}`);
                    io.emit('devices_updated');

                   // Trigger background updates AFTER sending the response.
                    // Do not await these promises here; let them run in the background.
                    // Use .then().catch() for logging success/failure of background tasks.
                    // Promise.all([
                    //     borderRouterManager.updateNCPProperties(),
                    //     borderRouterManager.updateTopology()
                    // ]).then(() => {
                    //     httpLogger.info(`Background network state refresh triggered successfully after registration of MAC ${mac}.`);
                    // }).catch(error => {
                    //     httpLogger.error(`Error during background network state refresh triggered by ${mac}: ${error.message}`);
                    // });

                    return; // Request handling complete

                } catch (error) {
                    httpLogger.error(`Database operation failed for MAC ${mac}: ${error.message}`);
                    // Send 5.00 Server Error if DB fails before response is sent
                    res.code = '5.00';
                    res.end('Internal Server Error during device registration');
                    return;
                }

            } else {
                httpLogger.warn(`Received invalid MAC hex (${macHex}) from ${incomingAddress} in JSON payload. Requires 12 or 16 hex chars.`);
                // Send a Bad Request response if MAC format is wrong
                res.code = '4.00';
                res.end('Invalid MAC format in JSON');
                return;
            }
        } else if (req.method === 'POST' && req.url === '/fsr_activated') {
            const sensorIPv6 = req.rsinfo.address;
            let receivedDirection = -1;

            try {
                const directionInt = req.payload.readUInt8(0);
                if (directionInt >= 0 && directionInt <= 3) {
                    receivedDirection = directionInt;
                    httpLogger.info(`Parsed ${sensorIPv6}'s direction from payload: ${receivedDirection}`);
                } else {
                    httpLogger.warn(`Invalid or missing 'direction' in FSR payload from ${sensorIPv6}.`);
                }
            } catch (error) {
                httpLogger.error(`Failed to parse uint8 payload for FSR activation from ${sensorIPv6}: ${error.message}`);
            }

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
                //httpLogger.info(`${sensorIPv6} fsr activation identified from sensor MAC: ${sensorMac}`);

                // 2. Find relationships where this device is the sensor
                let relationships = await relationshipOperations.getRelationshipsBySensor(sensorMac);

                // Filter relationships by the received direction
                if (receivedDirection !== -1) {
                    relationships = relationships.filter(r => r.direction === receivedDirection);
                    //httpLogger.info(`Filtered relationships by direction ${receivedDirection}.`);
                } else {
                    httpLogger.warn(`Proceeding without direction filtering as it was not valid in payload for sensor ${sensorMac}.`);
                }

                if (!relationships || relationships.length === 0) {
                    httpLogger.info(`No relationships with direction ${receivedDirection} found for sensor MAC: ${sensorMac}`);
                    res.code = '2.05'; // Content (Acknowledged, but no action)
                    res.end('No actuator relationships found');
                    return;
                }

                //httpLogger.info(`Found ${relationships.length} relationship(s) with direction ${receivedDirection} for sensor ${sensorMac}`);

                // 3. For each relationship, find the actuator and trigger it
                let actuatorsTriggered = 0;
                let anUpdateOccurred = false;
                for (const relationship of relationships) {
                    const actuatorMac = relationship.actuator_mac;
                    const actuatorDevice = await deviceOperations.getDeviceByMac(actuatorMac);
                    const setTime = relationship.set_time || 1;

                    if (!actuatorDevice) {
                        httpLogger.warn(`Actuator ${actuatorMac} in relationship ${relationship.id} not found in database.`);
                        continue;
                    }

                    // Check if actuator is in manual mode
                    if (actuatorDevice.manual_mode) {
                        httpLogger.info(`Actuator ${actuatorMac} (IP: ${actuatorDevice.ipv6_address}) is in manual mode. Skipping automatic activation for relationship ${relationship.id}.`);
                        continue; // Skip to the next relationship
                    }

                    if (actuatorDevice.ipv6_address) {
                        httpLogger.info(`Activating relationship ${relationship.id}: Sensor ${sensorMac}, Actuator ${actuatorMac} (IP: ${actuatorDevice.ipv6_address}) for ${setTime}s.`);

                        // Update database for sensor and actuator: activated = true
                        try {
                            await deviceOperations.updateDevice(sensorMac, { activated: true });
                            await deviceOperations.updateDevice(actuatorMac, { activated: true });
                            anUpdateOccurred = true;
                            //httpLogger.info(`DB updated: Sensor ${sensorMac} and Actuator ${actuatorMac} set to activated.`);
                        } catch (dbUpdateError) {
                            httpLogger.error(`Error updating DB for relationship ${relationship.id} activation: ${dbUpdateError.message}`);
                        }

                        // Trigger the light
                        turnOnLightForSetTime(actuatorDevice.ipv6_address, setTime);
                        actuatorsTriggered++;

                        // Set a timer to deactivate
                        setTimeout(async () => {
                            try {
                                //httpLogger.info(`Timer expired for relationship ${relationship.id}. Deactivating Sensor ${sensorMac} and Actuator ${actuatorMac}.`);
                                await deviceOperations.updateDevice(sensorMac, { activated: false });
                                await deviceOperations.updateDevice(actuatorMac, { activated: false });
                                httpLogger.info(`Sensor ${sensorMac} and Actuator ${actuatorMac} deactivated after timer.`);
                                io.emit('devices_updated');
                            } catch (timerDbError) {
                                httpLogger.error(`Error in timer deactivating devices for relationship ${relationship.id}: ${timerDbError.message}`);
                            }
                        }, setTime * 1000);

                    } else {
                        httpLogger.warn(`Actuator ${actuatorMac} in relationship ${relationship.id} has no IPv6 address.`);
                    }
                }

                if (anUpdateOccurred) {
                    //httpLogger.info(`Initial FSR activation DB updates complete. Emitting devices_updated.`);
                    io.emit('devices_updated'); 
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