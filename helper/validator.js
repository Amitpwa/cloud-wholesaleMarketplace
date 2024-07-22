const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Tax = require('../models/tax');
const Cart = require('../models/Cart');

const { ObjectId } = require('mongoose').Types;


// Middleware to validate categories and tax

const validateCategoriesAndTax = async (req, res, next) => {
  const productToValidate = req.body;
console.log(productToValidate);
  // Validate tax IDs and remove invalid ones
  const validTaxIds = [];
  for (const taxId of productToValidate.tax) {
    const isValid = await Tax.exists({ _id: taxId });
    if (isValid) {
      validTaxIds.push(taxId);
    }
  }
  productToValidate.tax = validTaxIds;
  console.log("validTaxIds",validTaxIds);
  
  
  // Validate category IDs and remove invalid ones
  const validCategoryIds = [];
  for (const categoryId of productToValidate.categories) {
    const isValid = await Category.exists({ _id: categoryId });
    if (isValid) {
      validCategoryIds.push(categoryId);
    }
  }
  productToValidate.categories = validCategoryIds;
  console.log("validCategoryIds",validCategoryIds);


  // Check if any tax or category IDs are left
  if (productToValidate.tax.length > 0 || productToValidate.categories.length > 0) {
    // If both categories and tax are valid, proceed with the modified product
    req.body = productToValidate;
    next();
  } else {
    productToValidate.categories = null;
    productToValidate.tax = null;
    req.body = productToValidate;
    // Either categories or tax IDs are empty
    next();
    }
};



const categoriesAndTaxExistOrNot = async (req, res, next) => {
  try {
    const payload = req.body; // Assuming req.body is the array of JSON objects
    // console.log(payload);
    const allCategories = await Category.find({},{'_id':1,'name':1});
    const allTaxDetails = await Tax.find({}, {'_id':1,'taxName':1});

    for (const product of payload) {
      if (product.categories && product.categories.length > 0) {
        const categoryNames = product.categories;
        let categoryIds = [];
        if(allCategories && allCategories.length >0){
          allCategories.map(cur_categories=>{
            categoryNames.filter(productCategory=>{return productCategory == cur_categories.name})[0]?
            categoryIds.push(cur_categories):null;
          })
        }
        // const categoryIds = await allCategories.filter({ name: { $in: categoryNames } }, '_id');
        product.categories = categoryIds.map(category => category._id);
      } else {
        product.categories = null;
      }

      if (product.category) {
        const categoryName = product.category;
        const category = allCategories.filter(cur_categories=>cur_categories.name == categoryName)[0];
        product.category = category ? category._id : null;
      } else {
        product.category = null;
      }

      if (!product.slug) {
        // If not, generate slug from title
        const slug = product.title.replace(/\s+/g, '-').toLowerCase();
        // Assign the generated slug to the product
        product.slug = slug;
    }

      if (product.tax && product.tax.length > 0) {
        const taxNames = product.tax;
        let taxIds = [];
        if(allTaxDetails && allTaxDetails.length > 0){
          allTaxDetails.map(cur_taxDetails=>{
            taxNames.filter(productTax=>{return productTax == cur_taxDetails.taxName})[0]?
            taxIds.push(cur_taxDetails):null;
          })
        }
        // const taxIds = await Tax.find({ taxName: { $in: taxNames } }, '_id');
        product.tax = taxIds.map(tax => tax._id);
      } else {
        product.tax = null;
      }
    }
    console.log(req.body);
    // Continue to the next middleware or controller with the updated req.body
    next();
  } catch (error) {
    // Handle any errors, such as database connection issues
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// const stockAndCartMatching = async (req, res, next) => {
//   try{

//   // Find cart items for the given userId
//   const cartItems = await Cart.find({ userId:req.query.userId }).populate({
//     path: "products.productId",
//     model: "Product",
//     select: "title stock minimumOrderOfQuantity",
//   });

//   // Validate cart items
//   const invalidItems = [];
//   for (const item of cartItems) {
//     for (const productItem of item.products) {
//       const product = productItem.productId;
//       const cartQuantity = parseInt(productItem.quantity);
      
//       if (cartQuantity < product.minimumOrderOfQuantity) {
//         invalidItems.push({ productId: product._id,Title: product.title,Quantity: cartQuantity, message: 'Quantity is less than Minimum Order Of Quantity' });
//       }
//       if (cartQuantity > product.stock) {
//         invalidItems.push({ productId: product._id,Title: product.title,Quantity: cartQuantity, message: 'Quantity exceeds Available Stock' });
//       }
//     }
//   }

//   // If there are invalid items, return error response
//   if (invalidItems.length > 0) {
//     return res.status(400).json({ success: false, message: "Validation failed", invalidItems });
//   }

//   // If all items are valid, return cart items
//   res.json({
//     success: true,
//     message: "Successfully fetched cart items",
//     cartItems,
//   });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: "Internal Server Error" });
// }
// }


const validateBrandCatalog = async (req, res, next) => {
  try {
    const payload = req.body; 
    if (payload && payload.brandName &&  payload.brandName != '' &&
      payload.brandLogo &&  payload.brandLogo != ''  &&
      payload.brandFile  &&  payload.brandFile != '' ) {
      next();
  } else {
      res.send({
          success: false,
          message: "Please enter required field!!",
      });
  }
  
   
  } catch (error) {
    // Handle any errors, such as database connection issues
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {validateCategoriesAndTax,categoriesAndTaxExistOrNot,validateBrandCatalog};