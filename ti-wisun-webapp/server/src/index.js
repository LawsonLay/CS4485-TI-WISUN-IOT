const express = require('express');
const {httpLogger} = require('./logger.js');
const {initializeRoutes} = require('./routes.js');
const {startCoapServer} = require('./coapServer.js');
const {BorderRouterManager} = require('./BorderRouterManager.js');
const {getPingExecutor} = require('./PingExecutor.js');
const http = require('http');
const SocketIOServer = require('socket.io').Server;
const {CONSTANTS, setAppConstants, assertDependencies} = require('./AppConstants.js');
const {initializeSocketIOEvents} = require('./ClientState');
const {initializeDatabase} = require('./database.js');
const fs = require('fs');
const path = require('path');
const { start } = require('repl');

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
  initializeSocketIOEvents(io);
  const brManager = new BorderRouterManager();
  const pingExecutor = getPingExecutor();
  initializeRoutes(app, pingExecutor, brManager, io);
  startCoapServer(brManager, io);

  httpServer.listen(CONSTANTS.PORT, CONSTANTS.HOST, () => {
    httpLogger.info(`Listening on http://${CONSTANTS.HOST}:${CONSTANTS.PORT}`);
  });
  process.on('exit', async code => {
    await brManager.exit();
  });
}

main();
