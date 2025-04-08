import React, { useState, useEffect } from 'react';
import defaultDeviceImage from '../assets/images/default-device.png';

interface DeviceCardProps {
  mac_address: string;
  name: string;
  vendor_class_type: string;
  activated: boolean;
  activation_type: string;
  device_type: string;
  image_path?: string;
  onNameChange: (mac_address: string, newName: string) => void;
  onToggleActivation: (mac_address: string, activated: boolean) => void;
}

export default function DeviceCard(props: DeviceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(props.name);
  const [activated, setActivated] = useState(props.activated);
  
  useEffect(() => {
    setName(props.name);
    setActivated(props.activated);
  }, [props.name, props.activated]);

  const handleNameChange = () => {
    if (name.trim() && name !== props.name) {
      props.onNameChange(props.mac_address, name);
    }
    setIsEditing(false);
  };

  const handleActivationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newActivation = e.target.checked;
    setActivated(newActivation);
    props.onToggleActivation(props.mac_address, newActivation);
  };

  const deviceImage = props.image_path ? props.image_path : defaultDeviceImage;

  return (
    <div className='device-card'>
      <div className='device-image'>
        <img src={deviceImage} alt={props.name} />
      </div>
      
      {isEditing ? (
        <div className='device-name-edit'>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            autoFocus
            onBlur={handleNameChange}
            onKeyPress={(e) => e.key === 'Enter' && handleNameChange()}
          />
        </div>
      ) : (
        <h3 onClick={() => setIsEditing(true)} title="Click to edit name">
          {props.name}
        </h3>
      )}
      
      <div className='device-flex-box'>
        <div>
          <p>{props.vendor_class_type}</p>
          <p className='device-details'>
            Type: {props.device_type} | 
            Activation: {props.activation_type}
          </p>
          <p className='device-mac'>{props.mac_address}</p>
        </div>
        <label className="toggle">
          <input 
            type="checkbox" 
            checked={activated}
            onChange={handleActivationToggle}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
}