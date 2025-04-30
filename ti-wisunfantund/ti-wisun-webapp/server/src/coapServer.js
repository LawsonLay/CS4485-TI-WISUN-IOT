const coap = require('coap');
const { deviceOperations } = require('./database'); // Import deviceOperations
const { httpLogger } = require('./logger'); // Assuming logger is setup
const {BorderRouterManager} = require('./BorderRouterManager.js'); // Import BorderRouterManager

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
        } else {
            // Handle other requests or send a default response
            httpLogger.info(`Received unhandled CoAP request: ${req.method} ${req.url}`);
            res.code = '4.04'; // Not Found or appropriate code
            res.end('Not Found'); // Changed response message
        }

        try {
            // Trigger updates concurrently
            await Promise.all([
                borderRouterManager.updateNCPProperties(),
                borderRouterManager.updateTopology()
            ]);
        } catch (error) {
            httpLogger.error(`Error refreshing network state: ${error.message}`);
        }
    })
}

module.exports = {startCoapServer};