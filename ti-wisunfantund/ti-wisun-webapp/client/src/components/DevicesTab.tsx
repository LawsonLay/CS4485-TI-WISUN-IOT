import '../App.css';
import React, { useContext, useState, useRef, useEffect } from 'react';
import '../assets/Devices.css';
import '../components/DeviceCard.tsx';
import DeviceCard from '../components/DeviceCard';

interface DevicesTabProps { }

export default function DevicesTab(props: DevicesTabProps) {
  return (
    <div className='devices-table'>
      <DeviceCard location="Main Street" type="Light" />
      <DeviceCard location="2nd Street" type="Light" />
      <DeviceCard location="Building" type="Light" />
      <DeviceCard location="Room" type="Light" />
      <DeviceCard location="Front Hall" type="Light" />
      <DeviceCard location="Roof" type="Light Sensor" />
      <DeviceCard location="Coit and Campbell" type="Pressure Plate" />
    </div>
  );
}