const Joi = require('joi');

const regdetailsverify=async (req,res,next)=>{
    try { 

            const schema = Joi.object({ 
                name:Joi.string().required(),
                email:Joi.string().email().required(),
                password: Joi.string().required(),
                role:Joi.string().required(),
            }) 
            const value = await schema.validateAsync(req.body);
            console.log("regdetailsverify");
            next() 
    } 
    catch (error) {
            
            return res.status(400).send({ 
                code: 3, 
                message: "Bad Request :Invalid Parameters", 
                payload: error }) 
    }
}

const loginverify=async (req,res,next)=>{
    try { 

            const schema = Joi.object({ 
                email:Joi.string().email().required(),
                password: Joi.string().required(),
            }) 
            const value = await schema.validateAsync(req.body);
            console.log("loginverify");
            next() 
    } 
    catch (error) {
            
            return res.status(400).send({ 
                code: 3, 
                message: "Bad Request :Invalid Parameters", 
                payload: error }) 
    }
}

module.exports = {regdetailsverify,loginverify};