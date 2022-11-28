var express = require('express');
var routes = express.Router();

routes.use(require('./bookie/fixtures'));

module.exports = routes;