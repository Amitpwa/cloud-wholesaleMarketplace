const express = require("express");
const router = express.Router();
const {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  getOrderByUserId
} = require("../controller/customerOrderController");

const {checkLoginForUser} = require("../helper/login.js");


//add a order
router.post("/add", addOrder);

// create stripe payment intent
router.post("/create-payment-intent", createPaymentIntent);

//get a order by id
router.get("/:orderid", getOrderById);

//get all order by a user
router.get("/",checkLoginForUser, getOrderCustomer);

router.get("/allorderbyuserid",checkLoginForUser, getOrderByUserId);


module.exports = router;