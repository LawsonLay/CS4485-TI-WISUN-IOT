import React from 'react';
import '../assets/Routines.css';
import '../assets/Devices.css';

export interface Routine {
  id: number;
  name: string;
  sensor_mac: string;
  actuator_mac: string;
  actuator_type: string;
  set_time: number;
  direction: number;
  sensor_name: string;
  actuator_name: string;
  sensor_image?: string;
  actuator_image?: string;
}

interface RoutineCardProps {
  routine: Routine;
  onEdit: (routine: Routine) => void;
  onDelete: (id: number) => void;
}

export default function RoutineCard(props: RoutineCardProps) {
  const { routine, onEdit, onDelete } = props;
  
  // Default image path if none provided or error occurs
  const defaultImage = '/data/images/default.png';
  
  // Handle image error by setting to default image
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Prevents infinite loop
    target.src = defaultImage; 
  };
  
return (
    <div className='routine-card'>
      <div className='routine-card-header'>
        <h3>{routine.name}</h3>
        <div className='routine-card-header-controls'>
          <button className="btn-open-popup-routine" onClick={() => onEdit(routine)}>
            Edit
          </button>
        </div>
      </div>
      <div className='routine-content'>
        <div className='device-container'>
          <img 
            src={routine.sensor_image || defaultImage} 
            alt={routine.sensor_name} 
            className='routine-device-image'
            onError={handleImageError} 
          />
          <span>{routine.sensor_name}</span>
        </div>
        
        <div className='connection-arrow'>
          <span>→</span>
        </div>
        
        <div className='device-container'>
          <img 
            src={routine.actuator_image || defaultImage} 
            alt={routine.actuator_name} 
            className='routine-device-image'
            onError={handleImageError} 
          />
          <span>{routine.actuator_name}</span>
        </div>
      </div>
      <div className='routine-card-footer' style={{ textAlign: 'center', marginTop: '10px' }}>
        <span className='routine-set-time'>Duration: {routine.set_time || 1}s</span>
        <span className='routine-direction' style={{ display: 'block', marginTop: '5px' }}>Direction: {routine.direction}</span>
      </div>
    </div>
  );
}