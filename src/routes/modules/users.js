var express = require('express');
var userRouters = express.Router();
const dbo = require('../../db/conn'); 

userRouters.route('/users').get(async (req, res) => {
  const Users = dbo.getDb().collection('users');
})

module.exports = userRouters;
