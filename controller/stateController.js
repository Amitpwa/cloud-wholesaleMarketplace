const state = require("../models/state");



const getState= async (req, res) => {
    try {

      const stateDetails =await state.find().exec();
      res.status(200).send({
        success:true,
        message:"Sucessfully fetch!",
        stateDetails
      })
    } catch (err) {
        console.log(err),
        res.status(500).send({
         success:false,
         message: err.message,
        });
    }
};




module.exports = {
    getState
};