import React, { useContext } from 'react';

interface DeviceCardProps {
  location: string;
  type: string;
}

export default function DeviceCard(props: DeviceCardProps) {
  return (
    <div className='device-card'>
      <h3>{props.location}</h3>
      <div className='device-flex-box'>
        <div>
          <p>{props.type}</p>
        </div>
        <label className="toggle">
          <input type="checkbox" id="btnToggle" name="btnToggle" />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
}