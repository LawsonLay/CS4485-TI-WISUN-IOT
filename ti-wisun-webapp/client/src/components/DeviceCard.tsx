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
  ipv6_address?: string | null;
  manual_mode?: boolean
  onNameChange: (mac_address: string, newName: string) => void;
  onToggleActivation: (mac_address: string, activated: boolean) => void;
  onDeviceModeChange: (mac_address: string, mode:  'manual-on' | 'manual-off' | 'automatic') => void;
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

  //  const handleLegacyToggleActivation = () => {
  //   props.onToggleActivation(props.mac_address, !props.activated);
  // };
  
  // const handleToggleActivation = () => {
  //   props.onToggleActivation(props.mac_address, !props.activated);
  // };
  
  const getImagePath = () => {
    // Use the specific image path if provided, otherwise use the default
    return props.image_path || '/data/images/default.png'; 
  };

  const currentMode = props.manual_mode 
    ? (props.activated ? 'manual-on' : 'manual-off') 
    : 'automatic';

  const cardClassName = `device-card ${props.activated ? 'device-card-activated' : ''}`;

  return (
    <div className={cardClassName}>
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

        <div className="device-actions-container">
          {(props.device_type === 'actuator' || props.device_type === 'light') ? (
            <div className="three-way-switch">
              <button 
                className={`switch-option ${currentMode === 'manual-off' ? 'active' : ''}`}
                onClick={() => props.onDeviceModeChange(props.mac_address, 'manual-off')}
                title=""
              >
                OFF
              </button>
              <button 
                className={`switch-option ${currentMode === 'automatic' ? 'active' : ''}`}
                onClick={() => props.onDeviceModeChange(props.mac_address, 'automatic')}
                title=""
              >
                AUTO
              </button>
              <button 
                className={`switch-option ${currentMode === 'manual-on' ? 'active' : ''}`}
                onClick={() => props.onDeviceModeChange(props.mac_address, 'manual-on')}
                title=""
              >
                ON
              </button>
            </div>
          ) : (
              <div className="three-way-switch-placeholder"></div>
            )}
        </div>
      </div>
      
      <div className="device-image">
        <img 
          src={getImagePath()} 
          alt={props.name} 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = '/data/images/default.png'; // Fallback on error
          }}
        />
      </div>
      
      <div className="device-details">
        <p className="device-type">{props.vendor_class_type}</p>
        <p className="mac-address">{props.mac_address}</p>
        <p className="ipv6-address">{props.ipv6_address || 'IPv6: N/A'}</p> 
        <p className="device-status">
          Status: {props.manual_mode ? `Manual ${props.activated ? 'ON' : 'OFF'}` : (props.activated ? 'Activated (AUTO)' : 'Not Activated (AUTO)')}
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