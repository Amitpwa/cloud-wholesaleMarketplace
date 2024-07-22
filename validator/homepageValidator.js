const Joi = require('joi');




const homepageValidation=async (req,res,next)=>{
  try { 
          console.log(req.body);
          const homepageValidate = Joi.object({
            image: Joi.string().required(),
            heading: Joi.string().required(),
            description: Joi.string().required(),
            ctaText: Joi.string().required(),
            ctaLink: Joi.string().required(),
            email: Joi.string(),
            id: Joi.string(),
          });
          const value = await homepageValidate.validateAsync(req.body);
          console.log("homepageValidation");
          next() 
  } 
  catch (error) {
          
          return res.status(400).send({ 
              code: 3, 
              message: "Bad Request :Invalid Parameters", 
              payload: error }) 
  }
}

module.exports = homepageValidation;
