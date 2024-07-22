const askForPriceSchema = require("../models/askForPrice");
const sendNotification = require('../helper/sendNotification');

// const askForPrice = async (req, res) => {
//   try {
//     const newAttribute = new askForPriceSchema(req.body);
//     await newAttribute.save();
//     res.status(200).send({
//       success:true,
//       message: `submited`,
//     });
//   } catch (err) {
//     res.status(500).send({
//       success:false,
//       message: `Error occur when adding attribute ${err.message}`,
//     });
//   }
// };


const askForPrice = async (req, res) => {
  try {
    console.log( req.query.userId);
    const newAttribute = new askForPriceSchema(req.body);
    await newAttribute.save();

    // Assuming you have notification details in req.body
    const { notificationSubject="Ask For Price", notificationBody="Ask for price " } = req.body;
    const toUserIds= req.query.userId;
    // Call the sendNotification function with the provided arguments
    await sendNotification(toUserIds, notificationSubject, notificationBody);

    // Send response indicating success
    res.status(200).send({
      success: true,
      message: `Asking price successfully`,
    });
  } catch (err) {
    // Handle errors
    res.status(500).send({
      success: false,
      message: `Error occurred: ${err.message}`,
    });
  }
};

// const getAskForPrice = async (req, res) => {
//     try {
//       const getAskForPriceDetails = await askForPriceSchema.find().exec();
//       res.status(200).send({
//         success:true,
//         getAskForPriceDetails,
//         message: "Successfully fetch!!",
//       });
//     } catch (err) {
//         console.log(err);
//       res.status(500).send({
//         success:false,
//         message: `Error occur when adding attribute ${err.message}`,
//       });
//     }
// };

// const getAskForPrice = async (req, res) => {
//   try {
   
//     const {
//       day,
//       status,
//       page,
//       limit,
//       method,
//       endDate,
//       // download,
//       // sellFrom,
//       startDate,
//       customerName,
//     } = req.query;
  
//     //  day count
//     let date = new Date();
//     const today = date.toString();
//     date.setDate(date.getDate() - Number(day));
//     const dateTime = date.toString();
  
//     const beforeToday = new Date();
//     beforeToday.setDate(beforeToday.getDate() - 1);
//     // const before_today = beforeToday.toString();
  
//     const startDateData = new Date(startDate);
//     startDateData.setDate(startDateData.getDate());
//     const start_date = startDateData.toString();
  
//     // console.log(" start_date", start_date, endDate);
  
//     const queryObject = {};
  
//     if (!status) {
//       queryObject.$or = [
//         { status: { $regex: `Pending`, $options: "i" } },
//         { status: { $regex: `Processing`, $options: "i" } },
//         { status: { $regex: `Delivered`, $options: "i" } },
//         { status: { $regex: `Cancel`, $options: "i" } },
//       ];
//     }
  
//     if (customerName) {
//       queryObject.$or =[ 
//        { "personalDetails.firstName": { $regex: `${customerName}`, $options: "i" }} ];
//     }
  
//     if (day) {
//       queryObject.createdAt = { $gte: dateTime, $lte: today };
//     }
  
//     if (status) {
//       queryObject.status = { $regex: `${status}`, $options: "i" };
//     }
  
//     if (startDate && endDate) {
//       queryObject.updatedAt = {
//         $gt: start_date,
//         $lt: endDate,
//       };
//     }
   

//     const getAskForPriceDetails = await askForPriceSchema
//       .find(queryObject)
//       .skip((page-1)*limit).limit(Number(limit)).exec();

//    console.log(getAskForPriceDetails);

//        const allData = await askForPriceSchema.find(queryObject);

//     var count=allData.length;
//     var totallength=Math.ceil(count/limit);

//     if(totallength==1 && page==totallength ){
//         prevPage=null;
//         hasPrevPage=false;
//         nextPage=null;
//         hasNextPage=false; 
//     }
//     else if(page==1 && totallength>page) {
//                 prevPage=null;
//                 hasPrevPage=false;
//                 nextPage=Number(page)+1; 
//                 hasNextPage=true;
//     }
//     else if(page>1 && page==totallength){
//             prevPage=Number(page)-1;
//             hasPrevPage=true;
//             nextPage=null;
//             hasNextPage=false;
//     }
//     else{   prevPage=Number(page)-1;
//             nextPage=Number(page)+1;
//             hasPrevPage=true;
//             hasNextPage=true;
//     }

//     const pagination = {
//       TotalDocuments: count,
//       limit,
//       TotalPages: totallength,
//       CurrentPage: page,
//       PrevPage: prevPage,
//       NextPage: nextPage,
//       HasPrevPage: hasPrevPage,
//       HasNextPage: hasNextPage,
//       PagingCounter: page,
//     };

//     res.status(200).send({
//       success: true,
//       getAskForPriceDetails,
//       pagination,
//       message: "Successfully fetch!!",
//     });
    
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       success: false,
//       message: `Error occurred when fetching data: ${err.message}`,
//     });
//   }
// };




// const getAskForPrice = async (req, res) => {
//   try {
//     // Extracting query parameters
//     const {
//       day,
//       status,
//       page,
//       limit,
//       method,
//       endDate,
//       startDate,
//       customerName,
//     } = req.query;
  
//     // Calculate dates
//     let date = new Date();
//     const today = date.toString();
//     date.setDate(date.getDate() - Number(day));
//     const dateTime = date.toString();
  
//     const beforeToday = new Date();
//     beforeToday.setDate(beforeToday.getDate() - 1);
  
//     const startDateData = new Date(startDate);
//     startDateData.setDate(startDateData.getDate());
//     const start_date = startDateData.toString();
  
//     // Creating query object
//     const queryObject = {};
  
//     if (!status) {
//       queryObject.$or = [
//         { status: { $regex: `Pending`, $options: "i" } },
//         { status: { $regex: `Processing`, $options: "i" } },
//         { status: { $regex: `Delivered`, $options: "i" } },
//         { status: { $regex: `Cancel`, $options: "i" } },
//       ];
//     }
  
//     if (customerName) {
//       queryObject.$or = [
//         { "personalDetails.firstName": { $regex: `${customerName}`, $options: "i" } },
//         { "productName": { $regex: `${customerName}`, $options: "i" } }
//       ];
//     }
  
//     if (day) {
//       queryObject.createdAt = { $gte: dateTime, $lte: today };
//     }
  
//     if (status) {
//       queryObject.status = { $regex: `${status}`, $options: "i" };
//     }
  
//     if (startDate && endDate) {
//       queryObject.updatedAt = {
//         $gt: start_date,
//         $lt: endDate,
//       };
//     }
   
//     // Fetching AskForPrice details
//     const getAskForPriceDetails = await askForPriceSchema
//       .find(queryObject)
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .exec();

//     // Fetching corresponding product names based on productIds
//     const productIds = getAskForPriceDetails.map(item => item.productId);
//     const products = await Product.find({ _id: { $in: productIds } }).select("_id title");

//     // Mapping productIds to product names
//     const productIdToName = products.reduce((acc, product) => {
//       acc[product._id] = product.title;
//       return acc;
//     }, {});

//     // Updating getAskForPriceDetails with product names
//     const getAskForPriceDetailsWithNames = getAskForPriceDetails.map(item => ({
//       productId: item.productId,
//       productName: productIdToName[item.productId] || "Unknown", // Fallback to "Unknown" if product name not found
//       ...item._doc // Include other fields from original document
//     }));

//     // Calculate pagination
//     const count = await askForPriceSchema.countDocuments(queryObject);
//     const totalPages = Math.ceil(count / limit);
//     const hasNextPage = page < totalPages;
//     const hasPrevPage = page > 1;
  
//     const pagination = {
//       TotalDocuments: count,
//       limit,
//       TotalPages: totalPages,
//       CurrentPage: page,
//       PrevPage: hasPrevPage ? page - 1 : null,
//       NextPage: hasNextPage ? page + 1 : null,
//       HasPrevPage: hasPrevPage,
//       HasNextPage: hasNextPage,
//       PagingCounter: (page - 1) * limit,
//     };
  
//     res.status(200).send({
//       success: true,
//       getAskForPriceDetails: getAskForPriceDetailsWithNames,
//       pagination,
//       message: "Successfully fetch!!",
//     });
    
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       success: false,
//       message: `Error occurred when fetching data: ${err.message}`,
//     });
//   }
// };

// const getAskForPrice = async (req, res) => {
//   try {
//     // Extracting query parameters
//     const {
//       day,
//       status,
//       page,
//       limit,
//       method,
//       endDate,
//       startDate,
//       customerName,
//     } = req.query;

//     // Calculate dates
//     let date = new Date();
//     const today = date.toString();
//     date.setDate(date.getDate() - Number(day));
//     const dateTime = date.toString();

//     const beforeToday = new Date();
//     beforeToday.setDate(beforeToday.getDate() - 1);

//     const startDateData = new Date(startDate);
//     startDateData.setDate(startDateData.getDate());
//     const start_date = startDateData.toString();

//     // Creating query object
//     const queryObject = {};

//     if (!status) {
//       queryObject.$or = [
//         { status: { $regex: `Pending`, $options: "i" } },
//         { status: { $regex: `Processing`, $options: "i" } },
//         { status: { $regex: `Delivered`, $options: "i" } },
//         { status: { $regex: `Cancel`, $options: "i" } },
//       ];
//     }

//     if (customerName) {
//       queryObject.$or = [
//         { "personalDetails.firstName": { $regex: `${customerName}`, $options: "i" } },
//       ];
//     }

//     if (day) {
//       queryObject.createdAt = { $gte: dateTime, $lte: today };
//     }

//     if (status) {
//       queryObject.status = { $regex: `${status}`, $options: "i" };
//     }

//     if (startDate && endDate) {
//       queryObject.updatedAt = {
//         $gt: start_date,
//         $lt: endDate,
//       };
//     }

//     // Aggregation pipeline to fetch AskForPrice details with product names
//     const getAskForPriceDetails = await askForPriceSchema.aggregate([
//       { $match: queryObject },
//       { $skip: (page - 1) * limit },
//       { $limit: Number(limit) },
//       {
//         $lookup: {
//           from: "products", // Assuming the name of the product collection is "products"
//           localField: "productId",
//           foreignField: "_id",
//           as: "productDetails"
//         }
//       },      
      
//       {
//         $addFields: {
//           productName: {
//             $cond: {
//               if: { $eq: [{ $size: "$productDetails" }, 0] }, // Check if productDetails array is empty
//               then: "Unknown", // If empty, use "Unknown" as the product name
//               else: { $arrayElemAt: ["$productDetails.title", 0] } // Otherwise, use the product title
//             }
//           }
//         }
//       },{ $unset: "productDetails" }, // Removing redundant field
//          ]);

//     // Calculate pagination
//     const count = await askForPriceSchema.countDocuments(queryObject);
//     const totalPages = Math.ceil(count / limit);
//     const hasNextPage = page < totalPages;
//     const hasPrevPage = page > 1;

//     const pagination = {
//       TotalDocuments: count,
//       limit,
//       TotalPages: totalPages,
//       CurrentPage: page,
//       PrevPage: hasPrevPage ? page - 1 : null,
//       NextPage: hasNextPage ? page + 1 : null,
//       HasPrevPage: hasPrevPage,
//       HasNextPage: hasNextPage,
//       PagingCounter: (page - 1) * limit,
//     };

//     res.status(200).send({
//       success: true,
//       getAskForPriceDetails,
//       pagination,
//       message: "Successfully fetched!",
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       success: false,
//       message: `Error occurred when fetching data: ${err.message}`,
//     });
//   }
// };


const getAskForPrice = async (req, res) => {
  try {
    // Extracting query parameters
    const {
      day,
      status,
      page,
      limit,
      endDate,
      startDate,
      searchQuery,
    } = req.query;

    // Calculate dates
    let date = new Date();
    const today = date.toString();
    date.setDate(date.getDate() - Number(day));
    const dateTime = date.toString();

    const beforeToday = new Date();
    beforeToday.setDate(beforeToday.getDate() - 1);

    const startDateData = new Date(startDate);
    startDateData.setDate(startDateData.getDate());
    const start_date = startDateData.toString();

    // Creating query object
    const queryObject = {};

    if (!status) {
      queryObject.$or = [
        { status: { $regex: `Pending`, $options: "i" } },
        { status: { $regex: `Processing`, $options: "i" } },
        { status: { $regex: `Resolved`, $options: "i" } },
        { status: { $regex: `Cancel`, $options: "i" } },
      ];
    }

    // Adjusted condition for searchQuery filtering
    if (searchQuery) {
      queryObject.$or = [
        { "personalDetails.firstName": { $regex: `${searchQuery}`, $options: "i" } },
        { "title": { $regex: `${searchQuery}`, $options: "i" } }
      ];
    }

    if (day) {
      queryObject.createdAt = { $gte: dateTime, $lte: today };
    }

    if (status) {
      queryObject.status = { $regex: `${status}`, $options: "i" };
    }

    if (startDate && endDate) {
      queryObject.updatedAt = {
        $gt: start_date,
        $lt: endDate,
      };
    }

    // Calculate total count of documents
    const count = await askForPriceSchema.countDocuments(queryObject);
    console.log(count);
    // Aggregation pipeline to fetch AskForPrice details with product names
    const getAskForPriceDetails = await askForPriceSchema.aggregate([
      {
        $lookup: {
          from: "products", // Ensure this matches the MongoDB collection name for products, typically lowercase and plural
          localField: "productId", // This now correctly references the ObjectId field from askForPrice documents
          foreignField: "_id", // This matches the unique identifier field of the Product documents
          as: "productDetails"
        }
      },      
      {
        $project: {
          _id: 1,
          status: 1,
          productId: 1,
          personalDetails: 1,
          shippingDetails: 1,
          message: 1,
          createdAt: 1,
          updatedAt: 1,
          title: {
            $cond: {
              if: { $eq: [{ $size: "$productDetails" }, 0] },
              then: "Unknown",
              else: { $arrayElemAt: ["$productDetails.title", 0] } // Assuming 'title' is what you're looking for
            }
          }
        }
      },
      { $match: queryObject }, { $skip: (page - 1) * limit },
      { $limit: Number(limit) }
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const pagination = {
      TotalDocuments: count,
      limit,
      TotalPages: totalPages,
      CurrentPage: page,
      PrevPage: hasPrevPage ? page - 1 : null,
      NextPage: hasNextPage ? page + 1 : null,
      HasPrevPage: hasPrevPage,
      HasNextPage: hasNextPage,
      PagingCounter: (page - 1) * limit,
    };

    res.status(200).send({
      success: true,
      getAskForPriceDetails,
      pagination,
      message: "Successfully fetched!",
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: `Error occurred when fetching data: ${err.message}`,
    });
  }
};

const getAskForPriceById = async (req, res) => {
  try {
    const getAskForPriceDetails = await askForPriceSchema.findOne({_id:req.query.id}).exec();
    res.status(200).send({
      success:true,
      getAskForPriceDetails,
      message: "Successfully fetch!!",
    });
  } catch (err) {
      console.log(err);
    res.status(500).send({
      success:false,
      message: `Error occur when adding attribute ${err.message}`,
    });
  }
};

const action = async (req, res) => {
    try {
      const askForPrice = await askForPriceSchema.updateOne({_id:req.body.id},{$set: {status: req.body.status}}).exec();
      res.status(200).send({
        success:true,
        message: "Successfully updated!!",
      });
    } catch (err) {
        console.log(err);
      res.status(500).send({
        success:false,
        message: `Error occur when adding attribute ${err.message}`,
      });
    }
};


const notificationn= async  (req, res)=> {
  try{
      var notificationdetails=await notification.findOne({ _id: req.body.id});
      if(notificationdetails.viewrs!=data.email){
          var notification= await notification.updateOne({ _id: req.body.id}, {$push:{viewrs:req.body.email}, viewsOrNot:true});
          return res.send({
              success: true, 
              message: "Sucessfully read notification!!!",
              notification
          });
      }
      else{
          return res.send({
              success: true, 
              message: "Sucessfully read notification!!!",
              notificationdetails
          });
      }
  }
  catch(err){
      return res.send({
          success: false, 
          message: "error!!!", 
          err
      });
}}



module.exports={askForPrice,getAskForPrice,action,getAskForPriceById}