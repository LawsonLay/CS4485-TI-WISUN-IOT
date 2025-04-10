const coap = require('coap');
/*URI define*/
const COAP_SENSOR_URI = "sensor";
/**/
const COAP_MAC_ADDRESS_URI = "mac_address";
const COAP_VENDOR_CLASS_URI = "vendor_class";
const { getRelationshipsBySensor } = require('./relationshipOperations');
const { response } = require('express');

/*address*/
const COAP_PORT = 5683;
const BR_ADDRESS = '2020:abcd::';

/*COAP METHOD*/
const COAP_METHOD_GET = 'GET';
const COAP_METHOD_POST = 'POST';
const COAP_METHOD_PUT = 'PUT';

function initializeCoAPServer(coapServer){
	/*coap server endpoint functionality*/
	server.listen(COAP_PORT, BR_ADDRESS, () => {
	  console.log('CoAP server listening on coap://['+BR_ADDRESS+']:'+COAP_PORT);
	});

	// POST COAP_SENSOR_URI
	server.on('request', (request, response) => {
        const uriPath = req.url.split('/').filter(Boolean);
        const senderIP = request.rsinfo.address;

        if (uriPath.length === 0) {
            res.code = '4.04'; // Not Found
            return res.end('No URI specified');
        }

        const coapPacketType = uriPath[0];
        const sensor_status = req.payload;

        if(coapPacketType == COAP_SENSOR_URI && request.method == COAP_METHOD_POST) {
            callbackRequestSensorToActuator(sendorIP, sensor_status);
            response.end('ack');
        }
        else {
            console.log('Unknown CoAP request:', uriPath);
                res.code = '4.04';
                res.end('Unknown URI');
        }

	});
}

/*
counter_display will (in firmware) turn off once it's recieved the POST (1) request
counter_display : seven_segment_display
light: street_lights
*/
async function callbackRequestSensorToActuator(sensorIP, sensor_status){
    // senderIP --> senderMacAddress
    let sensorNode = nodes.find(node => node.data.id === sensorIP);
    let sensorMac = sensorNode.data.macAddressState;
    
    try {
        // senderMacAddress : {actuatorMacAddress} (1-n) in relationships sqlite DB table
        let relationships = await getRelationshipsBySensor(sensorMac);
        for (relationship of relationships) {
            let actuatorMacAddress = relationship.actuator_mac;
            let actuatorNode = nodes.find(node => node.data.macAddressState === actuatorMacAddress);
            let actuatorIP = actuatorNode.data.ipAddressState;
            if (actuatorNode) {
                if (relationship.actuator_type=="street_light"){
                    // sensor_status = 0 or 1
                    postLightState(actuatorIP, sensor_status); // will turn off after delay in firmware
                }
                //else if (other actuator_types)
                else if(relationship.actuator_type=="counter_display"){
                    // sensor_status = number
                    postCounterState(actuatorIP, sensor_status);
                }
            }
        }

    }
    catch (error) {
        console.error('Error fetching relationships:', error);
    }

}