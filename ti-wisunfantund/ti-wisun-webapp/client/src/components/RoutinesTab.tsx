import '../App.css';
import React, { useContext, useState, useRef, useEffect } from 'react';
import '../assets/Routines.css';
import '../assets/Devices.css';
import RoutineCard from './RoutineCard';

interface RoutinesTabProps { }

export default function RoutinesTab(props: RoutinesTabProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className='routines'>
      <button className="btn-open-popup" onClick={togglePopup}>
        Add New Routine
      </button>

      <div className='routines-table'>
        <RoutineCard name="Light Automation 1" togglePopup={togglePopup} />
        <RoutineCard name="Light Automation 2" togglePopup={togglePopup} />
        <RoutineCard name="Light Automation 3" togglePopup={togglePopup} />
        <RoutineCard name="Light Automation 4" togglePopup={togglePopup} />
        <RoutineCard name="Light Automation 5" togglePopup={togglePopup} />
        <RoutineCard name="Light Automation 6" togglePopup={togglePopup} />
      </div>

      <div id="popupOverlay" className={`overlay-container ${isPopupOpen ? 'show' : 'hide'}`}>
        <div className="popup-box">
          <h2 style={{ color: 'green' }}>Edit Routine</h2>
          <form className="form-container">
            <label className="form-label" htmlFor="name">
              Routine Name:
            </label>
            <input className="form-input" type="text"
              placeholder="Enter Routine Name"
              id="name" name="name" required />

            <label className="form-label" htmlFor="routine-when">When:</label>
            <select className='form-input' name="devices">
              <option value="light-sensor">Light Sensor @ Roof</option>
              <option value="pressure-plate">Pressure Plate @ Coit and Campbell</option>
            </select>

            <label className="form-label" htmlFor="action-1">Run:</label>
            <select className='form-input' name="devices">
              <option value="light">Light @ Main Street</option>
              <option value="light">Light @ 2nd Street</option>
              <option value="light">Light @ Building</option>
              <option value="light">Light @ Room</option>
            </select>

            <button className="btn-submit"
              type="submit">
              Submit
            </button>
          </form>

          <button className="btn-close-popup"
            onClick={togglePopup}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}