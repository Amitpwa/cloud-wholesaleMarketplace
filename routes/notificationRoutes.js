const express = require('express');
const router = express.Router();
const {
      getAllNotification,
      getNotificationById } = require('../controller/notificationController.js');

const {loginornot} = require("../helper/login.js");


router.get('/all',loginornot,getAllNotification);
router.get('/',loginornot,getNotificationById);




module.exports = router;