import '../App.css';
import React, { useState, useEffect } from 'react';
import '../assets/Routines.css';
import '../assets/Devices.css';
import RoutineCard, { Routine } from './RoutineCard';
import axios from 'axios';
import { ThemedSelect, OptionType, findOptionByValue } from './ThemedSelect';

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
    actuator_type: '',
    set_time: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const fetchSensors = async () => {
    try {
      const response = await axios.get('/api/devices/type/sensors');
      setSensors(response.data);
    } catch (err) {
      console.error('Error fetching sensors:', err);
    }
  };

  const fetchActuators = async () => {
    try {
      const response = await axios.get('/api/devices/type/actuators');
      setActuators(response.data);
    } catch (err) {
      console.error('Error fetching actuators:', err);
    }
  };

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
    fetchRoutines();
    fetchSensors();
    fetchActuators();
  }, []);

  const togglePopup = () => {
    if (isPopupOpen) {
      setFormData({
        name: '',
        sensor_mac: '',
        actuator_mac: '',
        actuator_type: '',
        set_time: 1
      });
      setEditingRoutine(null);
    }
    setIsPopupOpen(!isPopupOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | OptionType, name?: string) => {
    let fieldName: string;
    let fieldValue: any;

    if ('target' in e) {
      fieldName = e.target.name;
      fieldValue = e.target.value;
    } else {
      fieldName = name!;
      fieldValue = e.value;
    }
  
    setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));
    
    if (fieldName === 'actuator_mac') {
      const selectedActuator = actuators.find(a => a.mac_address === fieldValue);
      if (selectedActuator) {
        setFormData(prev => ({ ...prev, actuator_type: selectedActuator.device_type }));
      } else {
        setFormData(prev => ({ ...prev, actuator_type: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name.length > 64) {
      setError('Routine name must be less than 64 characters');
      return;
    }
    if (formData.set_time <= 0) {
      setError('Set time must be a positive number.');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        set_time: Number(formData.set_time) // Ensure set_time is a number
      };

      if (editingRoutine) {
        await axios.put(`/api/relationships/${editingRoutine.id}`, dataToSend);
      } else {
        await axios.post('/api/relationships', dataToSend);
      }
      
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
      actuator_type: routine.actuator_type,
      set_time: routine.set_time || 1
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
    const target = e.target as HTMLDivElement;
    if (target.id === 'popupOverlay') {
      togglePopup();
    }
  };

  const sensorOptions: OptionType[] = [
    { label: 'Select a sensor', value: '' },
    ...sensors.map(sensor => ({
      label: `${sensor.name} (${sensor.mac_address})`,
      value: sensor.mac_address
    }))
  ];

  const actuatorOptions: OptionType[] = [
    { label: 'Select an actuator', value: '' },
    ...actuators.map(actuator => ({
      label: `${actuator.name} (${actuator.mac_address})`,
      value: actuator.mac_address
    }))
  ];

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
      ) : filteredRoutines.length === 0 ? (
        <div className="no-routines">
          {searchTerm ? "No routines match your search" : "No routines found."}
        </div>
      ) : (
        <div className='routines-table'>
          {filteredRoutines.map(routine => (
            <RoutineCard 
              key={routine.id} 
              routine={routine}
              onEdit={handleEditRoutine}
              onDelete={handleDeleteRoutine}
            />
          ))}
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

            <label className="form-label" htmlFor="set_time">
              Activation Time (seconds):
            </label>
            <input
              className="form-input"
              type="number"
              id="set_time"
              name="set_time"
              value={formData.set_time}
              onChange={handleInputChange}
              min="1"
              required
            />

            <label className="form-label" htmlFor="sensor_mac">When:</label>
            <div className="form-select-container">
              <ThemedSelect
                options={sensorOptions}
                value={findOptionByValue(sensorOptions, formData.sensor_mac) || sensorOptions[0]}
                onChange={(selectedOption) => handleInputChange(selectedOption as OptionType, 'sensor_mac')}
              />
            </div>

            <label className="form-label" htmlFor="actuator_mac">Run:</label>
            <div className="form-select-container">
              <ThemedSelect
                options={actuatorOptions}
                value={findOptionByValue(actuatorOptions, formData.actuator_mac) || actuatorOptions[0]}
                onChange={(selectedOption) => handleInputChange(selectedOption as OptionType, 'actuator_mac')}
              />
            </div>

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
            X
          </button>
        </div>
      </div>
    </div>
  );
}