const Product = require("../models/Product");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Tax = require("../models/tax");
const { sendProductUploadProgress } = require('../helper/socketConsumer');
const { ObjectId } = require('mongodb');


const addProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      // productId: cname + (count + 1),
      productId: req.body.productId
        ? req.body.productId
        : mongoose.Types.ObjectId(),
    });
  
    await newProduct.save((error, savedProduct)=>{
      if(error){
        console.log(error);
        res.status(500).send({
          message: error.message,
        });
      }
      res.status(200).send({
        _id:savedProduct._id,
        message: "Product Added successfully!",
      });
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const addAllProducts = async (req, res) => {
  try {

    // Example usage
    const chunkSize = 10; // Choose an appropriate chunk size
    
    const dataToInsert = req.body;
  
  const totalChunks = Math.ceil(dataToInsert.length / chunkSize);
  console.log("totalChunks................ ",totalChunks)
  // Insert data in chunks with progress tracking
  const insertManyWithProgress = async () => {
    try{
      for (let i = 0; i < totalChunks; i++) {
        const startIdx = i * chunkSize;
        const endIdx = (i + 1) * chunkSize;
        const chunk = dataToInsert.slice(startIdx, endIdx);
  
        // Insert the chunk into the database
        await Product.insertMany(chunk);
  
        // Calculate progress and send it to the client
        const progress = ((i + 1) / totalChunks) * 100;
        // sendProgress(progress);
        console.log("progress.... ",progress);
        sendProductUploadProgress(progress)
      }
  
      // Signal completion
      // res.end();
      return true
    }catch(err){
      console.log("err.... ",err)
      return false;
    }
  };
  const result = await insertManyWithProgress();
  console.log("result... ",result);
  res.status(200).send({
    success:true,
    message: "Product Added successfully!",
    result,
  });
    // const response = await  insertManyWithProgress(Product,dataToInsert, chunkSize, progressCallback)
    // console.log("Response... ",response);
    // var response=await Product.insertMany(req.body);
    // res.status(200).send({
    //   success:true,
    //   message: "Product Added successfully!",
    //   response,
    // });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success:false,
      message: err.message,
      err
    });
  }
};

const getAllProducts = async (req, res) => {
  const { title, category, price, page, limit } = req.query;
  let queryObject = {};
  let sortObject = {};
  if (title) {
    queryObject.$or = [
      { "title": { $regex: `${title}`, $options: "i" } },
      { "title": { $regex: `${title}`, $options: "i" } },
      { "title": { $regex: `${title}`, $options: "i" } },
      { "title": { $regex: `${title}`, $options: "i" } },
      { "title": { $regex: `${title}`, $options: "i" } },
    ];
  }

  if (price === "low") {
    sortObject = {
      "prices.originalPrice": 1,
    };
  } else if (price === "high") {
    sortObject = {
      "prices.originalPrice": -1,
    };
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gt: 0 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 1 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject = { _id: -1 };
  }

  // console.log('sortObject', sortObject);

  if (category) {
    const categoryId = ObjectId(category);
    queryObject.$or = [
        { categories: categoryId },
        { category: categoryId }
    ];
}

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);
    var totallength=Math.ceil(totalDoc/limit);
    
    const products = await Product.find(queryObject)
    .populate({ path: "category", select: "_id name" })
    .populate({ path: "categories", select: "_id name" })
    .populate({
      path: "tax",
      model: Tax,
      select: "_id taxName taxType amount",
    })
    .sort(sortObject)
    .skip(skip)
    .limit(limits);
  
    if(totallength==1 && page==totallength ){
      prevPage=null;
      hasPrevPage=false;
      nextPage=null;
      hasNextPage=false; 
  }
  else if(page==1 && totallength>page) {
              prevPage=null;
              hasPrevPage=false;
              nextPage=Number(page)+1; 
              hasNextPage=true;
  }
  else if(page>1 && page==totallength){
          prevPage=Number(page)-1;
          hasPrevPage=true;
          nextPage=null;
          hasNextPage=false;
  }
  else{   prevPage=Number(page)-1;
          nextPage=Number(page)+1;
          hasPrevPage=true;
          hasNextPage=true;
  }

  const  Pagination ={
    "TotalDocuments":totalDoc,
    "limit":limit,
    "TotalPages":totallength,
    "Current Page":page,
    "PrevPage":prevPage,
    "NextPage":nextPage,
    "HasPrevPage":hasPrevPage,
    "HasNextPage":hasNextPage,
    "PagingCounter":page,      
  };
  res.send({
    success:true,
    message: "Successfully fetch!!",
    products,
    Pagination
  });

  } catch (err) {
    // console.log("error", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category"})
      .populate({ path: "categories"})
      .populate({
        path: "tax",
        model: Tax,
        select: "_id taxName taxType amount",
      });
      if(product==null){
        res.status(200).send({
          success:true,
          message:"Product not found!",
        })
      }
      else{
        res.status(200).send({
          success:true,
          message:"Sucessfully fetch!",
          product
        })
      }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  // console.log('update product')
  // console.log('variant',req.body.variants)
  try {
    const product = req.body;
    // console.log("product", product);

    if (product) {
      // product.title = req.body.title ;
      // product.description = req.body.description,
      // product.productId = req.body.productId;
      // product.sku = req.body.sku;
      // product.barcode = req.body.barcode;
      // product.slug = req.body.slug;
      // product.categories = req.body.categories;
      // product.category = req.body.category;
      // product.show = req.body.show;
      // product.isCombination = req.body.isCombination;
      // product.variants = req.body.variants;
      // product.stock = req.body.stock;
      // product.prices = req.body.prices;
      // product.image = req.body.image;
      // product.tag = req.body.tag;
      // product.tax = req.body.tax;

      ////////////////////////////////////////////////////////////////////////
      // product.title = req.body.title ? req.body.title : product.title;
      // product.description = req.body.description ? req.body.description : product.description;
      // product.productId = req.body.productId ? req.body.productId : product.productId;
      // product.sku = req.body.sku ? req.body.sku : product.sku;
      // product.barcode = req.body.barcode ? req.body.barcode : product.barcode;
      // product.slug = req.body.slug ? req.body.slug : product.slug;
      // product.categories = req.body.categories ? req.body.categories : product.categories;
      // product.category = req.body.category ? req.body.category : product.category;
      // product.show = req.body.show ? req.body.show : product.show;
      // product.isCombination = req.body.isCombination ? req.body.isCombination : product.isCombination;
      // product.variants = req.body.variants ? req.body.variants : product.variants;
      // product.stock = req.body.stock ? req.body.stock : product.stock;
      // product.prices = req.body.prices ? req.body.prices : product.prices;
      // product.image = req.body.image ? req.body.image : product.image;
      // product.tag = req.body.tag ? req.body.tag : product.tag;
      // product.tax = req.body.tax ? req.body.tax : product.tax;
      ////////////////////////////////////////////////////////////////////////

      



      const updatedProduct = await Product.updateOne({ _id: req.params.id }, { $set: { ...product } });
      res.send({ data: updatedProduct, message: "Product updated successfully!" });
    } else {
      res.status(404).send({
        message: "Product Not Found!",
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
    console.log('err',err)
  }
};

const deleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      if (result.deletedCount === 0) {
        // No document was deleted (specified id does not exist)
        res.status(404).send({
          message: "Product not found for deletion",
        });
      } else {
        // Document was deleted successfully
        res.status(200).send({
          message: "Product Deleted Successfully!",
        });
      }
    }
  });
  
};

const updateManyProducts = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        // console.log('req.body[key]', typeof req.body[key]);
        updatedData[key] = req.body[key];
      }
    }

    // console.log("updated data", updatedData);

    await Product.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );
    res.send({
      message: "Products update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};


const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "show" }).sort({ _id: -1 });
    res.send(products);
    // console.log("products", products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductBySlug = async (req, res) => {
  // console.log("slug", req.params.slug);
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
    });
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: `Product ${newStatus} Successfully!`,
        });
      }
    }
  );
};


const getShowingStoreProducts = async (req, res) => {
  // console.log("req.body", req);
  try {
    const queryObject = {};

    const { category, title } = req.query;
    // console.log("category", category);

    queryObject.status = "show";

    if (category) {
      queryObject.categories = {
        $in: [category],
      };
    }

    if (title) {
      queryObject.$or = [
        { "title": { $regex: `${title}`, $options: "i" } },
        { slug: `${title}` },
      ];
    }

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "name _id" })
      .sort({ _id: -1 })
      .limit(100).populate({
        path: "tax",
        model: Tax,
        select: "_id taxName taxType amount",
      })

    const relatedProduct = await Product.find({
      category: products[0]?.category,
    }).populate({ path: "category", select: "_id name" }).populate({
      path: "tax",
      model: Tax,
      select: "_id taxName taxType amount",
    });

    const aggregatedProducts = await Product.aggregate([
      {
        $group: {
          _id: "$productSpecification.brand",
          products: { $push: "$$ROOT" }
        }
      }
    ]);

    // Array to store selected products
    const fetureproduct = [];

    // Loop through each group
    for (const brandGroup of aggregatedProducts) {
      const { _id, products } = brandGroup;

      // Add brand name and formatted products to the final array
      fetureproduct.push({
        brandName: _id,
        products: products.map(product => ({
          _id:product._id,
          productId: product.productId,
          sku: product.sku,
          HsnSacNumber: product.HsnSacNumber,
          askForPrice: product.askForPrice,
          fewLeft: product.fewLeft,
          barcode: product.barcode,
          title: product.title,
          description: product.description,
          slug: product.slug,
          categories: product.categories,
          category: product.category,
          image: product.image,
          stock: product.stock,
          tax: product.tax,
          warrantyPeriods: product.warrantyPeriods,
          minimumOrderOfQuantity: product.minimumOrderOfQuantity,
          moqSlab: product.moqSlab,
          sales: product.sales,
          tag: product.tag,
          prices: product.prices,
          variants: product.variants,
          isCombination: product.isCombination,
          status: product.status,
          userManual: product.userManual,
          technicalSpecification: product.technicalSpecification,
          productSpecification: product.productSpecification,
          dataSheet: product.dataSheet,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))
      });
    };
  
    
      res.send({
        products,
        relatedProduct,
        fetureproduct
      });

   
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyProducts = async (req, res) => {
  try {
    const cname = req.cname;
    // console.log("deleteMany", cname, req.body.ids);

    await Product.deleteMany({ _id: req.body.ids });

    res.send({
      message: `Products Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
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
};
