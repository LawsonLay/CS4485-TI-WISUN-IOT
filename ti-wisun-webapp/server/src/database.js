const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const {httpLogger} = require('./logger.js');

// Create database path in the server directory
const DB_PATH = path.resolve(path.join(__dirname, '../data/iot_devices.db'));

// Initialize database
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        httpLogger.error(`Database initialization error: ${err.message}`);
        reject(err);
        return;
      }
      
      httpLogger.info('Connected to SQLite database');
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          httpLogger.error(`Failed to enable foreign keys: ${err.message}`);
        }
      });

      // Create devices table
      db.run(`CREATE TABLE IF NOT EXISTS devices (
        mac_address TEXT PRIMARY KEY,
        vendor_class_type TEXT NOT NULL,
        name TEXT NOT NULL,
        activated BOOLEAN DEFAULT 0,
        activation_type TEXT DEFAULT 'none',
        device_type TEXT NOT NULL,
        image_path TEXT,
        ipv6_address TEXT,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        manual_mode BOOLEAN DEFAULT 0
      )`, (err) => {
        if (err) {
          httpLogger.error(`Failed to create devices table: ${err.message}`);
          reject(err);
          return;
        }
        
        // Create relationships table
        db.run(`CREATE TABLE IF NOT EXISTS relationships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          sensor_mac TEXT NOT NULL,
          actuator_mac TEXT NOT NULL,
          actuator_type TEXT NOT NULL,
          set_time INTEGER DEFAULT 1,
          direction INTEGER CHECK(direction >= 0 AND direction <= 3),
          FOREIGN KEY (sensor_mac) REFERENCES devices (mac_address) ON DELETE CASCADE,
          FOREIGN KEY (actuator_mac) REFERENCES devices (mac_address) ON DELETE CASCADE,
          UNIQUE(sensor_mac, actuator_mac, direction)
        )`, (err) => {
          if (err) {
            httpLogger.error(`Failed to create relationships table: ${err.message}`);
            reject(err);
          } else {
            httpLogger.info('Database tables created successfully');
            resolve(db);
          }
        });
      });
    });
  });
};

// Get database instance
const getDatabase = () => {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      httpLogger.error(`Database connection error: ${err.message}`);
    }
  });
};

// Device operations
const deviceOperations = {
  getAllDevices: () => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all('SELECT * FROM devices', [], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },
  
  getDeviceByMac: (macAddress) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.get('SELECT * FROM devices WHERE mac_address = ?', [macAddress], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  },

  getDeviceByIPv6: (ipv6Address) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      // Note: IPv6 addresses might have scope IDs (%eth0), consider storing/querying canonical form if needed
      db.get('SELECT * FROM devices WHERE ipv6_address = ?', [ipv6Address], (err, row) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(row); // Returns the device row or undefined if not found
      });
    });
  },
  
  addDevice: (device) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      // If name is not provided, default to vendor_class_type
      if (!device.name) {
        device.name = device.vendor_class_type;
      }
      
      db.run(
        'INSERT OR REPLACE INTO devices (mac_address, vendor_class_type, name, activated, activation_type, device_type, image_path, ipv6_address, last_seen, manual_mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)',
        [device.mac_address, device.vendor_class_type, device.name, device.activated || 0, device.activation_type || 'none', device.device_type, device.image_path || null, device.ipv6_address || null, device.manual_mode || 0],
        function(err) {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          if (this.changes > 0 && !this.lastID) {
            const updateDb = getDatabase();
            updateDb.run('UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE mac_address = ?', [device.mac_address], (updateErr) => {
              updateDb.close();
              if (updateErr) {
                console.error("Failed to update last_seen on replace:", updateErr);
              }
            });
          }
          resolve({ id: this.lastID || device.mac_address, ...device });
        }
      );
    });
  },
  
  updateDevice: (macAddress, updates) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      let updateFields = [];
      let updateValues = [];
      
      Object.keys(updates).forEach(key => {
        if (key !== 'last_seen') { 
          updateFields.push(`${key} = ?`);
          updateValues.push(updates[key]);
        }
      });

      updateValues.push(macAddress);

      if (updateFields.length === 0) {
        db.close();
        return resolve({ changes: 0 }); 
      }
      
      db.run(
        `UPDATE devices SET ${updateFields.join(', ')} WHERE mac_address = ?`,
        updateValues,
        function(err) {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes });
        }
      );
    });
  },

  updateDeviceConnectionInfo: (macAddress, ipv6Address) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run(
        'UPDATE devices SET ipv6_address = ?, last_seen = CURRENT_TIMESTAMP WHERE mac_address = ?',
        [ipv6Address, macAddress],
        function(err) {
          db.close();
          if (err) {
            httpLogger.error(`Error updating connection info for ${macAddress}: ${err.message}`);
            reject(err);
            return;
          }
          httpLogger.info(`Updated connection info for ${macAddress}. Changes: ${this.changes}`);
          resolve({ changes: this.changes });
        }
      );
    });
  },

  ensureDeviceExists: async (macAddress, ipv6Address, defaultName, defaultVendorClass, defaultType) => {
    try {
      const existingDevice = await deviceOperations.getDeviceByMac(macAddress);
      if (existingDevice) {
        httpLogger.info(`Device ${macAddress} exists. Updating connection info.`);
        // Only update connection info, don't overwrite existing image/name etc.
        await deviceOperations.updateDeviceConnectionInfo(macAddress, ipv6Address);
      } else {
        httpLogger.info(`Device ${macAddress} not found. Adding new device.`);
        
        // Determine default image path based on vendor class or type
        let imagePath = '/data/images/default.png'; // Default image
        const lowerVendorClass = defaultVendorClass.toLowerCase();
        // Simple check if vendor class indicates sensor or actuator
        if (lowerVendorClass.includes('sensor') || defaultType.toLowerCase().includes('sensor')) {
            imagePath = '/data/images/sensor.png';
        } else if (lowerVendorClass.includes('actuator') || defaultType.toLowerCase().includes('actuator')) {
            imagePath = '/data/images/actuator.png'; // Assuming actuator.png is for actuators
        } else if (lowerVendorClass.includes('fsr') || defaultType.toLowerCase().includes('fsr')) {
          imagePath = '/data/images/sensor.png'; 
        } else if (lowerVendorClass.includes('light') || defaultType.toLowerCase().includes('light')) {
          imagePath = '/data/images/actuator.png'; 
        } 
        // Add more specific checks if needed, e.g., based on exact vendorClassType
        else if (['PIR', 'FSR', 'AMBIENT'].includes(defaultVendorClass)) {
             imagePath = '/data/images/sensor.png';
        } else if (['LIGHT', 'COUNTER'].includes(defaultVendorClass)) {
             imagePath = '/data/images/actuator.png';
        }

        const newDevice = {
          mac_address: macAddress,
          vendor_class_type: defaultVendorClass,
          name: defaultName,
          device_type: defaultType,
          ipv6_address: ipv6Address,
          image_path: imagePath, // Set the determined image path
          manual_mode: false,
        };
        await deviceOperations.addDevice(newDevice);
      }
    } catch (error) {
      httpLogger.error(`Error in ensureDeviceExists for ${macAddress}: ${error.message}`);
      throw error;
    }
  },
  
  deleteDevice: (macAddress) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run('DELETE FROM devices WHERE mac_address = ?', [macAddress], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve({ deleted: this.changes > 0 });
      });
    });
  },

  getDevicesByType: (deviceType) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all('SELECT * FROM devices WHERE device_type LIKE ?', [`%${deviceType}%`], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },
};

// Relationship operations
const relationshipOperations = {
  getAllRelationships: () => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all('SELECT * FROM relationships', [], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },
  
  addRelationship: (relationship) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run(
         'INSERT INTO relationships (name, sensor_mac, actuator_mac, actuator_type, set_time, direction) VALUES (?, ?, ?, ?, ?, ?)',
        [relationship.name, relationship.sensor_mac, relationship.actuator_mac, relationship.actuator_type, relationship.set_time || 1, relationship.direction],
        function(err) {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, ...relationship });
        }
      );
    });
  },

  deleteRelationship: (id) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run('DELETE FROM relationships WHERE id = ?', [id], function(err) {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve({ deleted: this.changes > 0 });
      });
    });
  },
  
  getRelationshipsBySensor: (sensorMac) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all('SELECT * FROM relationships WHERE sensor_mac = ?', [sensorMac], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },
  
  getRelationshipsByActuator: (actuatorMac) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all('SELECT * FROM relationships WHERE actuator_mac = ?', [actuatorMac], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },

  getRelationshipsWithDeviceInfo: () => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.all(`
        SELECT 
          r.id, 
          r.name, 
          r.sensor_mac, 
          r.actuator_mac, 
          r.actuator_type,
          r.set_time,
          r.direction,
          sd.name AS sensor_name, 
          ad.name AS actuator_name,
          sd.image_path AS sensor_image, 
          ad.image_path AS actuator_image,
          sd.device_type AS sensor_type,
          ad.device_type AS actuator_device_type
        FROM relationships r
        JOIN devices sd ON r.sensor_mac = sd.mac_address
        JOIN devices ad ON r.actuator_mac = ad.mac_address
      `, [], (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  },

  updateRelationship: (id, relationship) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      db.run(
        'UPDATE relationships SET name = ?, sensor_mac = ?, actuator_mac = ?, actuator_type = ?, set_time = ?, direction = ? WHERE id = ?',
        [relationship.name, relationship.sensor_mac, relationship.actuator_mac, relationship.actuator_type, relationship.set_time || 1, relationship.direction, id],
        function(err) {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          resolve({ changes: this.changes, id });
        }
      );
    });
  },
};

module.exports = {
  initializeDatabase,
  getDatabase,
  deviceOperations,
  relationshipOperations,
};
