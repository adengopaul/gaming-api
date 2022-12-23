var express = require('express');
var walletRoutes = express.Router();
var checkAuth = require('../check-auth');

walletRoutes.route('/wallet/balance', checkAuth ).get();

walletRoutes.route('/wallet/deposit', checkAuth).post();

module.exports = walletRoutes;