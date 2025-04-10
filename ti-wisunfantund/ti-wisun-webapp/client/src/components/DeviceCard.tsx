import React, { useState } from 'react';
import '../assets/Devices.css';

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
  onDeleteDevice: (mac_address: string) => void;
}

export default function DeviceCard(props: DeviceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(props.name);
  
  const handleNameSubmit = () => {
    if (newName.trim() !== '') {
      props.onNameChange(props.mac_address, newName);
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setNewName(props.name);
      setIsEditing(false);
    }
  };
  
  const handleToggleActivation = () => {
    props.onToggleActivation(props.mac_address, !props.activated);
  };
  
  // Get appropriate image path based on device type with fallback
  const getImagePath = () => {
    if (props.image_path) {
      return props.image_path;
    }
    
    // Default fallback image
    return '../assets/images/default-device.png';
  };

  return (
    <div className="device-card">
      <div className="device-header">
        {isEditing ? (
          <div className="edit-name">
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button onClick={handleNameSubmit}>Save</button>
            <button onClick={() => {
              setNewName(props.name);
              setIsEditing(false);
            }}>Cancel</button>
          </div>
        ) : (
          <h3 className="device-name" onClick={() => setIsEditing(true)}>
            {props.name}
          </h3>
        )}
        
        <div className="toggle-container">
          <label className="toggle">
            <input
              type="checkbox"
              checked={props.activated}
              onChange={handleToggleActivation}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="device-image">
        <img 
          src={getImagePath()} 
          alt={props.name} 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '../assets/images/default-device.png';
          }}
        />
      </div>
      
      <div className="device-details">
        <p className="device-type">{props.vendor_class_type}</p>
        <p className="mac-address">{props.mac_address}</p>
        <p className="device-status">
          Status: {props.activated ? 'Activated' : 'Not Activated'}
          {props.activated && ` (${props.activation_type})`}
        </p>
      </div>
      
      <button 
        className="delete-device-btn" 
        onClick={() => props.onDeleteDevice(props.mac_address)}
        title="Delete device"
      >
        ×
      </button>
    </div>
  );
}