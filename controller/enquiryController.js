const enquirySchema = require("../models/enquiry");

const enquiry = async (req, res) => {
  try {
    const enquiryDetails = new enquirySchema(req.body);
    await enquiryDetails.save();
    res.status(200).send({
      success:true,
      message: "enquiry Submited Successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success:false,
      message: `Error occur when adding attribute ${err.message}`,
    });
  }
};

const getenquiry = async (req, res) => {
    try {
      const data=req.query;
      var limit = data.limit ? Number(data.limit) : 2;
      var page = data.page ? Number(data.page) : 1;
      var customerName = data.customerName || "";
      var status = data.status || "";
      
      let query = {};

      if (customerName) {
        query.$or =[ 
         { "name": { $regex: `${customerName}`, $options: "i" }} ];
      }
      if (status) {
        query["status"] = status;
      }

      const enquiryDetails = await enquirySchema.find(query).skip((page - 1) * limit).limit(limit).exec();
      const allData = await enquirySchema.find(query).exec();

      var count=allData.length;
      var totallength=Math.ceil(count/limit);

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
        "TotalDocuments":count,
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
        enquiryDetails,
        Pagination
      });
    } catch (err) {
        console.log(err);
        res.status(500).send({
          success:false,
          message: `Error occur when adding attribute ${err.message}`,
        });
    }
};

const search = async (req, res) => {
  try {
  const data=req.query;
  var limit = data.limit ? Number(data.limit) : 2;
  var page = data.page ? Number(data.page) : 1;
  var name = data.name || "";
  var status = data.status || "";
  var startDate = data.startDate || "";
  var endDate = data.endDate || "";
  var stuffRole = data.stuffRole || "";
  var orderlimit = data.orderlimit || "";
  
  let query = {};

  if (name) {
    query["user_info.name"] = { $regex: new RegExp(name, "i") };
  }

  if (status) {
    query["status"] = status;
  }

  if (orderlimit) {
    query["subTotal"] = { $gte: orderlimit };
  }

  if (startDate) {
    query["createdAt"] = { $gte: new Date(startDate) };
  }

  if (endDate) {
    query["createdAt"] = { ...query["createdAt"], $lte: new Date(endDate) };
  }

  if (stuffRole) {
    query["user_info.stuffRole"] = stuffRole;
  }

      const filteredOrders = await enquirySchema.find(query).skip((page - 1) * limit).limit(limit).exec();

      var count=filteredOrders.length;
      var totallength=Math.ceil(count/limit);

      if(totallength==1 && page==totallength ){
          prevPage=null;
          hasPrevPage=false;
          nextPage=null;
          hasNextPage=false; 
      }
      else if(page==1 && totallength>page) {
                  prevPage=null;
                  hasPrevPage=false;``
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
        "TotalDocuments":count,
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
        status:true,
        message:"Order fetch Sucessfully!!",
        filteredOrders,
        Pagination
      });

  } 
  catch (err) {
    res.status(500).send({
      message: err.message,
    });
  };
}

const action = async (req, res) => {
  try {
    const enquiryDetails = await enquirySchema.updateOne({_id:req.body.id},{$set: {status: req.body.status}}).exec();
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


module.exports={enquiry,getenquiry,action,search}