const express = require('express');
const router = express.Router();
const {
  getProductRequest,
  statusChange,
} = require('../controller/productRequestController.js');

const {isAdmin,checkLogin} = require("../helper/login.js");


router.get('/',checkLogin,isAdmin, getProductRequest);

router.post('/statuschange',checkLogin,isAdmin, statusChange);





module.exports = router;
