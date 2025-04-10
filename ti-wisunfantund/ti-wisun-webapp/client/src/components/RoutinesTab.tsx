import '../App.css';
import React, { useState, useEffect } from 'react';
import '../assets/Routines.css';
import '../assets/Devices.css';
import RoutineCard, { Routine } from './RoutineCard';
import axios from 'axios';

interface Device {
  mac_address: string;
  name: string;
  device_type: string;
  image_path?: string;
}

interface RoutinesTabProps { }

export default function RoutinesTab(props: RoutinesTabProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sensors, setSensors] = useState<Device[]>([]);
  const [actuators, setActuators] = useState<Device[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    sensor_mac: '',
    actuator_mac: '',
    actuator_type: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch all routines with device information
  const fetchRoutines = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/relationships/full');
      setRoutines(response.data);
      setFilteredRoutines(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch routines');
      console.error('Error fetching routines:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sensors
  const fetchSensors = async () => {
    try {
      const response = await axios.get('/api/devices/type/sensors');
      setSensors(response.data);
    } catch (err) {
      console.error('Error fetching sensors:', err);
    }
  };

  // Fetch actuators
  const fetchActuators = async () => {
    try {
      const response = await axios.get('/api/devices/type/actuators');
      setActuators(response.data);
    } catch (err) {
      console.error('Error fetching actuators:', err);
    }
  };

  // Filter routines when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoutines(routines);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = routines.filter(routine => 
        routine.name.toLowerCase().includes(term) || 
        routine.sensor_name.toLowerCase().includes(term) ||
        routine.actuator_name.toLowerCase().includes(term)
      );
      setFilteredRoutines(filtered);
    }
  }, [searchTerm, routines]);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchRoutines();
    fetchSensors();
    fetchActuators();
  }, []);

  const togglePopup = () => {
    if (isPopupOpen) {
      // Reset form data when closing popup
      setFormData({
        name: '',
        sensor_mac: '',
        actuator_mac: '',
        actuator_type: ''
      });
      setEditingRoutine(null);
    }
    setIsPopupOpen(!isPopupOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If changing actuator, update the actuator_type
    if (name === 'actuator_mac') {
      const selectedActuator = actuators.find(a => a.mac_address === value);
      if (selectedActuator) {
        setFormData(prev => ({ ...prev, actuator_type: selectedActuator.device_type }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.length > 64) {
      setError('Routine name must be less than 64 characters');
      return;
    }

    try {
      if (editingRoutine) {
        // Update existing routine
        await axios.put(`/api/relationships/${editingRoutine.id}`, formData);
      } else {
        // Create new routine
        await axios.post('/api/relationships', formData);
      }
      
      // Refresh routines
      await fetchRoutines();
      togglePopup();
    } catch (err) {
      setError('Failed to save routine');
      console.error('Error saving routine:', err);
    }
  };

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormData({
      name: routine.name,
      sensor_mac: routine.sensor_mac,
      actuator_mac: routine.actuator_mac,
      actuator_type: routine.actuator_type
    });
    setIsPopupOpen(true);
  };

  const handleDeleteRoutine = async (id: number) => {
    try {
      await axios.delete(`/api/relationships/${id}`);
      await fetchRoutines();
    } catch (err) {
      setError('Failed to delete routine');
      console.error('Error deleting routine:', err);
    }
  };

  const clickOutsideHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was outside the popup box
    const target = e.target as HTMLDivElement;
    if (target.id === 'popupOverlay') {
      togglePopup();
    }
  };

  return (
    <div className='routines'>
      <div className='routines-controls'>
        <div className='controls-row'>
          <div className='search-bar'>
            <input
              type="text"
              placeholder="Search routines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="btn-open-popup" onClick={togglePopup}>
            Add New Routine
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading routines...</div>
      ) : (
        <div className='routines-table'>
          {filteredRoutines.length === 0 ? (
            <div className="no-routines">
              {searchTerm ? "No routines match your search" : "No routines found. Create a new routine to get started."}
            </div>
          ) : (
            filteredRoutines.map(routine => (
              <RoutineCard 
                key={routine.id} 
                routine={routine}
                onEdit={handleEditRoutine}
                onDelete={handleDeleteRoutine}
              />
            ))
          )}
        </div>
      )}

      <div 
        id="popupOverlay" 
        className={`overlay-container ${isPopupOpen ? 'show' : 'hide'}`}
        onClick={clickOutsideHandler}
      >
        <div className="popup-box">
          <h2 style={{ color: '#000' }}>
            {editingRoutine ? 'Edit Routine' : 'Add New Routine'}
          </h2>
          <form className="form-container" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="name">
              Routine Name:
            </label>
            <input 
              className="form-input" 
              type="text"
              placeholder="Enter Routine Name (max 64 characters)"
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              maxLength={64}
              required 
            />

            <label className="form-label" htmlFor="sensor_mac">When:</label>
            <select 
              className='form-input' 
              name="sensor_mac"
              value={formData.sensor_mac}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a sensor</option>
              {sensors.map(sensor => (
                <option key={sensor.mac_address} value={sensor.mac_address}>
                  {sensor.name} ({sensor.mac_address})
                </option>
              ))}
            </select>

            <label className="form-label" htmlFor="actuator_mac">Run:</label>
            <select 
              className='form-input' 
              name="actuator_mac"
              value={formData.actuator_mac}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an actuator</option>
              {actuators.map(actuator => (
                <option key={actuator.mac_address} value={actuator.mac_address}>
                  {actuator.name} ({actuator.mac_address})
                </option>
              ))}
            </select>

            <div className="button-container">
              <button className="btn-submit" type="submit">
                {editingRoutine ? 'Update Routine' : 'Set Routine'}
              </button>
              
              {editingRoutine && (
                <button 
                  className="btn-delete"
                  type="button"
                  onClick={() => {
                    handleDeleteRoutine(editingRoutine.id);
                    togglePopup();
                  }}
                >
                  Delete Routine
                </button>
              )}
            </div>
          </form>

          <button className="btn-close-popup" onClick={togglePopup}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}