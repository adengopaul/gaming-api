var express = require('express');
var routes = express.Router();

routes.use(require('./bookie/fixtures'));
routes.use(require('./bettor/home'));

routes.use(require('./modules/auth'));

routes.use(require('./modules/wallet'));

routes.use(require('./modules/recieveSMS'));

module.exports = routes;