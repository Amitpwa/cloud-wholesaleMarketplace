const express = require('express');
const router = express.Router();
const {
  getShippingMethod,
  getShippingMethodById,
  addShippingMethod,
  deleteShippingMethod
} = require('../controller/shippingController.js');

const {isAdmin,checkLogin,loginornot} = require("../helper/login");


router.get('/',loginornot, getShippingMethod);

router.post('/',checkLogin,isAdmin, addShippingMethod);

router.get('/shippingmethodbyid',loginornot, getShippingMethodById);

router.delete('/deleteshippingmethod/:id',checkLogin,isAdmin, deleteShippingMethod);




module.exports = router;
