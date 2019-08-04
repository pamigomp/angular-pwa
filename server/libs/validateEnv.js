'use strict';
const {cleanEnv} = require('envalid');

module.exports = () => cleanEnv(process.env, {});
