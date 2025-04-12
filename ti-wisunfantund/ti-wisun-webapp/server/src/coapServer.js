const coap = require('coap');
const {getTopology} = require('./ClientState');
const {postLightState, postCounterState} = require('./coapCommands.js');

/*URI define*/
const COAP_SENSOR_URI = "sensor";
const COAP_LIGHT_URI = "light";

/**/
const COAP_MAC_ADDRESS_URI = "mac_address";
const COAP_VENDOR_CLASS_URI = "vendor_class";
const {deviceOperations, relationshipOperations} = require('./database.js');
const { response } = require('express');

/*address*/
const COAP_PORT = 5683;
const BR_ADDRESS = '2020:abcd::';

/*COAP METHOD*/
const COAP_METHOD_GET = 'GET';
const COAP_METHOD_POST = 'POST';
const COAP_METHOD_PUT = 'PUT';

/*TOPOLOGY NODES*/
const nodes = getTopology().graph.nodes;
const node = nodes.find(node => node.data.id === targetIP);

function initializeCoAPServer(coapServer){
	/*coap server endpoint functionality*/
	coapServer.listen(COAP_PORT, BR_ADDRESS, () => {
	  console.log('CoAP server listening on coap://['+BR_ADDRESS+']:'+COAP_PORT);
	});

	// POST COAP_SENSOR_URI
	coapServer.on('request', (request, response) => {
        const uriPath = request.url.split('/').filter(Boolean);
        const senderIP = request.rsinfo.address;

        if (uriPath.length === 0) {
            response.code = '4.04'; // Not Found
            return response.end('No URI specified');
        }

        const coapPacketType = uriPath[0];
        const sensor_status = request.payload;

        if(coapPacketType == COAP_SENSOR_URI && request.method == COAP_METHOD_POST) {
            callbackRequestSensorToActuator(senderIP, sensor_status);
            response.end('ack');
        }
        else if(coapPacketType == COAP_LIGHT_URI && request.method == COAP_METHOD_POST) {
            turnoffLightinDB(senderIP);
            response.end('ack');
        }
        else {
            console.log('Unknown CoAP request:', uriPath);
                response.code = '4.04';
                response.end('Unknown URI');
        }

	});
}

async function turnoffLightinDB(lightIP) {
    let lightNode = nodes.find(node => node.data.id === sensorIP);
    let lightMac = lightNode.data.macAddressState;

    let updates = { activated : 0 };
    try {
        await updateDevice(actuatorMacAddress, updates);
        } catch (error) {
        console.error('Error updating:', error);
        }
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
        let relationships = await relationshipOperations.getRelationshipsBySensor(sensorMac);
        for (relationship of relationships) {
            let actuatorMacAddress = relationship.actuator_mac;
            let actuatorNode = nodes.find(node => node.data.macAddressState === actuatorMacAddress);
            let actuatorDevice = await deviceOperations.getDeviceByMac(actuatorMacAddress);

            if (actuatoactuatorNode && actuatorNode.datarNode) {
                let actuatorIP = actuatorNode.data.ipAddressState;
                if (relationship.actuator_type=="street_light"){
                    // sensor_status = 0 or 1
                    postLightState(actuatorIP, sensor_status); // will turn off after delay in firmware
                    // update light to on
                    let updates = { activated: 1 };
                    try {
                        await updateDevice(actuatorMacAddress, updates);
                      } catch (error) {
                        console.error('Error updating database:', error);
                      }
                }
                //else if (other actuator_types)
                else if(relationship.actuator_type=="counter_display"){
                    
                    // sensor_status = number
                    let count = actuatorDevice.activated;

                    // increment count if 1, decrease if 0
                    if(sensor_status) 
                        count++;
                    else 
                        count--;

                    // send request to counter device to update to new count
                    postCounterState(actuatorIP, count);
                    
                    // update count to new count
                    let updates = { activated: count };
                    try {
                        await updateDevice(actuatorMacAddress, updates);
                      } catch (error) {
                        console.error('Error updating database:', error);
                      }
                }
            }
        }

    }
    catch (error) {
        console.error('Error fetching relationships:', error);
    }

}