const ProductRequest = require("../models/ProductRequest");



const getProductRequest = async (req, res) => {
    try {

            var data=req.query;
            var prevPage;                                        
            var nextPage;
            var hasPrevPage;
            var hasNextPage;

            var limit = data.limit ? Number(data.limit) : 10;
            var page = data.page ? Number(data.page) : 1;
            var searchQuery = req.query.searchQuery ? req.query.searchQuery : "";


            const ProductRequestDetailsdData =await ProductRequest.find({name:searchQuery}).skip((page-1)*limit).limit(Number(limit)).exec();
            

            var countdata=await ProductRequest.find().exec();

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
        ProductRequestDetailsdData,
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

const statusChange = async (req, res) => {
  try {
      const data=req.body;
      var result= await ProductRequest.updateOne({_id:data.id},{status:data.status}).exec();
      res.send({
             status:200,
             success: true, 
             message: "Sucessfully Updated!!!", 
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
    getProductRequest,
    statusChange,
};