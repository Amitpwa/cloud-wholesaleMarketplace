const express = require("express");
const router = express.Router();

const {checkLoginForUser} = require("../helper/login.js");


const {
    addToCart,
    getFromCart
  } = require('../controller/cartController.js');

router.post("/addtocart",checkLoginForUser,addToCart);

router.get("/getfromcart",checkLoginForUser,getFromCart);


module.exports = router;