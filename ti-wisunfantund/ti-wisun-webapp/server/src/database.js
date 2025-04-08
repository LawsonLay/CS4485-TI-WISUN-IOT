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
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          httpLogger.error(`Failed to create devices table: ${err.message}`);
          reject(err);
          return;
        }
        
        // Create relationships table
        db.run(`CREATE TABLE IF NOT EXISTS relationships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sensor_mac TEXT NOT NULL,
          actuator_mac TEXT NOT NULL,
          actuator_type TEXT NOT NULL,
          FOREIGN KEY (sensor_mac) REFERENCES devices (mac_address) ON DELETE CASCADE,
          FOREIGN KEY (actuator_mac) REFERENCES devices (mac_address) ON DELETE CASCADE,
          UNIQUE(sensor_mac, actuator_mac)
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
  
  addDevice: (device) => {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      // If name is not provided, default to vendor_class_type
      if (!device.name) {
        device.name = device.vendor_class_type;
      }
      
      db.run(
        'INSERT OR REPLACE INTO devices (mac_address, vendor_class_type, name, activated, activation_type, device_type, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [device.mac_address, device.vendor_class_type, device.name, device.activated || 0, device.activation_type || 'none', device.device_type, device.image_path || null],
        function(err) {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, ...device });
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
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      });
      
      updateValues.push(macAddress);
      
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
        'INSERT INTO relationships (sensor_mac, actuator_mac, actuator_type) VALUES (?, ?, ?)',
        [relationship.sensor_mac, relationship.actuator_mac, relationship.actuator_type],
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
};

module.exports = {
  initializeDatabase,
  getDatabase,
  deviceOperations,
  relationshipOperations,
};
