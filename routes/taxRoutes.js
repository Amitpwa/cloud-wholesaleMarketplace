const express = require('express');
const router = express.Router();
const {
  getTax,
  addTax,
  getTaxById,
  deleteTax,
  taxaccordingstate
} = require('../controller/taxController');

const {checkLogin,loginornot} = require("../helper/login");


router.get('/',loginornot, getTax);

router.post('/',checkLogin, addTax);

router.get('/taxbyid',loginornot, getTaxById);

router.post('/deletetax',checkLogin, deleteTax);

router.post('/taxaccordingstate',loginornot, taxaccordingstate);



module.exports = router;
