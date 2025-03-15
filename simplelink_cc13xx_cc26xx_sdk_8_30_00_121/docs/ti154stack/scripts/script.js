

/* Copyright (C) 2020 Texas Instruments Incorporated - http://www.ti.com/
*
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions
* are met:
*
* Redistributions of source code must retain the above copyright
* notice, this list of conditions and the following disclaimer.
*
* Redistributions in binary form must reproduce the above copyright
* notice, this list of conditions and the following disclaimer in the
* documentation and/or other materials provided with the
* distribution.
*
* Neither the name of Texas Instruments Incorporated nor the names of
* its contributors may be used to endorse or promote products derived
* from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
* "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
* LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
* A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
* OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
* LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
* DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
* THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/* Keep track of input errors */
var error= {poll: false, sup: false, txR: false, rxR: false, txD: false, rxD: false, bat: false};

function constrainPhyValue(){
	/* Change the power options depending on the device selected */
	var dev = document.getElementById("Device");
	var chosenDev = dev.options[dev.selectedIndex].value;
	/* Update the phy options here */
	var phy = document.getElementById("Phy");
	var phylen = phy.length;
	/* Clear the lists of all phy options */
	for(var i = 0; i<phylen; i++){
		phy.remove(i);
	}
	phy.remove(phy.selectedIndex);

	/* If CC1352R, then 2.4/915/868 phy, -20 > 5(2.4) -20 > 14(sub) */
	if (chosenDev == "CC1352R"){
		var opt1 = document.createElement("option");
		opt1.value="p24g";
		opt1.text=" 2.4 GHz";
		phy.options.add(opt1,phy[0]);
		var opt2 = document.createElement("option");
		opt2.value="p915";
		opt2.text="Sub-G 915 MHz";
		phy.options.add(opt2,phy[1]);
		var opt3 = document.createElement("option");
		opt3.value="p868";
		opt3.text="Sub-G 868 MHz";
		phy.options.add(opt3,phy[2]);
	}
	/* If CC2652R, then 2.4 phy, -20 > 5 */
	if (chosenDev == "CC26x2R"){
		var opt1 = document.createElement("option");
		opt1.value="p24g";
		opt1.text=" 2.4 GHz";
		phy.options.add(opt1,phy[0]);
	}
	/* If CC1312R, then 915/868 phy, -20 > 14 */
	if (chosenDev == "CC1312R"){
		var opt2 = document.createElement("option");
		opt2.value="p915";
		opt2.text="Sub-G 915 MHz";
		phy.options.add(opt2,phy[0]);
		var opt3 = document.createElement("option");
		opt3.value="p868";
		opt3.text="Sub-G 868 MHz";
		phy.options.add(opt3,phy[1]);
	}
	/* If CC1352p2, then 2.4/915/868 phy, -20 > 20(2.4) -20 > 14(sub) */
	if (chosenDev == "CC1352P2"){
		var opt1 = document.createElement("option");
		opt1.value="p24g";
		opt1.text=" 2.4 GHz";
		phy.options.add(opt1,phy[0]);
		var opt2 = document.createElement("option");
		opt2.value="p915";
		opt2.text="Sub-G 915 MHz";
		phy.options.add(opt2,phy[1]);
		var opt3 = document.createElement("option");
		opt3.value="p868";
		opt3.text="Sub-G 868 MHz";
		phy.options.add(opt3,phy[2]);
	}
	if (chosenDev == "CC1352P4"){
		var opt1 = document.createElement("option");
		opt1.value="p24g";
		opt1.text=" 2.4 GHz";
		phy.options.add(opt1,phy[0]);
		var opt2 = document.createElement("option");
		opt2.value="p433";
		opt2.text="Sub-G 433 MHz";
		phy.options.add(opt2,phy[1]);
	}
	/* If CC1352p1, then 915/868 phy, -20 > 20 */
	if (chosenDev == "CC1352P1"){
		var opt2 = document.createElement("option");
		opt2.value="p915";
		opt2.text="Sub-G 915 MHz";
		phy.options.add(opt2,phy[0]);
		var opt3 = document.createElement("option");
		opt3.value="p868";
		opt3.text="Sub-G 868 MHz";
		phy.options.add(opt3,phy[1]);
	}
	/* If CC2652P, then 2.4 phy, -20 > 20 */
	if (chosenDev == "CC26x2P"){
		var opt1 = document.createElement("option");
		opt1.value="p24g";
		opt1.text=" 2.4 GHz";
		phy.options.add(opt1,phy[0]);
	}

	constrainRateValue();
	document.getElementById('Phy').selectedIndex=0;
	calculateBeaconInterval();
}

/* Change the data rate options depending on the phy selected */
function constrainRateValue(){
	/* Will also need to update tx_power options */
	var phy = document.getElementById("Phy");
	var chosenPhy = phy.options[phy.selectedIndex].value;
	var dr = document.getElementById("Data_Rate");
	document.getElementById("Data_Rate").length = 0;

	if (chosenPhy == "p24g"){
		var opt1 = document.createElement("option");
		opt1.value="data250";
		opt1.text="250 KBps";
		dr.options.add(opt1);
	}
	if ((chosenPhy == "p915") || (chosenPhy == "p868")){
		var dr = document.getElementById("Data_Rate");
		var opt1 = document.createElement("option");
		opt1.value="data50";
		opt1.text="50 KBps";
		document.getElementById("Data_Rate").options.add(opt1);
		var opt2 = document.createElement("option");
		opt2.value="data5";
		opt2.text="5 KBps";
		document.getElementById("Data_Rate").options.add(opt2);
		var opt3 = document.createElement("option");
		opt3.value="data200";
		opt3.text="200 KBps";
		document.getElementById("Data_Rate").options.add(opt3);
	}
	if (chosenPhy == "p433"){
		var dr = document.getElementById("Data_Rate");
		var opt1 = document.createElement("option");
		opt1.value="data50";
		opt1.text="50 KBps";
		document.getElementById("Data_Rate").options.add(opt1);
		var opt2 = document.createElement("option");
		opt2.value="data5";
		opt2.text="5 KBps";
		document.getElementById("Data_Rate").options.add(opt2);
	}
	document.getElementById('Data_Rate').selectedIndex=0;
	constrainPowerValue();
	calculateBeaconInterval();
}

function constrainPollInterval(){
	var mode = document.getElementById("Mode").value;
	console.log(document.getElementById("poll_tip"))
	if (mode == "bcn"){
		//update the label
		document.getElementById("poll").innerHTML = "Bcn Order:";
		//set the default
		document.getElementById("poll_int").value = 8;
		//change the tooltip
		document.getElementById("poll_tip").innerHTML = "Used to configure the interval between beacon transmissions for your network. Range: 1 to 15";
	}
	if (mode == "non_bcn"){
		//update the label
		document.getElementById("poll").innerHTML = "Poll Interval [sec]:";
		//set the default
		document.getElementById("poll_int").value = 1;
		//change the tooltip
		document.getElementById("poll_tip").innerHTML = "Interval at which the end device polls the parent device. Range: 1 sec to 86400 sec";

	}
	calculateBeaconInterval();
}

function constrainPowerValue(){
	/* Change the power options depending on the device selected */
	var dev = document.getElementById("Device");
	var chosenDev = dev.options[dev.selectedIndex].value;
	var phy = document.getElementById("Phy");
	var chosenPhy = phy.options[phy.selectedIndex].value;
	/* Update the tx_power options here */
	var tx = document.getElementById("tx_power");
	document.getElementById("tx_power").length = 0;
	/* If CC1352R, then 2.4/915/868 phy, -20 > 5(2.4) -20 > 14(sub) */
	if (chosenDev == "CC1352R"){
		if (chosenPhy == "p24g"){
			/* -20 > 5 */
			var nums = [5,4,3,2,1,0,-3,-5,-6,-9,-10,-12,-15,-18,-20];
			for (var i =0; i<nums.length;i++){
				var opt = document.createElement("option");
				opt.text=nums[i].toString();
				document.getElementById("tx_power").options.add(opt);
			}

			document.getElementById('tx_power').selectedIndex=0;
		}
		else{
			/* -20 > 14 */
			var nums = [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,-5,-10,-15,-20];
			for (var i =0; i<nums.length;i++){
				var opt = document.createElement("option");
				opt.text=nums[i].toString();
				document.getElementById("tx_power").options.add(opt);
			}

			document.getElementById('tx_power').selectedIndex=0;
		}
	}
	/* If CC2652R, then 2.4 phy, -20 > 5 */
	if (chosenDev == "CC26x2R"){
		/* -20 > 5 */
		var nums = [5,4,3,2,1,0,-3,-5,-6,-9,-10,-12,-15,-18,-20];
		for (var i =0; i<nums.length;i++){
			var opt = document.createElement("option");
			opt.text=nums[i].toString();
			document.getElementById("tx_power").options.add(opt);
		}

		document.getElementById('tx_power').selectedIndex=0;
	}
	/* If CC1312R, then 915/868 phy, -20 > 14 */
	if(chosenDev == "CC1312R"){
		/* -20 > 14 */
		var nums = [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,-5,-10,-15,-20];
		for (var i =0; i<nums.length;i++){
			var opt = document.createElement("option");
			opt.text=nums[i].toString();
			document.getElementById("tx_power").options.add(opt);
		}

		document.getElementById('tx_power').selectedIndex=0;
	}
	/* If CC1352p2, then 2.4/915/868 phy, -20 > 20(2.4) -20 > 14(sub) */
	if (chosenDev == "CC1352P2"){
		if (chosenPhy == "p24g"){
			/* -20 > 20 */
			var nums = [20,19,18,17,16,15,14,5,4,3,2,1,0,-3,-5,-6,-9,-10,-12,-15,-18,-20];
			for (var i =0; i<nums.length;i++){
				var opt = document.createElement("option");
				opt.text=nums[i].toString();
				document.getElementById("tx_power").options.add(opt);
			}

			document.getElementById('tx_power').selectedIndex=0;
		}
		else{
			/* -20 > 14 */
			var nums = [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,-5,-10,-15,-20];
			for (var i =0; i<nums.length;i++){
				var opt = document.createElement("option");
				opt.text=nums[i].toString();
				document.getElementById("tx_power").options.add(opt);
			}

			document.getElementById('tx_power').selectedIndex=0;
		}
	}
	/* If CC1352p4, then 2.4/433 phy, -20 > 10(2.4) -11 > 13(sub)
		(2.4)10,9,8,7,6,5,4,3,2,1,0,-3,-5,-6,-9,-10,-12,-15,-18,-20
		(sub)13,12,11,10,9,8,7,6,5,4,3,2,1,0,-6,-8,-11
	*/
	if(chosenDev == "CC1352P4"){
		if (chosenPhy == "p24g"){
			/* -20 > 10
			(2.4)10,9,8,7,6,5,4,3,2,1,0,-3,-5,-6,-9,-10,-12,-15,-18,-20
			*/
			var nums = [10,9,8,7,6,5,4,3,2,1,0,-3,-5,-6,-9,-10,-12,-15,-18,-20];
			for (var i =0; i<nums.length;i++){
				var opt = document.createElement("option");
				opt.text=nums[i].toString();
				document.getElementById("tx_power").options.add(opt);
			}

			document.getElementById('tx_power').selectedIndex=0;
		}
		else{
			/* -11 > 13
			(sub)13,12,11,10,9,8,7,6,5,4,3,2,1,0,-6,-8,-11
			*/
			var nums = [13,12,11,10,9,8,7,6,5,4,3,2,1,0,-6,-8,-11];
			for (var i =0; i<nums.length;i++){
				var opt = document.createElement("option");
				opt.text=nums[i].toString();
				document.getElementById("tx_power").options.add(opt);
			}

			document.getElementById('tx_power').selectedIndex=0;
		}
	}
	/* If CC1352p1, then 915/868 phy, -20 > 20 */
	if(chosenDev == "CC1352P1"){
		/* -20 > 20 */
		var nums = [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,-5,-10,-15,-20];
		for (var i =0; i<nums.length;i++){
			var opt = document.createElement("option");
			opt.text=nums[i].toString();
			document.getElementById("tx_power").options.add(opt);
		}

		document.getElementById('tx_power').selectedIndex=0;
	}
	/* If CC2652P, then 2.4 phy, -20 > 20 */
	if(chosenDev == "CC26x2P"){
		/* -20 > 20 */
		var nums = [20,19,18,17,16,15,14,5,4,3,2,1,0,-3,-5,-6,-9,-10,-12,-15,-18,-20];
		for (var i =0; i<nums.length;i++){
			var opt = document.createElement("option");
			opt.text=nums[i].toString();
			document.getElementById("tx_power").options.add(opt);
		}

		document.getElementById('tx_power').selectedIndex=0;
	}
}



function pollIntValidation(){
	/* Verify the Polling Interval */
	pollinterval=document.getElementById("poll_int").value;
	mode = document.getElementById("Mode").value;
	if (mode == "non_bcn"){
		/* Check if its not a number */
		if (isNaN(pollinterval)){
			if (pollinterval.search('.') != "0"){
				poll= parseFloat(pollinterval, 10);
				/* Check if the polling int. is less than the min or greater than the min*/
				if (poll.toFixed(2) <= 1 || poll.toFixed(3) > 86400){
					error.poll = true;
					document.getElementById("poll_int").style.border="1px solid #CC0000";
					document.getElementById("poll_int_tip").style.backgroundColor="#CC0000";
				}
				else{
					error.poll = false;
					document.getElementById("poll_int").style.border="1px solid #e5e5e5";
					document.getElementById("poll_int_tip").style.backgroundColor="#AAAAAA";
				}
			}
		}
		/* If it is a number */
		else{
			if (pollinterval.length== 0){
				error.poll = true;
				document.getElementById("poll_int").style.border="1px solid #CC0000";
				document.getElementById("poll_int_tip").style.backgroundColor="#CC0000";
			}
			else{
				poll= parseFloat(pollinterval, 10);
				/* Check if the polling int. is less than the minimum or greater than the maximum*/
				if (poll.toFixed(2) < 1 || poll.toFixed(3) > 86400){
					error.poll = true;
					document.getElementById("poll_int").style.border="1px solid #CC0000";
					document.getElementById("poll_int_tip").style.backgroundColor="#CC0000";
				}
				else{
					error.poll = false;
					document.getElementById("poll_int").style.border="1px solid #e5e5e5";
					document.getElementById("poll_int_tip").style.backgroundColor="#AAAAAA";
				}
			}
		}
	}
	else { // bcn mode
		/* Check if its not a number */
		if (isNaN(pollinterval)){
			if (pollinterval.search('.') != "0"){
				poll= parseFloat(pollinterval, 10);
				/* Check if the polling int. is less than the min or greater than the min*/
				if (poll.toFixed(2) < 1 || poll.toFixed(3) > 15){
					error.poll = true;
					document.getElementById("poll_int").style.border="1px solid #CC0000";
					document.getElementById("poll_int_tip").style.backgroundColor="#CC0000";
				}
				else{
					error.poll = false;
					document.getElementById("poll_int").style.border="1px solid #e5e5e5";
					document.getElementById("poll_int_tip").style.backgroundColor="#AAAAAA";
				}
			}
		}
		/* If it is a number */
		else{
			if (pollinterval.length== 0){
				error.poll = true;
				document.getElementById("poll_int").style.border="1px solid #CC0000";
				document.getElementById("poll_int_tip").style.backgroundColor="#CC0000";
			}
			else{
				poll= parseFloat(pollinterval, 10);
				/* Check if the polling int. is less than the minimum or greater than the maximum*/
				if (poll.toFixed(2) < 1 || poll.toFixed(3) > 15){
					error.poll = true;
					document.getElementById("poll_int").style.border="1px solid #CC0000";
					document.getElementById("poll_int_tip").style.backgroundColor="#CC0000";
				}
				else{
					error.poll = false;
					document.getElementById("poll_int").style.border="1px solid #e5e5e5";
					document.getElementById("poll_int_tip").style.backgroundColor="#AAAAAA";
				}
			}
		}
	}
	calculateBeaconInterval();
}

function supplyValidation(){
	/* Verify the Supply Voltage */
	if (!isNaN(document.getElementById("supply_voltage").value)){
		if (document.getElementById("supply_voltage").value.length ==0){
			error.sup = true;
			document.getElementById("supply_voltage").style.border="1px solid #CC0000";
			document.getElementById("supply_voltage_tip").style.backgroundColor="#CC0000";
		}
		else{
			supply=parseFloat(document.getElementById("supply_voltage").value, 10);
			if (supply < 2 || supply > 3.8){
				error.sup = true;
				document.getElementById("supply_voltage").style.border="1px solid #CC0000";
				document.getElementById("supply_voltage_tip").style.backgroundColor="#CC0000";
			}
			else{
				error.sup = false;
				document.getElementById("supply_voltage").style.border="1px solid #e5e5e5";
				document.getElementById("supply_voltage_tip").style.backgroundColor="#AAAAAA";
			}
		}
	}
}


function transmitRateValidation(){
	/* Verify the rest of the inputs */
	txInterval=document.getElementById("sensor_tx").value;
	if (isNaN(txInterval)){
		if (txInterval.search('.') != "0"){
			tx= parseFloat(txInterval, 10);
			/* Check if the tx int. is less than the min or greater than the min*/
			if (tx.toFixed(2) <= 1 || tx.toFixed(3) > 86400){
				error.txR = true;
				document.getElementById("sensor_tx").style.border="1px solid #CC0000";
				document.getElementById("sensor_tx_tip").style.backgroundColor="#CC0000";
			}
			else{
				error.txR = false;
				document.getElementById("sensor_tx").style.border="1px solid #e5e5e5";
				document.getElementById("sensor_tx_tip").style.backgroundColor="#AAAAAA";
			}
		}
	}
	else{
		if (txInterval.length== 0){
			error.txR = true;
			document.getElementById("sensor_tx").style.border="1px solid #CC0000";
			document.getElementById("sensor_tx_tip").style.backgroundColor="#CC0000";
		}
		else{
			tx= parseFloat(txInterval, 10);
			/* Check if the tx int. is less than the minimum or greater than the maximum*/
			if (tx.toFixed(2) < 1 || tx.toFixed(3) > 86400){
				error.txR = true;
				document.getElementById("sensor_tx").style.border="1px solid #CC0000";
				document.getElementById("sensor_tx_tip").style.backgroundColor="#CC0000";
			}
			else{
				error.txR = false;
				document.getElementById("sensor_tx").style.border="1px solid #e5e5e5";
				document.getElementById("sensor_tx_tip").style.backgroundColor="#AAAAAA";
			}
		}
	}
}

function recieveRateValidation(){
	rxInterval=document.getElementById("collector_tx").value;
	if (isNaN(rxInterval)){
		if (rxInterval.search('.') != "0"){
			rx= parseFloat(txInterval, 10);
			/* Check if the rx int. is less than the min or greater than the min*/
			if (rx.toFixed(2) <= 1 || rx.toFixed(3) > 86400){
				error.rxR = true;
				document.getElementById("collector_tx").style.border="1px solid #CC0000";
				document.getElementById("collector_tx_tip").style.backgroundColor="#CC0000";
			}
			else{
				error.rxR = false;
				document.getElementById("collector_tx").style.border="1px solid #e5e5e5";
				document.getElementById("collector_tx_tip").style.backgroundColor="#AAAAAA";
			}
		}
	}
	else{
		if (rxInterval.length == 0){
			error.rxR = true;
			document.getElementById("collector_tx").style.border="1px solid #CC0000";
			document.getElementById("collector_tx_tip").style.backgroundColor="#CC0000";
		}
		else{
			rx= parseFloat(rxInterval, 10);
			/* Check if the rx int. is less than the minimum or greater than the maximum*/
			if (rx.toFixed(2) < 1 || rx.toFixed(3) > 86400){
				error.rxR = true;
				document.getElementById("collector_tx").style.border="1px solid #CC0000";
				document.getElementById("collector_tx_tip").style.backgroundColor="#CC0000";
			}
			else{
				error.rxR = false;
				document.getElementById("collector_tx").style.border="1px solid #e5e5e5";
				document.getElementById("collector_tx_tip").style.backgroundColor="#AAAAAA";
			}
		}
	}
}

function txDataSizeValidation(){
	var phy = document.getElementById("Phy");
	var chosenPhy = phy.options[phy.selectedIndex].value;
	var txData = document.getElementById("tx_data_size").value;
	var txDataValue = parseInt(txData, 10);
	
	if (isNaN(txData) || txData.length == 0 || txDataValue <= 0){
		error.txD = true;
		document.getElementById("tx_data_size").style.border="1px solid #CC0000";
		document.getElementById("tx_size_tip").style.backgroundColor="#CC0000";
		document.getElementById("tx_size_tip").innerHTML = "Tx data Size must be greater than 0";
	}
	else if((chosenPhy == "p24g") && (txDataValue > 128)){
		error.txD = true;
		document.getElementById("tx_data_size").style.border="1px solid #CC0000";
		document.getElementById("tx_size_tip").style.backgroundColor="#CC0000";
		document.getElementById("tx_size_tip").innerHTML = "Max Tx data Size on 2.4G is 128 bytes";
	}
	else if(((chosenPhy == "p915") || (chosenPhy == "p868")) && (txDataValue > 500)){
		error.txD = true;
		document.getElementById("tx_data_size").style.border="1px solid #CC0000";
		document.getElementById("tx_size_tip").style.backgroundColor="#CC0000";
		document.getElementById("tx_size_tip").innerHTML = "Max Tx data Size on Sub 1G is 500 bytes";
	}
	else{
		error.txD = false;
		document.getElementById("tx_data_size").style.border="1px solid #e5e5e5";
		document.getElementById("tx_size_tip").style.backgroundColor="#AAAAAA";
		document.getElementById("tx_size_tip").innerHTML = "Data packet size the end device will send (bytes)";
	}
}

function rxDataSizeValidation(){
	var phy = document.getElementById("Phy");
	var chosenPhy = phy.options[phy.selectedIndex].value;
	var rxData = document.getElementById("rx_data_size").value;
	var rxDataValue = parseInt(rxData, 10);

	if (isNaN(rxData) || rxData.length == 0 || rxDataValue <= 0){
		error.rxD = true;
		document.getElementById("rx_data_size").style.border="1px solid #CC0000";
		document.getElementById("rx_size_tip").style.backgroundColor="#CC0000";
		document.getElementById("rx_size_tip").innerHTML = "Rx data Size must be greater than 0";
	}
	else if((chosenPhy == "p24g") && (rxDataValue > 128)){
		error.rxD = true;
		document.getElementById("rx_data_size").style.border="1px solid #CC0000";
		document.getElementById("rx_size_tip").style.backgroundColor="#CC0000";
		document.getElementById("rx_size_tip").innerHTML = "Max Rx data Size on 2.4G is 128 bytes";
	}
	else if(((chosenPhy == "p915") || (chosenPhy == "p868")) && (rxDataValue > 500)){
		error.rxD = true;
		document.getElementById("rx_data_size").style.border="1px solid #CC0000";
		document.getElementById("rx_size_tip").style.backgroundColor="#CC0000";
		document.getElementById("rx_size_tip").innerHTML = "Max Rx data Size on Sub 1G is 500 bytes";
	}
	else{
		error.rxD = false;
		document.getElementById("rx_data_size").style.border="1px solid #e5e5e5";
		document.getElementById("rx_size_tip").style.backgroundColor="#AAAAAA";
		document.getElementById("rx_size_tip").innerHTML = "Data packet size the end device will receive (bytes)";
		
	}
}

function batteryValidation(){
	if (isNaN(document.getElementById("battery_cap").value) || document.getElementById("battery_cap").value.length == 0){
		error.bat = true;
		document.getElementById("battery_cap").style.border="1px solid #CC0000";
		document.getElementById("battery_cap_tip").style.backgroundColor="#CC0000";
		document.getElementById("battery_cap_tip").innerHTML = "Battery Capacity value must be a numeric value between 0 and 1000mAh";
	}
	else{
		error.bat = false;
		bat=parseFloat(document.getElementById("battery_cap").value, 10);
		if (bat < 0 || bat > 1000){
			error.bat = true;
			document.getElementById("battery_cap").style.border="1px solid #CC0000";
			document.getElementById("battery_cap_tip").style.backgroundColor="#CC0000";
			document.getElementById("battery_cap_tip").innerHTML = "Battery Capacity value must be a numeric value between 0 and 1000mAh";
		}
		else{
			error.bat = false;
			document.getElementById("battery_cap").style.border="1px solid #e5e5e5";
			document.getElementById("battery_cap_tip").style.backgroundColor="#AAAAAA";
			document.getElementById("battery_cap_tip").innerHTML = "The estimated capacity of the end device battery in mAh [0-1000]";
		}
	}
}

function calculateBeaconInterval(){
	var mode = document.getElementById("Mode").value;
	if (mode == "bcn") {
		var dr = document.getElementById("Data_Rate");
		var rate = dr.options[dr.selectedIndex].value;
		var dataRate = 0;
		if(rate == "data250"){
			dataRate=250;
		}
		else if (rate == "data50"){
			dataRate=50;
		}
		else if (rate == "data5"){
			dataRate=5;
		}
		else if (rate == "data200"){
			dataRate=200;
		}
		var beaconOrder = document.getElementById("poll_int").value;
		var beaconInterval = 0;
		var symbolsPerBit = 0;

		// get number of symbols for each phy and datatype in usec/symbol
		// need to set symbols per bit for each phy and data rate
		if (dataRate == 250){
			symbolsPerBit = 1 / 4;
		}
		if (dataRate == 50){
			symbolsPerBit = 1;
		}
		if (dataRate == 5){
			symbolsPerBit = 5;
		}
		if (dataRate == 200){
			symbolsPerBit = 1;
		}

		// Beacon Interval calculation
		// BI = ((960) * (2 ^ BO) ) / ((dataRate) * (1000) * (symbols per bit))
		beaconInterval = (960 * (Math.pow(2,beaconOrder))) / (dataRate * 1000 * symbolsPerBit); // in sec
		var output = document.getElementById("poll");
		var string = "Bcn Order:  [Bcn Int: " + beaconInterval.toFixed(2).toString() + " sec]";
		output.innerHTML = string;

	}
}

function calculatePower(){
	/* Check if there are input errors */
	var inputError= false;
	if (error.poll || error.sup || error.txR || error.rxR || error.txD || error.rxD || error.bat){
		inputError = true;
		document.getElementById("response").innerHTML= "Input Error: Make sure all inputs are within range."
		document.getElementById("response").style.fontSize="small";
		document.getElementById("response").style.visibility = "visible";
		document.getElementById("response2").style.visibility = "hidden";}
	else{
		document.getElementById("response").style.visibility = "hidden";
		document.getElementById("response2").style.visibility = "hidden";}

	if (!inputError){
		/* Sample Profiles (CC1352 5dbm)*/
		/* DATA ACK */
		var dataAck = {payload:100, eventDur:6.5715, eventCur: 6.44291, eventOverheadDur:2.306, eventOverheadCur:3.389, txCur:9.3108,txDur:2.2074, rxCur:6.7896, rxDur:2.0572}
		/* POLL DATA */
		var pollData = {payload:30,eventDur:4.3786, eventCur: 6.3624, eventOverheadDur:1.1723, eventOverheadCur:2.6953, txCur:9.051,txDur:1.03252, rxCur:6.753, rxDur:2.8867}
		/* POLL ACK */
		var pollAck = {eventDur:4.1757, eventCur:6.3728, eventOverheadDur:1.0787, eventOverheadCur:3.0787, txCur:9.04766,txDur:1.033, rxCur:6.755, rxDur:2.0599}


		/* Calculate the exact Event duration and current */
		dataAck.eventDur= dataAck.eventOverheadDur + dataAck.txDur + dataAck.rxDur + dataAck.rechargeDur;
		dataAck.eventCur= dataAck.eventOverheadCur + dataAck.txCur + dataAck.rxCur + dataAck.rechargeCur;

		pollData.eventDur= pollData.eventOverheadDur + pollData.txDur + pollData.rxDur + pollData.rechargeDur;
		pollData.eventCur= pollData.eventOverheadCur + pollData.txCur + pollData.rxCur + pollData.rechargeCur;

		pollAck.eventDur= pollAck.eventOverheadDur + pollAck.txDur + pollAck.rxDur + pollAck.rechargeDur;
		pollAck.eventCur= pollAck.eventOverheadCur + pollAck.txCur + pollAck.rxCur + pollAck.rechargeCur;

		/* Data Rate in kpbs*/
		var dr = document.getElementById("Data_Rate");
		var rate = dr.options[dr.selectedIndex].value;
		if(rate == "data250"){
			dataRate=250;
		}
		else if (rate == "data50"){
			dataRate=50;
		}
		else if (rate == "data5"){
			dataRate=5;
		}
		else if (rate == "data200"){
			dataRate=200;
		}

		var m = document.getElementById("Mode");
		var mode = m.options[m.selectedIndex].value;

		var p = document.getElementById("Phy");
		var phy = p.options[p.selectedIndex].value;


		/* Converting all of the values from strings to integers */
		device = document.getElementById("Device").value;
		txPower= document.getElementById("tx_power").value;
		pollInt= parseFloat(document.getElementById("poll_int").value, 10);
		sensorTx= parseFloat(document.getElementById("sensor_tx").value, 10);
		collectorTx= parseFloat(document.getElementById("collector_tx").value, 10);
		txDataSize= parseFloat(document.getElementById("tx_data_size").value, 10);
		rxDataSize= parseFloat(document.getElementById("rx_data_size").value, 10);
		supplyVoltage= parseFloat(document.getElementById("supply_voltage").value, 10);
		batteryCap= parseFloat(document.getElementById("battery_cap").value, 10);

		/* Based on what PHY, Mode, and DataRate we are set to, the defaults will need to be set */
		if (phy == "p24g"){
			if (mode == "non_bcn"){
				/* Data/Ack Profile */
				dataAck.rxDur = .476;
				dataAck.txDur = 3.386;
				dataAck.eventOverheadDur = 3.45;
				dataAck.eventDur = 7.312;
				/* Poll/Data Profile */
				pollData.rxDur = 3.731;
				pollData.txDur = .973;
				pollData.eventOverheadDur = 4.355;
				pollData.eventDur = 9.059;
				/* Poll/Ack Profile */
				pollAck.rxDur = .575;
				pollAck.txDur = .582;
				pollAck.eventOverheadDur = 3.382;
				pollAck.eventDur = 4.539;
			}
			if (mode == "bcn"){
				/* Data/Ack Profile */
				dataAck.rxDur = .551;
				dataAck.txDur = 3.402;
				dataAck.eventOverheadDur = 2.969;
				dataAck.eventDur = 6.922;
				/* Poll/Data Profile */
				pollData.rxDur = 8.832;
				pollData.txDur = .934;
				pollData.eventOverheadDur = 2.058;
				pollData.eventDur = 11.824;
				/* Poll/Ack(Beacon) Profile */
				pollAck.rxDur = 1.356;
				pollAck.txDur = 0;
				pollAck.eventOverheadDur = 4.277;
				pollAck.eventDur = 5.633;
			}
		}
		if (phy == "p915"){
			if (mode == "non_bcn"){
				if (dataRate == 50){
					/* Data/Ack Profile */
					dataAck.rxDur = 4.031;
					dataAck.txDur = 18.340;
					dataAck.eventOverheadDur = 5.703;
					dataAck.eventDur = 28.074;
					/* Poll/Data Profile */
					pollData.rxDur = 18.376;
					pollData.txDur = 7.386;
					pollData.eventOverheadDur = 5.234;
					pollData.eventDur = 30.996;
					/* Poll/Ack Profile */
					pollAck.rxDur = 4.004;
					pollAck.txDur = 4.262;
					pollAck.eventOverheadDur = 8.484;
					pollAck.eventDur = 16.75;
				}
				if (dataRate == 5){
					/* Data/Ack Profile */
					dataAck.rxDur = 27.250;
					dataAck.txDur = 177.996;
					dataAck.eventOverheadDur = 13.547;
					dataAck.eventDur = 218.793;
					/* Poll/Data Profile */
					pollData.rxDur = 158.371;
					pollData.txDur = 63.117;
					pollData.eventOverheadDur = 24.297;
					pollData.eventDur = 244.785;
					/* Poll/Ack Profile */
					pollAck.rxDur = 27.242;
					pollAck.txDur = 37.180;
					pollAck.eventOverheadDur = 6.656;
					pollAck.eventDur = 71.078;
				}
				if (dataRate == 200){
					/* Data/Ack Profile */
					dataAck.rxDur = 1.485;
					dataAck.txDur = 4.562;
					dataAck.eventOverheadDur = 4.082;
					dataAck.eventDur = 10.129;
					/* Poll/Data Profile */
					pollData.rxDur = 1.8;
					pollData.txDur = 6.367;
					pollData.eventOverheadDur = 4.982;
					pollData.eventDur = 13.149;
					/* Poll/Ack Profile */
					pollAck.rxDur = 1.164;
					pollAck.txDur = 1.035;
					pollAck.eventOverheadDur = 4.391;
					pollAck.eventDur = 6.59;
				}
			}
			if (mode == "bcn"){
				if (dataRate == 50){
					/* Data/Ack Profile */
					dataAck.rxDur = 4.031;
					dataAck.txDur = 18.34;
					dataAck.eventOverheadDur = 7.902;
					dataAck.eventDur = 30.273;
					/* Poll/Data Profile */
					pollData.rxDur = 27.387;
					pollData.txDur = 7.383;
					pollData.eventOverheadDur = 10.984;
					pollData.eventDur = 45.754;
					/* Poll/Ack(Beacon) Profile */
					pollAck.rxDur = 5.726;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 2.141;
					pollAck.eventDur = 7.867;
				}
				if (dataRate == 5){
					/* Data/Ack Profile */
					dataAck.rxDur = 27.234;
					dataAck.txDur = 177.977;
					dataAck.eventOverheadDur = 48.542;
					dataAck.eventDur = 253.753;
					/* Poll/Data Profile */
					pollData.rxDur = 181.578;
					pollData.txDur = 63.144;
					pollData.eventOverheadDur = 44.825;
					pollData.eventDur = 289.547;
					/* Poll/Ack(Beacon) Profile */
					pollAck.rxDur = 33.992;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 2.621;
					pollAck.eventDur = 36.613;
				}
				if (dataRate == 200){
					/* Data/Ack Profile */
					dataAck.rxDur = 1.161;
					dataAck.txDur = 4.562;
					dataAck.eventOverheadDur = 7.469;
					dataAck.eventDur = 13.192;
					/* Poll/Data Profile */
					pollData.rxDur = 7.603;
					pollData.txDur = 1.793;
					pollData.eventOverheadDur = 9.291;
					pollData.eventDur = 18.687;
					/* Poll/Ack(Beacon) Profile */
					pollAck.rxDur = 1.453;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 1.985;
					pollAck.eventDur = 3.438;
				}
			}
		}
		if (phy == "p433"){
			if (mode == "non_bcn"){
				if (dataRate == 50){
					/* Data/Ack Profile */
					dataAck.rxDur = 4.062;
					dataAck.txDur = 18.340;
					dataAck.eventOverheadDur = 8.666;
					dataAck.eventDur = 31.090;
					/* Poll/Data Profile */
					pollData.rxDur = 17.715;
					pollData.txDur = 7.395;
					pollData.eventOverheadDur = 8.675;
					pollData.eventDur = 33.785;
					/* Poll/Ack Profile */
					pollAck.rxDur = 4.031;
					pollAck.txDur = 4.25;
					pollAck.eventOverheadDur = 8.082;
					pollAck.eventDur = 16.363;
				}
				if (dataRate == 5){
					/* Data/Ack Profile */
					dataAck.rxDur = 27.254;
					dataAck.txDur = 177.984;
					dataAck.eventOverheadDur = 7.415;
					dataAck.eventDur = 212.653;
					/* Poll/Data Profile */
					pollData.rxDur = 146.141;
					pollData.txDur = 63.183;
					pollData.eventOverheadDur = 5.743;
					pollData.eventDur = 215.067;
					/* Poll/Ack Profile */
					pollAck.rxDur = 27.246;
					pollAck.txDur = 37.180;
					pollAck.eventOverheadDur = 7.284;
					pollAck.eventDur = 71.71;
				}
			}
			if (mode == "bcn"){
				if (dataRate == 50){
					/* Data/Ack Profile */
					dataAck.rxDur = 4.039;
					dataAck.txDur = 18.339;
					dataAck.eventOverheadDur = 5.587;
					dataAck.eventDur = 27.965;
					/* Poll/Data Profile */
					pollData.rxDur = 27.938;
					pollData.txDur = 7.39;
					pollData.eventOverheadDur = 8.106;
					pollData.eventDur = 43.434;
					/* Poll/Ack(Beacon) Profile */
					pollAck.rxDur = 5.797;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 2.144;
					pollAck.eventDur = 7.941;
				}
				if (dataRate == 5){
					/* Data/Ack Profile */
					dataAck.rxDur = 27.273;
					dataAck.txDur = 177.984;
					dataAck.eventOverheadDur = 22.255;
					dataAck.eventDur = 227.512;
					/* Poll/Data Profile */
					pollData.rxDur = 201.265;
					pollData.txDur = 63.172;
					pollData.eventOverheadDur = 42.622;
					pollData.eventDur = 307.059;
					/* Poll/Ack(Beacon) Profile */
					pollAck.rxDur = 34.973;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 2.281;
					pollAck.eventDur = 37.254;
				}
			}
		}
		if (phy == "p868"){
			if (mode == "non_bcn"){
				if (dataRate == 50){
					/* Data/Ack Profile */
					dataAck.rxDur = 4.035;
					dataAck.txDur = 18.336;
					dataAck.eventOverheadDur = 16.395;
					dataAck.eventDur = 38.766;
					/* Poll/Data Profile */
					pollData.rxDur = 25.676;
					pollData.txDur = 7.402;
					pollData.eventOverheadDur = 11.535;
					pollData.eventDur = 44.613;
					/* Poll/Ack Profile */
					pollAck.rxDur = 4.027;
					pollAck.txDur = 4.262;
					pollAck.eventOverheadDur = 11.746;
					pollAck.eventDur = 20.035;
				}
				if (dataRate == 5){
					/* Data/Ack Profile */
					dataAck.rxDur = 27.282;
					dataAck.txDur = 177.977;
					dataAck.eventOverheadDur = 15.292;
					dataAck.eventDur = 220.551;
					/* Poll/Data Profile */
					pollData.rxDur = 150.286;
					pollData.txDur = 63.137;
					pollData.eventOverheadDur = 10.69;
					pollData.eventDur = 224.113;
					/* Poll/Ack Profile */
					pollAck.rxDur = 27.242;
					pollAck.txDur = 37.176;
					pollAck.eventOverheadDur = 16.703;
					pollAck.eventDur = 81.121;
				}
				if (dataRate == 200){
					/* Data/Ack Profile */
					dataAck.rxDur = 1.156;
					dataAck.txDur = 4.559;
					dataAck.eventOverheadDur = 12.449;
					dataAck.eventDur = 18.164;
					/* Poll/Data Profile */
					pollData.rxDur = 12.449;
					pollData.txDur = 1.809;
					pollData.eventOverheadDur = 14.430;
					pollData.eventDur = 28.688;
					/* Poll/Ack Profile */
					pollAck.rxDur = 1.187;
					pollAck.txDur = 1.051;
					pollAck.eventOverheadDur = 9.321;
					pollAck.eventDur = 11.559;
				}
			}
			if (mode == "bcn"){
				if (dataRate == 50){
					/* Data/Ack Profile */
					dataAck.rxDur = 4.047;
					dataAck.txDur = 18.348;
					dataAck.eventOverheadDur = 9.417;
					dataAck.eventDur = 31.812;
					/* Poll/Data Profile */
					pollData.rxDur = 28.370;
					pollData.txDur = 7.402;
					pollData.eventOverheadDur = 18.779;
					pollData.eventDur = 54.551;
					/* Poll/Ack Profile */
					pollAck.rxDur = 5.821;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 1.945;
					pollAck.eventDur = 7.766;
				}
				if (dataRate == 5){
					/* Data/Ack Profile */
					dataAck.rxDur = 27.215;
					dataAck.txDur = 177.961;
					dataAck.eventOverheadDur = 9.734;
					dataAck.eventDur = 214.91;
					/* Poll/Data Profile */
					pollData.rxDur = 172.809;
					pollData.txDur = 63.149;
					pollData.eventOverheadDur = 17.803;
					pollData.eventDur = 253.761;
					/* Poll/Ack Profile */
					pollAck.rxDur = 34.738;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 2.039;
					pollAck.eventDur = 36.777;
				}
				if (dataRate == 200){
					/* Data/Ack Profile */
					dataAck.rxDur = 1.156;
					dataAck.txDur = 4.570;
					dataAck.eventOverheadDur = 10.336;
					dataAck.eventDur = 16.062;
					/* Poll/Data Profile */
					pollData.rxDur = 16.539;
					pollData.txDur = 1.813;
					pollData.eventOverheadDur = 14.757;
					pollData.eventDur = 33.109;
					/* Poll/Ack Profile */
					pollAck.rxDur = 1.5;
					pollAck.txDur = 0;
					pollAck.eventOverheadDur = 2.024;
					pollAck.eventDur = 3.524;
				}
			}
		}


		/* DATA ACK: Custom ------------------------------------------------------------------------------------------------------------------------*/

		/* Theoretical Transmit Duration for DATA ACK Event (msec)*/
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec)
			The 1000s cancel out.
		*/
		txDur = ((dataAck.payload*8)/(dataRate));

		/* Obtain difference b/w experimental and theoretical */
		dataAck_txOverheadDur= dataAck.txDur - txDur;

		/* Theoretical Transmit Duration for DATA ACK based on application payload (msec) */
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec) */
		txDur=((txDataSize*8)/(dataRate));

		/* Subtract the experimental transmit duration from the event duration */
		dataAck.eventDur=dataAck.eventDur - dataAck.txDur;

		/* Store the new transmit duration based on DATA ACK application payload */
		dataAck.txDur = txDur + dataAck_txOverheadDur;

		/* Store the new event duration based on DATA ACK application payload */
		dataAck.eventDur=dataAck.eventDur+dataAck.txDur;

		/* Calculate the new active current */
		/* 0.395 (voltage)^2 - 3.3868 (voltage) + 9.9887 */
		dataAck.eventOverheadCur= (.395 * Math.pow(supplyVoltage,2)) - (3.3868 * supplyVoltage) + 9.9887;

		/* Calculate the new recieve current */
		if(phy == "p24g"){
			/* 1.41 (voltage)^2 -10.559 (voltage) + 25.695 */
			dataAck.rxCur= (1.41 * Math.pow(supplyVoltage,2)) - (10.559 * supplyVoltage) + 25.695;
		}
		else{
			/* 1.1033 (voltage)^2 -8.8812 (voltage) + 23.478 */
			dataAck.rxCur= (1.1033 * Math.pow(supplyVoltage,2)) - (8.8812 * supplyVoltage) + 23.478;
		}

		/* Change the transmit current based on the TX Power */
		dataAck.txCur = calcTxCurrent(device, phy, txPower, supplyVoltage);

		/* Calculate the new event current based on DATA ACK application payload (mA)*/
		/* (profileCurrent mA * profileDuration mS) / profileEventDuration mS */
		dataAck.eventCur=((dataAck.txCur*dataAck.txDur)+(dataAck.rxCur*dataAck.rxDur)+(dataAck.eventOverheadCur*dataAck.eventOverheadDur))/dataAck.eventDur;

		/* Calculate number of times a data ack will occur */
		// the sensor tx interval is input in msec... need to convert to numDataTxPerHour
		// data tx/hour = (3600 sec / 1 hour) * (1 poll / x sec)
		dataTxPerHour = (3600) / (sensorTx);

		/* ------------------------------------------------------------------------------------------------------------------------------------------- */

		/* POLL DATA: Custom ------------------------------------------------------------------------------------------------------------------------- */
		/* Theoretical Receive Duration for POLL DATA Event (msec)*/
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec) */
		rxDur = ((pollData.payload*8)/(dataRate));

		/* Obtain difference b/w experimental and theoretical */
		pollData_rxOverheadDur= pollData.rxDur - rxDur;

		/* Theoretical Receive Duration for POLL DATA based on application payload (msec) */
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec) */
		rxDur=((rxDataSize*8) / (dataRate));

		/* Subtract the experimental receive duration from the event duration */
		pollData.eventDur=pollData.eventDur-pollData.rxDur;

		/* Store the new receive duration based on POLL DATA application payload */
		pollData.rxDur = rxDur+ pollData_rxOverheadDur;

		/* Store the new event duration based on POLL DATA application payload */
		pollData.eventDur=pollData.eventDur+pollData.rxDur;

		/* Calculate the new active current */
		/* 0.395 (voltage)^2 - 3.3868 (voltage) + 9.9887 */
		pollData.eventOverheadCur= (.395 * Math.pow(supplyVoltage,2)) - (3.3868 * supplyVoltage) + 9.9887;

		/* Calculate the new recieve current */
		if (phy == "p24g"){
			/* 1.41 (voltage)^2 -10.559 (voltage) + 25.695 */
			pollData.rxCur= (1.41 * Math.pow(supplyVoltage,2)) - (10.559 * supplyVoltage) + 25.695;
		}
		else{
			/* 1.1033 (voltage)^2 -8.8812 (voltage) + 23.478 */
			pollData.rxCur= (1.1033 * Math.pow(supplyVoltage,2)) - (8.8812 * supplyVoltage) + 23.478;
		}

		/* Change the transmit current based on the TX Power */
		pollData.txCur = calcTxCurrent(device, phy, txPower, supplyVoltage);

		/* Calculate the new event current based on POLL DATA application payload (mA)*/
		/* (profileCurrent mA * profileDuration mS) / profileEventDuration mS */
		pollData.eventCur=((pollData.rxCur*pollData.rxDur)+(pollData.txCur*pollData.txDur)+(pollData.eventOverheadCur*pollData.eventOverheadDur))/pollData.eventDur;

		/* --------------------------------------------------------------------------------------------------------------------------------------- */

		/* POLL ACK ------------------------------------------------------------------------------------------------------------------------------ */

		/* Change the transmit current based on the TX Power */
		pollAck.txCur = calcTxCurrent(device, phy, txPower, supplyVoltage);

		/* Calculate the new active current */
		/* 0.395 (voltage)^2 - 3.3868 (voltage) + 9.9887 */
		pollAck.eventOverheadCur= (.395 * Math.pow(supplyVoltage,2)) - (3.3868 * supplyVoltage) + 9.9887;

		/* Calculate the new recieve current */
		if (phy == "p24g"){
			/* 1.41 (voltage)^2 -10.559 (voltage) + 25.695 */
			pollAck.rxCur= (1.41 * Math.pow(supplyVoltage,2)) - (10.559 * supplyVoltage) + 25.695;
		}
		else{
			/* 1.1033 (voltage)^2 -8.8812 (voltage) + 23.478 */
			pollAck.rxCur= (1.1033 * Math.pow(supplyVoltage,2)) - (8.8812 * supplyVoltage) + 23.478;
		}

		/* Calculate the new event current (mA) based on transmit power */
		/* (profileCurrent mA * profileDuration mS) / profileEventDuration mS */
		pollAck.eventCur=((pollAck.rxCur*pollAck.rxDur)+(pollAck.txCur*pollAck.txDur)+(pollAck.eventOverheadCur*pollAck.eventOverheadDur))/pollAck.eventDur;


		/* --------------------------------------------------------------------------------------------------------------------------------------- */
		var beaconOrder = 0;
		var beaconInterval = 0;
		var symbolsPerBit = 0;
		var pollDataPerHour = 0;
		var pollAckPerHour = 0;
		var beaconsPerHour = 0;
		if (mode == "bcn"){ //in here we will calculate how many pollDataPerHour and pollAckPerHour
			beaconOrder = pollInt; // pollInt is beaconOrder for beacon mode
			// get number of symbols for each phy and datatype in usec/symbol
			// need to set symbols per bit for each phy and data rate
			if (dataRate == 250){
				symbolsPerBit = 1 / 4;
			}
			if (dataRate == 50){
				symbolsPerBit = 1;
			}
			if (dataRate == 5){
				symbolsPerBit = 5;
			}
			if (dataRate == 200){
				symbolsPerBit = 1;
			}

			// console.log(symbolsPerBit.toString());

			// Beacon Interval calculation
			// BI = ((960) * (2 ^ BO) ) / ((dataRate) * (1000) * (symbols per bit))
			beaconInterval = (960 * (Math.pow(2,beaconOrder))) / (dataRate * 1000 * symbolsPerBit); // in sec
			pollDataPerHour = (3600 / collectorTx);
			beaconsPerHour = (3600 / beaconInterval) - pollDataPerHour;
			pollAckPerHour = beaconsPerHour;


		}
		else { //non_bcn
			pollDataPerHour = (3600 / collectorTx);
			pollAckPerHour = (3600 / pollInt) - pollDataPerHour;
		}



		/* Rather than calculate how much recharging we do, just calculate how much time in day we are in "sleep" mode and
			multiply that by average sleep current which includes the recharge events = 1uA is average sleep current
		*/

		/* Calculate per day charge consumption in sleep mode (mAms) */
		// sleep current is 1uA
		sleepCurr = .001; // mA / event (.001 mA = 1 uA)

		dataAckTimePerDay = dataAck.eventDur * dataTxPerHour * 24;
		pollDataTimePerDay = pollData.eventDur * pollDataPerHour * 24;
		pollAckTimePerDay = pollAck.eventDur * pollAckPerHour * 24;
		// (mA / event) * (event / day)
		sleepTimePerDay = (1000 * 60 * 60 * 24) - ( dataAckTimePerDay + pollDataTimePerDay + pollAckTimePerDay );
		sleepCurPerDay = sleepCurr  * sleepTimePerDay; //mA / day
		// now that we have total sleep current for 24hours, we need to get total current used for 24hours

		// eventDur = (msec / event)
		// eventCur = (mA / msec)
		dataAckCurPerEvent = dataAck.eventDur * dataAck.eventCur; //mA msec/event
		pollAckCurPerEvent = pollAck.eventDur * pollAck.eventCur; //mA msec/event
		pollDataCurPerEvent = pollData.eventDur * pollData.eventCur; //mA msec/event
		// ( x mA / event) * (event / hour) * (24 hour / day)

		dataAckCurPerDay = 24 * dataAckCurPerEvent * dataTxPerHour; // mA msec/day
		pollAckCurPerDay = 24 * pollAckCurPerEvent * pollAckPerHour; // mA msec/day
		pollDataCurPerDay = 24 * pollDataCurPerEvent * pollDataPerHour; // mA msec/day
		curConsPerDay = sleepCurPerDay + dataAckCurPerDay + pollAckCurPerDay + pollDataCurPerDay; // mA msec/day

		// converting to mA hours / day
		curConsPerDay = curConsPerDay / (1000 * 3600);

		/* Power Consumption per day (milli Watt hours)*/
		/* ( mAh / day) * (x volts) */
		powerConsPerDay=curConsPerDay*supplyVoltage;

		/* Average current (over 1 day) (mA) */
		/* (k mAh / day) * ( 1 day / 24 hours) */
		averageCur=curConsPerDay/24;
		/* Calculating Battery Life */
		/* batteryCapacity mAh / (x mAh / day) */
		batteryLifeDays= batteryCap/curConsPerDay;

		/* batteryCapacity days / (365 days / 1 year) */
		batteryLifeYears=batteryLifeDays/365;

		/* Update the display with the battery life and average power information */
		document.getElementById("response").innerHTML= "Expected Battery Life: " + batteryLifeDays.toFixed(2).toString() + " Days / " + batteryLifeYears.toFixed(2).toString() + " Years ";
		document.getElementById("response2").innerHTML="Current Consumption Per Day: " + averageCur.toFixed(4)+ " mA";
		valueSize=batteryLifeDays.toFixed(2).toString().length + batteryLifeYears.toFixed(2).toString().length;
		if (valueSize > 0 &&  valueSize <= 20){
				document.getElementById("response").style.fontSize="small";
				document.getElementById("response2").style.fontSize="small";
		}
		else if (valueSize >= 21){
				document.getElementById("response").style.fontSize="x-small";
				document.getElementById("response2").style.fontSize="x-small";
		}
		document.getElementById("response").style.visibility = "visible";
		document.getElementById("response2").style.visibility = "visible";
	}
}