import React, { useContext } from 'react';
import '../assets/Routines.css';
import '../assets/Devices.css';

interface RoutineCardProps {
  name: string;
  togglePopup: () => void;
}

export default function RoutineCard(props: RoutineCardProps) {
  return (
    <div className='routine-card'>
      <div className='routine-card-header'>
        <h3>{props.name}</h3>
        <button className="btn-open-popup-routine" onClick={props.togglePopup}>
          Edit
        </button>
      </div>
      <label className="toggle">
        <input type="checkbox" id="btnToggle" name="btnToggle" />
        <span className="slider"></span>
      </label>
    </div>
  );
}