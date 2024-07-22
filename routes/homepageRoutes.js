const express = require('express');
const router = express.Router();
const {
  getHomePageBanner,
  addHomePageBanner,
  deleteHomePageBanner,
  search,
  suggestions
} = require('../controller/homepageController');

const {isAdmin,checkLogin,loginornot} = require("../helper/login");
const homepageValidation=require("../validator/homepageValidator")


router.get('/homepagebanner',loginornot,getHomePageBanner);

router.post('/homepagebanner',checkLogin,isAdmin, homepageValidation,addHomePageBanner);

router.post('/deletehomepagebanner',checkLogin,isAdmin, deleteHomePageBanner);

router.get('/search',loginornot, search);

router.get('/suggestion',loginornot, suggestions);



module.exports = router;
