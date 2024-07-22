const express = require('express');
const router = express.Router();
const {
    getenquiry,
    enquiry,
    action,
    search
} = require('../controller/enquiryController.js');

const {loginornot} = require("../helper/login.js");


router.get('/',loginornot, getenquiry);

router.post('/',loginornot, enquiry);

router.post('/action',loginornot, action);

router.get("/search", search);



module.exports = router;
