const express = require("express");
const router = express.Router();

const {isAdmin,loginornot} = require("../helper/login");

const {
    about,getAbout,
  } = require('../controller/aboutController.js');

router.post("/",isAdmin,about);

router.get("/",loginornot,getAbout);


module.exports = router;
