

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

function constrainPowerValue(){
/* Change the power options depending on the device selected */
var dev = document.getElementById("Device");
var chosenDev = dev.options[dev.selectedIndex].value;
	/* High PA Device */
	if ((chosenDev == "CC13x2P" || chosenDev =="CC26x2P") && document.getElementById("tx_power").options[0].value != "20"){
			iteration = 0;
			for (i=20; i>13; --i){
				var x = document.getElementById("tx_power");
				var c = document.createElement("option");
				c.text=i.toString();
				document.getElementById("tx_power").options.add(c, x[iteration]);
				iteration +=1;}
		}
	/* Non-High PA Device */
	if ((chosenDev == "CC13x2R" || chosenDev =="CC26x2R") && document.getElementById("tx_power").options[0].value != "5"){
		iteration = 0;
		for (i=20; i>13; --i){
			var x = document.getElementById("tx_power");
			var c = document.createElement("option");
			c.text=i.toString();
			document.getElementById("tx_power").options.remove(c, x[iteration]);
			iteration +=1;}
	}
	document.getElementById('tx_power').selectedIndex=0;
}

function pollIntValidation(){
	/* Verify the Polling Interval */
	pollinterval=document.getElementById("poll_int").value;
	/* Check if its not a number */
	if (isNaN(pollinterval)){
		if (pollinterval.search('.') != "0"){
			poll= parseFloat(pollinterval, 10);
			/* Check if the polling int. is less than the min or greater than the min*/
			if (poll.toFixed(2) <= .10 || poll.toFixed(3) > 4294967){
				error.poll = true;
				document.getElementById("poll_int").style.border="1px solid #CC0000";}
			else{
						error.poll = false;
						document.getElementById("poll_int").style.border="1px solid #e5e5e5";}}
				}
			/* If it is a number */
			else{
				if (pollinterval.length== 0){
					error.poll = true;
					document.getElementById("poll_int").style.border="1px solid #CC0000";}
				else{
					poll= parseFloat(pollinterval, 10);
					/* Check if the polling int. is less than the minimum or greater than the maximum*/
					if (poll.toFixed(2) <= .10 || poll.toFixed(3) > 4294967){
						error.poll = true;
						document.getElementById("poll_int").style.border="1px solid #CC0000";}
					else{
						error.poll = false;
						document.getElementById("poll_int").style.border="1px solid #e5e5e5";}}}
}

function supplyValidation(){
	/* Verify the Supply Voltage */
	if (!isNaN(document.getElementById("supply_voltage").value)){
		if (document.getElementById("supply_voltage").value.length ==0){
			error.sup = true;
			document.getElementById("supply_voltage").style.border="1px solid #CC0000";}
		else{
			supply=parseFloat(document.getElementById("supply_voltage").value, 10);
			if (supply < 2 || supply > 3.8){
				error.sup = true;
				document.getElementById("supply_voltage").style.border="1px solid #CC0000";}
			else{
				error.sup = false;
				document.getElementById("supply_voltage").style.border="1px solid #e5e5e5";}}}
	}


function transmitRateValidation(){
	/* Verify the rest of the inputs */
	if (isNaN(document.getElementById("transmit_rate").value) || document.getElementById("transmit_rate").value.length == 0){
		error.txR = true;
		document.getElementById("transmit_rate").style.border="1px solid #CC0000";}
	else{
		error.txR = false;
		document.getElementById("transmit_rate").style.border="1px solid #e5e5e5";}
	}

function recieveRateValidation(){
	if (isNaN(document.getElementById("recieve_rate").value) || document.getElementById("recieve_rate").value.length == 0){
		error.rxR = true;
		document.getElementById("recieve_rate").style.border="1px solid #CC0000";}
	else{
		error.rxR = false;
		document.getElementById("recieve_rate").style.border="1px solid #e5e5e5";}
	}

function txDataSizeValidation(){
	if (isNaN(document.getElementById("tx_data_size").value) || document.getElementById("tx_data_size").value.length == 0){
		error.txD = true;
		document.getElementById("tx_data_size").style.border="1px solid #CC0000";}
	else{
		error.txD = false;
		document.getElementById("tx_data_size").style.border="1px solid #e5e5e5";}
	}

function rxDataSizeValidation(){
	if (isNaN(document.getElementById("rx_data_size").value) || document.getElementById("rx_data_size").value.length == 0){
		error.rxD = true;
		document.getElementById("rx_data_size").style.border="1px solid #CC0000";}
	else{
		error.rxD = false;
		document.getElementById("rx_data_size").style.border="1px solid #e5e5e5";}
	}

function batteryValidation(){
	if (isNaN(document.getElementById("battery_cap").value) || document.getElementById("battery_cap").value.length == 0){
		error.bat = true;
		document.getElementById("battery_cap").style.border="1px solid #CC0000";}
	else{
		error.bat = false;
		bat=parseFloat(document.getElementById("battery_cap").value, 10);
		if (bat < 0 || bat > 1000){
			error.bat = true;
			document.getElementById("battery_cap").style.border="1px solid #CC0000";}
		else{
			error.bat = false;
			document.getElementById("battery_cap").style.border="1px solid #e5e5e5";}}
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
		var dataAck = {payload:3, eventDur:6.5715, eventCur: 6.44291, eventOverheadDur:2.306, eventOverheadCur:3.389, txCur:9.3108,txDur:2.2074, rxCur:6.7896, rxDur:2.0572, rechargeDur: 0.07799, rechargeCur:6.91563}
		/* POLL DATA */
		var pollData = {payload:19,eventDur:4.3786, eventCur: 6.3624, eventOverheadDur:1.1723, eventOverheadCur:2.6953, txCur:9.051,txDur:1.03252, rxCur:6.753, rxDur:2.8867, rechargeDur: 0.07799, rechargeCur:6.33148}
		/* POLL ACK */
		var pollAck = {eventDur:4.1757, eventCur:6.3728, eventOverheadDur:1.0787, eventOverheadCur:3.0787, txCur:9.04766,txDur:1.033, rxCur:6.755, rxDur:2.0599, rechargeDur: 0.07799, rechargeCur:6.4170}
		
		/* Calculate the exact Event duration and current */
		dataAck.eventDur= dataAck.eventOverheadDur + dataAck.txDur + dataAck.rxDur + dataAck.rechargeDur;
		dataAck.eventCur= dataAck.eventOverheadCur + dataAck.txCur + dataAck.rxCur + dataAck.rechargeCur; 

		pollData.eventDur= pollData.eventOverheadDur + pollData.txDur + pollData.rxDur + pollData.rechargeDur;
		pollData.eventCur= pollData.eventOverheadCur + pollData.txCur + pollData.rxCur + pollData.rechargeCur; 

		pollAck.eventDur= pollAck.eventOverheadDur + pollAck.txDur + pollAck.rxDur + pollAck.rechargeDur;
		pollAck.eventCur= pollAck.eventOverheadCur + pollAck.txCur + pollAck.rxCur + pollAck.rechargeCur; 

		dataRate=250; /* Data Rate in kpbs*/

		/* Converting all of the values from strings to integers */
		device = document.getElementById("Device").value;
		txPower= document.getElementById("tx_power").value;
		pollInt= parseFloat(document.getElementById("poll_int").value, 10);
		transmitRate= parseFloat(document.getElementById("transmit_rate").value, 10);
		recieveRate= parseFloat(document.getElementById("recieve_rate").value, 10);
		txDataSize= parseFloat(document.getElementById("tx_data_size").value, 10);
		rxDataSize= parseFloat(document.getElementById("rx_data_size").value, 10);
		supplyVoltage= parseFloat(document.getElementById("supply_voltage").value, 10);
		batteryCap= parseFloat(document.getElementById("battery_cap").value, 10);


		/* DATA ACK: Custom */
		/* Theoretical Transmit Duration for DATA ACK Event (msec)*/
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec) */
		txDur = ((dataAck.payload*8)/(dataRate*1000))*1000;

		/* Obtain difference b/w experimental and theoretical */
		dataAck_txOverheadDur= dataAck.txDur - txDur;

		/* Theoretical Transmit Duration for DATA ACK based on application payload (msec) */
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec) */
		txDur=((txDataSize*8)/(dataRate*1000))*1000;

		/* Subtract the experimental transmit duration from the event duration */
		dataAck.eventDur=dataAck.eventDur - dataAck.txDur;

		/* Store the new transmit duration based on DATA ACK application payload */
		dataAck.txDur = txDur + dataAck_txOverheadDur;

		/* Store the new event duration based on DATA ACK application payload */
		dataAck.eventDur=dataAck.eventDur+dataAck.txDur;
		
		/* Calculate the new active current */
		/* 0.395 (voltage)^2 - 3.3868 (voltage) + 9.9887 */
		dataAck.eventOverheadCur= (.395 * Math.pow(supplyVoltage,2)) - (3.3868 * supplyVoltage) + 9.9887

		/* Calculate the new recieve current */
		/* 1.41 (voltage)^2 -10.559 (voltage) + 25.695 */
		dataAck.rxCur= (1.41 * Math.pow(supplyVoltage,2)) - (10.559 * supplyVoltage) + 25.695

		/* Change the transmit current based on the TX Power */
		dataAck.txCur = calcTxCurrent(device, txPower, supplyVoltage);

		/* Calculate the new event current based on DATA ACK application payload (mA)*/
		/* (profileCurrent mA * profileDuration mS) / profileEventDuration mS */
		dataAck.eventCur=((dataAck.txCur*dataAck.txDur)+(dataAck.rxCur*dataAck.rxDur)+(dataAck.rechargeCur*dataAck.rechargeDur)+(dataAck.eventOverheadCur*dataAck.eventOverheadDur))/dataAck.eventDur;

		/* POLL DATA: Custom */
		/* Theoretical Receive Duration for POLL DATA Event (msec)*/
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec) */
		rxDur = ((pollData.payload*8)/(dataRate*1000))*1000;

		/* Obtain difference b/w experimental and theoretical */
		pollData_rxOverheadDur= pollData.rxDur - rxDur;

		/* Theoretical Receive Duration for POLL DATA based on application payload (msec) */
		/* ((k bytes * (8 bits/1 Byte))/(x bits *1000/1  sec)) * (1000 mS/1 sec) */
		rxDur=((rxDataSize*8) / (dataRate*1000))*1000;

		/* Subtract the experimental receive duration from the event duration */
		pollData.eventDur=pollData.eventDur-pollData.rxDur;

		/* Store the new receive duration based on POLL DATA application payload */
		pollData.rxDur = rxDur+ pollData_rxOverheadDur;

		/* Store the new event duration based on POLL DATA application payload */
		pollData.eventDur=pollData.eventDur+pollData.rxDur;
		
		/* Calculate the new active current */
		/* 0.395 (voltage)^2 - 3.3868 (voltage) + 9.9887 */
		pollData.eventOverheadCur= (.395 * Math.pow(supplyVoltage,2)) - (3.3868 * supplyVoltage) + 9.9887

		/* Calculate the new recieve current */
		/* 1.41 (voltage)^2 -10.559 (voltage) + 25.695 */
		pollData.rxCur= (1.41 * Math.pow(supplyVoltage,2)) - (10.559 * supplyVoltage) + 25.695

		/* Change the transmit current based on the TX Power */
		pollData.txCur = calcTxCurrent(device, txPower, supplyVoltage);

		/* Calculate the new event current based on POLL DATA application payload (mA)*/
		/* (profileCurrent mA * profileDuration mS) / profileEventDuration mS */
		pollData.eventCur=((pollData.rxCur*pollData.rxDur)+(pollData.txCur*pollData.txDur)+(pollData.rechargeCur*pollData.rechargeDur)+(pollData.eventOverheadCur*pollData.eventOverheadDur))/pollData.eventDur;

		/* POLL ACK */
		/* Change the transmit current based on the TX Power */
		pollAck.txCur = calcTxCurrent(device, txPower, supplyVoltage);

		/* Calculate the new active current */
		/* 0.395 (voltage)^2 - 3.3868 (voltage) + 9.9887 */
		pollAck.eventOverheadCur= (.395 * Math.pow(supplyVoltage,2)) - (3.3868 * supplyVoltage) + 9.9887

		/* Calculate the new recieve current */
		/* 1.41 (voltage)^2 -10.559 (voltage) + 25.695 */
		pollAck.rxCur= (1.41 * Math.pow(supplyVoltage,2)) - (10.559 * supplyVoltage) + 25.695

		/* Calculate the new event current (mA) based on transmit power */
		/* (profileCurrent mA * profileDuration mS) / profileEventDuration mS */
		pollAck.eventCur=((pollAck.rxCur*pollAck.rxDur)+(pollAck.txCur*pollAck.txDur)+(pollAck.rechargeCur*pollAck.rechargeDur)+(pollAck.eventOverheadCur*pollAck.eventOverheadDur))/pollAck.eventDur;

		/* Calculate how many times a day the ZED Polls */
		/* This is assuming that the application is configured properly */
		/* (60 sec / 1 min) * (60 min / 1 hour) * (24 hours / 1 day) / (poll interval sec)*/
		if ((86400/pollInt) > recieveRate){
			pollAckPerDay= (86400/pollInt) - (recieveRate);}
		else{
			pollAckPerDay= (86400/pollInt);}

		/* Calculate per day charge consumption in sleep mode (mAms) */
		/* ZED will likely be asleep most of the time but this in case it is awake longer than usual */
		/* (sleep current mA * 1000 ms/s * (60 s/min *60 min/hr * 24 hr/day - Duration not in sleep mode) */
		chargeSleepPerDay= .0008 * ((1000 * 60 * 60 * 24)-((dataAck.eventDur * transmitRate) + (pollData.eventDur * recieveRate) + (pollAck.eventDur * pollAckPerDay)));
		/* Charge Consumption per day (mAmS)*/
		/* (profileCurrent mA * profileDuration mS * eventPerHour) */
		chargePerDay= (dataAck.eventCur * dataAck.eventDur * transmitRate) + (pollData.eventCur * pollData.eventDur * recieveRate) + (pollAck.eventCur*pollAck.eventDur * pollAckPerDay) + chargeSleepPerDay;

		/* Current Consumption per day (mAh/day) */
		/* ((K mAmS / day) / (3600 seconds/1 hour)) /(1000 ms /second) */
		curConsPerDay=(chargePerDay/3600)/1000;

		/* Power Consumption per day (milli Watt hours)*/
		/* (k mAh / day) * (x volts) */
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