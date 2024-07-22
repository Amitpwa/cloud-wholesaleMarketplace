const express = require('express');
const router = express.Router();
const {
  getBrandCatalog,
  addBrandCatalog,
  getBrandCatalogById,
  deleteBrandCatalogById
} = require('../controller/brandCatalogController.js');

const {isAdmin,checkLogin,loginornot} = require("../helper/login.js");
const {validateBrandCatalog} = require("../helper/validator.js");


router.get('/',loginornot, getBrandCatalog);

router.post('/',checkLogin,isAdmin,validateBrandCatalog, addBrandCatalog);

router.get('/getBrandCatalogById',loginornot, getBrandCatalogById);

router.delete('/deleteBrandCatalogById/:id',checkLogin,isAdmin, deleteBrandCatalogById);




module.exports = router;
