const Shipping = require("../models/shipping");



const getShippingMethod = async (req, res) => {
    try {

            var data=req.query;

            var prevPage;                                        
            var nextPage;
            var hasPrevPage;
            var hasNextPage;

            var limit = data.limit ? Number(data.limit) : 10;
            var page = data.page ? Number(data.page) : 1;

            const shippingDetailsdData =await Shipping.find().skip((page-1)*limit).limit(Number(limit)).exec();
            

            var countdata=await Shipping.find().exec();

            var count=countdata.length;

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
            else{
                    prevPage=Number(page)-1;
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
              "PagingCounter":page,        // consider index starting from 1,so pagingcounter will be same like index number //
            }

      
      res.status(200).send({
        success:true,
        message:"Sucessfully fetch!",
        shippingDetailsdData,
        Pagination
      })
    } catch (err) {
        console.log(err),
        res.status(500).send({
         success:false,
         message: err.message,
        });
    }
};

const getShippingMethodById = async (req, res) => {
    try {
      const data=req.query;
      const shippingDetailsdData = await Shipping.findOne({_id:data.id});
      if(shippingDetailsdData!=null){
        res.status(200).send({
            success:true,
            message:"Sucessfully fetch!",
            shippingDetailsdData
        })
      }
      else{
        res.send({
          status:400,
          success:false,
          message:"please sent a valid shipping method id.",
        })

      }
    } catch (err) {
        console.log(err),
        res.status(500).send({
         message: err.message,
        });
    }
};

const addShippingMethod = async (req, res) => {
    try {
        const data=req.body;
        if(data.id){
           var result= await Shipping.updateOne({ _id:data.id},{...data}).exec();
            res.send({
               success: true, 
               message: "Shipping method sucessfully updated!!!", 
               result
             });
        }
        else{
            if(data.id==''){
            delete data.id};
            const shipping = new Shipping({...data });
            var result=shipping.save()
            res.send({
                 status:200,
                 success: true, 
                 message: "New shipping method Added!!", 
             });   
        }
    } catch (err) {
      console.log(err);
      res.send({
        sucess:false,
        message: err.message,
      });
    }
};

const deleteShippingMethod = async (req, res) => {
  try {
      const data=req.params;
     
        var result= await Shipping.deleteOne({_id:data.id}).exec();
        console.log(result);
        res.send({
             status:200,
             success: true, 
             message: "Shipping method sucessfully deleted!!!", 
           });
      
      
  } catch (err) {
    console.log(err);
    res.send({
      sucess:false,
      message: err.message,
    });
  }
};



module.exports = {
    getShippingMethod,
    addShippingMethod,
    getShippingMethodById,
    deleteShippingMethod
};