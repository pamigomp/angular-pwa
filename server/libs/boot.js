'use strict';
const fs = require('fs');
const http = require('http');
const https = require('https');
const selfsigned = require('selfsigned');
const logger = require('./logger');

const certDir = 'cert';
const certFilePath = `${certDir}/cert.pem`;
const keyFilePath = `${certDir}/key.pem`;

module.exports = (app) => {
  /**
   * Create HTTP server.
   */
  const httpPort = normalizePort(process.env.PORT || process.env.PORT_HTTP || 8180);
  http.createServer(app)
    .listen(httpPort)
    .on('error', onError)
    .on('listening', onListening);

  let httpsPort = null;
  if (process.env.NODE_ENV !== 'production') {
    /**
     * Create HTTPS server.
     */
    generateCertificate();
    httpsPort = normalizePort(process.env.PORT_HTTPS || 8181);
    const options = {
      cert: fs.readFileSync(certFilePath),
      key: fs.readFileSync(keyFilePath)
    };
    https.createServer(options, app)
      .listen(httpsPort)
      .on('error', onError)
      .on('listening', onListening);
  }

  /**
   * Generate a self signed x509 certificate
   */
  function generateCertificate() {
    try {
      if (fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)) {
        logger.info(`Generating self signed x509 certificate skipped. Files already exist in '${certDir}' directory`);
      } else {
        const attrs = [{name: 'commonName', value: '192.168.0.12'}];
        const pems = selfsigned.generate(attrs, {days: 365});
        fs.mkdirSync(certDir, {recursive: true});
        fs.writeFileSync(certFilePath, pems.cert);
        fs.writeFileSync(keyFilePath, pems.private);
        logger.info(`Self signed x509 certificate successfully generated in '${certDir}' directory`);
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Normalize a port into a number, string, or false.
   */
  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const port = this.cert ? httpsPort : httpPort;

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        logger.error(error);
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    const addr = this.address();
    const type = this.cert ? '(HTTPS)' : '(HTTP)';
    const bind = (typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`) + ` ${type}`;

    logger.info(`App listening on ${bind}`);
  }
};
