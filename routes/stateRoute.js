const express = require('express');
const router = express.Router();
const {
  getState
} = require('../controller/stateController.js');

const {loginornot} = require("../helper/login");


router.get('/',loginornot, getState);






module.exports = router;
