const express = require("express");
const router = express.Router();
const {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
} = require("../controller/productController");
const {isAdmin,checkLogin} = require("../helper/login");
const {validateCategoriesAndTax,categoriesAndTaxExistOrNot} = require("../helper/validator");
const productValidation=require("../validator/productValidator")


//add a product
router.post("/add",checkLogin,validateCategoriesAndTax,productValidation,addProduct);

//add multiple products
router.post("/all",checkLogin,categoriesAndTaxExistOrNot,addAllProducts);

//get a product
router.post("/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);
  
//get all products
router.get("/", getAllProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.put("/:id", updateProduct);

//update many products
router.patch("/update/many", updateManyProducts);

//update a product status
router.put("/status/:id", updateStatus);

//delete a product
router.delete("/:id", deleteProduct);

//delete many product
router.patch("/delete/many", deleteManyProducts);

module.exports = router;