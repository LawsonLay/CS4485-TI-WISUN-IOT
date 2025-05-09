import '../App.css';
import React, { useContext, useState, useRef, useEffect } from 'react';
import '../assets/Devices.css';
import DeviceCard from '../components/DeviceCard';
import axios from 'axios';
import { ThemedSelect, OptionType } from './ThemedSelect'; // Import ThemedSelect and OptionType
import ThemedLabel from './ThemedLabel'; // Import ThemedLabel

interface DevicesTabProps { }

interface Device {
  mac_address: string;
  vendor_class_type: string;
  name: string;
  activated: boolean;
  activation_type: string;
  device_type: string;
  image_path?: string;
  ipv6_address?: string | null;
  manual_mode? : boolean;
}

// Define options for filters
const typeFilterOptions: OptionType[] = [
  { label: 'All Types', value: 'all' },
];

const activationFilterOptions: OptionType[] = [
  { label: 'All Devices', value: 'all' },
  { label: 'Activated', value: 'activated' },
  { label: 'Not Activated', value: 'not-activated' },
  { label: 'Sensor Activated', value: 'sensor-activated' },
  { label: 'Manually Activated', value: 'manual-activated' },
];

export default function DevicesTab(props: DevicesTabProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Update state to hold OptionType
  const [typeFilter, setTypeFilter] = useState<OptionType>(typeFilterOptions[0]);
  const [activationFilter, setActivationFilter] = useState<OptionType>(activationFilterOptions[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingDevice, setAddingDevice] = useState(false);
  const [currentTypeOptions, setCurrentTypeOptions] = useState<OptionType[]>(typeFilterOptions);

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

    // Apply type filter using state value
    if (typeFilter.value !== "all") {
      result = result.filter(device => device.vendor_class_type === typeFilter.value);
    }

    // Apply activation filter using state value
    if (activationFilter.value !== "all") {
      if (activationFilter.value === "activated") {
        result = result.filter(device => device.activated);
      } else if (activationFilter.value === "not-activated") {
        result = result.filter(device => !device.activated);
      } else if (activationFilter.value === "sensor-activated") {
        result = result.filter(device => device.activation_type === "sensor");
      } else if (activationFilter.value === "manual-activated") {
        result = result.filter(device => device.activation_type === "manual");
      }
    }

    setFilteredDevices(result);
  }, [searchTerm, typeFilter, activationFilter, devices]);

  // Update type filter options when devices change
  useEffect(() => {
    const uniqueTypes = ["all", ...new Set(devices.map(device => device.vendor_class_type))];
    const newTypeOptions = uniqueTypes.map(type => ({
      label: type === "all" ? 'All Types' : type,
      value: type
    }));
    setCurrentTypeOptions(newTypeOptions);

    // Ensure the current filter value is still valid
    if (!newTypeOptions.some(option => option.value === typeFilter.value)) {
        setTypeFilter(newTypeOptions[0]); // Reset to 'All Types' if current type disappears
    }
  }, [devices, typeFilter.value]); // Add typeFilter.value dependency

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
        activation_type,
        manual_mode: true
      });
      
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.mac_address === mac_address ? 
          { ...device, activated, activation_type, manual_mode: true } : device
        )
      );
    } catch (err) {
      console.error('Error toggling device activation:', err);
      setError('Failed to update device activation. Please try again.');
    }
  };

  const handleDeviceModeChange = async (mac_address: string, mode: 'manual-on' | 'manual-off' | 'automatic') => {
    try {
      const response = await axios.post(`/api/devices/${mac_address}/control`, { mode });
      const updatedDevice = response.data;
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.mac_address === mac_address ? { ...device, ...updatedDevice } : device
        )
      );
      setError(null);
    } catch (err: any) {
      console.error(`Error changing device ${mac_address} to mode ${mode}:`, err);
      setError(err.response?.data?.error || `Failed to set device to ${mode} mode. Please try again.`);
    }
  };

  // Handle device deletion
  const handleDeleteDevice = async (mac_address: string) => {
    try {
      if (window.confirm("Are you sure you want to delete this device? This action cannot be undone.")) {
        await axios.delete(`/api/devices/${mac_address}`);
        setDevices(prevDevices => 
          prevDevices.filter(device => device.mac_address !== mac_address)
        );
      }
    } catch (err) {
      console.error('Error deleting device:', err);
      setError('Failed to delete device. Please try again.');
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
    const isSensor = Math.random() > 0.5; // Changed variable name for clarity
    
    const vendorClassType = isSensor 
      ? sensorTypes[Math.floor(Math.random() * sensorTypes.length)]
      : actuatorTypes[Math.floor(Math.random() * actuatorTypes.length)];
      
    const activated = Math.random() > 0.7; // 30% chance of being activated
    const activationType = activated ? (Math.random() > 0.5 ? 'sensor' : 'manual') : 'none';
    
    // Determine image path based on type
    let imagePath = '/data/images/default.png';
    if (isSensor) {
      imagePath = '/data/images/sensor.png';
    } else { // is Actuator
      imagePath = '/data/images/actuator.png';
    }

    return {
      mac_address: generateRandomMac(),
      vendor_class_type: vendorClassType,
      name: `${vendorClassType} ${Math.floor(Math.random() * 100)}`,
      activated,
      activation_type: activationType,
      device_type: isSensor ? 'sensor' : 'actuator',
      image_path: imagePath, // Set the image path
      ipv6_address: null // Default ipv6_address for random devices
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
            <ThemedLabel>Device Type:</ThemedLabel>
            <ThemedSelect
              options={currentTypeOptions}
              value={typeFilter}
              onChange={(selectedOption) => setTypeFilter(selectedOption as OptionType)}
              width={180} // Adjust width as needed
            />
          </div>
          
          <div className='filter-item'>
            <ThemedLabel>Activation:</ThemedLabel>
            <ThemedSelect
              options={activationFilterOptions}
              value={activationFilter}
              onChange={(selectedOption) => setActivationFilter(selectedOption as OptionType)}
              width={180} // Adjust width as needed
            />
          </div>
        </div>
      </div>
      
      {error && <div className='error-message'>{error}</div>}
      
      {loading ? (
        <div className='loading'>Loading devices...</div>
      ) : filteredDevices.length === 0 ? (
        <div className='no-devices'>
          {searchTerm || typeFilter.value !== "all" || activationFilter.value !== "all" ? 
            "No devices match your filters." : "No devices found."}
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
              ipv6_address={device.ipv6_address}
              manual_mode={device.manual_mode}
              onNameChange={handleNameChange}
              onToggleActivation={handleToggleActivation}
              onDeviceModeChange={handleDeviceModeChange}
              onDeleteDevice={handleDeleteDevice} 
            />
          ))}
        </div>
      )}
    </div>
  );
}