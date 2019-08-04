'use strict';
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const morgan = require('morgan');
const responseTime = require('response-time');
const express = require('express');
const path = require('path');
const logger = require('./logger');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = (app) => {

  app.use(responseTime());
  app.use(helmet());
  app.use(cors());
  app.use(morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" status: :status :res[content-length] - :response-time ms ":referrer" ":user-agent"', {
    stream: logger.stream
  }));
  app.use(compression());
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(bodyParser.json({type: 'application/vnd.api+json'}));
  app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
  app.use((req, res, next) => {
    if (isProduction && !(req.secure || req.headers['x-forwarded-proto'] === 'https')) {
      res.redirect(`https://${req.hostname}:${process.env.PORT_HTTPS}${req.url}`);
    } else {
      next();
    }
  });

  const html = path.resolve(__dirname + '/../../dist/angular-pwa');
  console.log(html);
  app.use(express.static(html));
  app.use((req, res) => {
    res.sendFile(html + '/index.html');
  });

  if (!isProduction) {
    app.use(errorHandler({log: errorNotification}));
  }

  function errorNotification(err, str, req) {
    const title = `Error in ${req.method} ${req.url}`;
    logger.error(`${title}. ${str}`);
  }
};
