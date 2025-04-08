import '../App.css';
import React, { useContext, useState, useRef, useEffect } from 'react';
import '../assets/Devices.css';
import DeviceCard from '../components/DeviceCard';
import axios from 'axios';

interface DevicesTabProps { }

interface Device {
  mac_address: string;
  vendor_class_type: string;
  name: string;
  activated: boolean;
  activation_type: string;
  device_type: string;
  image_path?: string;
}

export default function DevicesTab(props: DevicesTabProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activationFilter, setActivationFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingDevice, setAddingDevice] = useState(false);

  // Fetch devices from the server
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/devices');
      setDevices(response.data);
      setFilteredDevices(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to fetch devices. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDevices();
  }, []);

  // Apply filters when search term or filters change
  useEffect(() => {
    let result = devices;

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(device => 
        device.name.toLowerCase().includes(term) || 
        device.mac_address.toLowerCase().includes(term) ||
        device.vendor_class_type.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(device => device.vendor_class_type === typeFilter);
    }

    // Apply activation filter
    if (activationFilter !== "all") {
      if (activationFilter === "activated") {
        result = result.filter(device => device.activated);
      } else if (activationFilter === "not-activated") {
        result = result.filter(device => !device.activated);
      } else if (activationFilter === "sensor-activated") {
        result = result.filter(device => device.activation_type === "sensor");
      } else if (activationFilter === "manual-activated") {
        result = result.filter(device => device.activation_type === "manual");
      }
    }

    setFilteredDevices(result);
  }, [searchTerm, typeFilter, activationFilter, devices]);

  // Handle device name change
  const handleNameChange = async (mac_address: string, newName: string) => {
    try {
      await axios.put(`/api/devices/${mac_address}`, { name: newName });
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.mac_address === mac_address ? { ...device, name: newName } : device
        )
      );
    } catch (err) {
      console.error('Error updating device name:', err);
      setError('Failed to update device name. Please try again.');
    }
  };

  // Handle device activation toggle
  const handleToggleActivation = async (mac_address: string, activated: boolean) => {
    try {
      // Determine activation_type based on where it's activated from
      const activation_type = activated ? 'manual' : 'none';
      
      await axios.put(`/api/devices/${mac_address}`, { 
        activated, 
        activation_type 
      });
      
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.mac_address === mac_address ? 
          { ...device, activated, activation_type } : device
        )
      );
    } catch (err) {
      console.error('Error toggling device activation:', err);
      setError('Failed to update device activation. Please try again.');
    }
  };

  // Generate random MAC address (format: XX:XX:XX:XX:XX:XX)
  const generateRandomMac = () => {
    const hexDigits = '0123456789ABCDEF';
    let mac = '';
    
    for (let i = 0; i < 6; i++) {
      let octet = '';
      for (let j = 0; j < 2; j++) {
        octet += hexDigits.charAt(Math.floor(Math.random() * 16));
      }
      mac += octet;
      if (i < 5) mac += ':';
    }
    
    return mac;
  };
  
  // Generate a random device
  const generateRandomDevice = (): Device => {
    // Define possible device types and their properties
    const sensorTypes = ['PIR', 'FSR', 'AMBIENT'];
    const actuatorTypes = ['LIGHT', 'COUNTER'];
    const isInput = Math.random() > 0.5;
    
    const vendorClassType = isInput 
      ? sensorTypes[Math.floor(Math.random() * sensorTypes.length)]
      : actuatorTypes[Math.floor(Math.random() * actuatorTypes.length)];
      
    const activated = Math.random() > 0.7; // 30% chance of being activated
    const activationType = activated ? (Math.random() > 0.5 ? 'sensor' : 'manual') : 'none';
    
    return {
      mac_address: generateRandomMac(),
      vendor_class_type: vendorClassType,
      name: `${vendorClassType} ${Math.floor(Math.random() * 100)}`,
      activated,
      activation_type: activationType,
      device_type: isInput ? 'input' : 'output'
    };
  };
  
  // Add random device to database
  const addRandomDevice = async () => {
    try {
      setAddingDevice(true);
      setError(null);
      
      const randomDevice = generateRandomDevice();
      const response = await axios.post('/api/devices', randomDevice);
      
      // Update the devices list with the new device
      setDevices(prevDevices => [...prevDevices, response.data]);
      
      // Show success message or notification
      console.log('Random device added successfully:', response.data);
    } catch (err) {
      console.error('Error adding random device:', err);
      setError('Failed to add random device. Please try again.');
    } finally {
      setAddingDevice(false);
    }
  };

  // Get unique vendor class types for filter dropdown
  const vendorClassTypes = ["all", ...new Set(devices.map(device => device.vendor_class_type))];

  return (
    <div className='devices-container'>
      <div className='devices-controls'>
        <div className='controls-row'>
          <div className='search-bar'>
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className='add-random-btn'
            onClick={addRandomDevice}
            disabled={addingDevice}
          >
            {addingDevice ? 'Adding...' : 'Add Random Device'}
          </button>
        </div>
        
        <div className='filter-controls'>
          <div className='filter-item'>
            <label>Device Type:</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {vendorClassTypes.map(type => 
                type !== "all" && <option key={type} value={type}>{type}</option>
              )}
            </select>
          </div>
          
          <div className='filter-item'>
            <label>Activation:</label>
            <select 
              value={activationFilter} 
              onChange={(e) => setActivationFilter(e.target.value)}
            >
              <option value="all">All Devices</option>
              <option value="activated">Activated</option>
              <option value="not-activated">Not Activated</option>
              <option value="sensor-activated">Sensor Activated</option>
              <option value="manual-activated">Manually Activated</option>
            </select>
          </div>
        </div>
      </div>
      
      {error && <div className='error-message'>{error}</div>}
      
      {loading ? (
        <div className='loading'>Loading devices...</div>
      ) : filteredDevices.length === 0 ? (
        <div className='no-devices'>
          {searchTerm || typeFilter !== "all" || activationFilter !== "all" ? 
            "No devices match your filters" : "No devices found"}
        </div>
      ) : (
        <div className='devices-table'>
          {filteredDevices.map(device => (
            <DeviceCard
              key={device.mac_address}
              mac_address={device.mac_address}
              name={device.name}
              vendor_class_type={device.vendor_class_type}
              activated={device.activated}
              activation_type={device.activation_type}
              device_type={device.device_type}
              image_path={device.image_path}
              onNameChange={handleNameChange}
              onToggleActivation={handleToggleActivation}
            />
          ))}
        </div>
      )}
    </div>
  );
}