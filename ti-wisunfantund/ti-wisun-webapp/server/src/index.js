const express = require('express');
const {httpLogger} = require('./logger.js');
const {initializeRoutes} = require('./routes.js');
const {BorderRouterManager} = require('./BorderRouterManager.js');
const {getPingExecutor} = require('./PingExecutor.js');
const http = require('http');
const coap = require('coap');
const SocketIOServer = require('socket.io').Server;
const {CONSTANTS, setAppConstants, assertDependencies} = require('./AppConstants.js');
const {initializeSocketIOEvents} = require('./ClientState');
const {initializeDatabase} = require('./database.js');
const fs = require('fs');
const path = require('path');

/**
 * This is the program entry and exit. From here all
 * of the app constants are setup, wfantund is started,
 * the express webserver (with an http server using socket.io)
 * is initialized, the BR manager is setup, the ping executor
 * is setup, and then all of the webserver endpoints are setup.
 */
function main() {
  setAppConstants();
  assertDependencies();
  
  // Ensure data directory exists
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Initialize database
  initializeDatabase()
    .then(() => {
      httpLogger.info('Database initialized successfully');
    })
    .catch(err => {
      httpLogger.error(`Database initialization failed: ${err.message}`);
    });
  
  const app = express();
  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer);
  const coapServer = coap.createServer({
    type: 'udp6'
  })
  initializeSocketIOEvents(io);
  const brManager = new BorderRouterManager();
  const pingExecutor = getPingExecutor();
  initializeRoutes(app, pingExecutor, brManager);
  initializeCoAPServer(coapServer);

  httpServer.listen(CONSTANTS.PORT, CONSTANTS.HOST, () => {
    httpLogger.info(`Listening on http://${CONSTANTS.HOST}:${CONSTANTS.PORT}`);
  });
  process.on('exit', async code => {
    await brManager.exit();
  });
}

main();
