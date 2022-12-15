var express = require('express');
var routes = express.Router();

routes.use(require('./bookie/fixtures'));

routes.use(require('./modules/auth'));

routes.use(require('./modules/momo'));

module.exports = routes;