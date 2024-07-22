const express = require('express');
const router = express.Router();
const {
  getPromotionMethod,
  getPromotionMethodById,
  addPromotionMethod,
  deletePromotionById
} = require('../controller/promotionController.js');

const {isAdmin,checkLogin,loginornot} = require("../helper/login");


router.get('/',loginornot, getPromotionMethod);

router.post('/',checkLogin,isAdmin, addPromotionMethod);

router.get('/getpromotionmethodbyid',checkLogin, getPromotionMethodById);

router.post('/deletepromotionbyid',checkLogin, deletePromotionById);





module.exports = router;
