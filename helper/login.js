const jwt = require("jsonwebtoken");
const adminSchema = require('../models/Admin');
const Customer = require('../models/Customer');

const config = require("../config/auth.js");
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;
console.log(secretKey);
const checkLogin = async (req, res, next) => {
    try {
        
        const token = req.headers.authtoken ;
        const decoded = jwt.verify(token, secretKey);
        const user= await adminSchema.findOne({email:decoded.email});
        console.log(user);
        console.log(decoded);
        if(user){
            req.query.userId=decoded._id;
            req.query.name=decoded.name;
            req.body.email=decoded.email;
            req.query.email=decoded.email;
            console.log("checkLogin");
            next();
        }
        else{
            
            return(res.send("Session timeOut.Please login!!"));
        }  
    } catch(err) {
        console.log(err);
        res.send(err);
    }
};
const checkLoginForUser = async (req, res, next) => {
    try {
      const token = req.headers.authtoken;
      const decoded = jwt.verify(token, secretKey);
      console.log(decoded);
      const user = await Customer.findOne({ email: decoded.email });
      console.log(user);
      if (user) {
        req.query.userId = user._id.toString();
        req.query.name = user.name;
        req.body.email = decoded.email;
        req.body.userId = user._id.toString();
        req.query.email = decoded.email;
        next();
      } else {
        return res.send("Session timeOut. Please login!");
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  };

const loginornot = async (req, res, next) => {
    
    try {
            
            if(req.headers.authtoken){
                const token = req.headers.authtoken ;
                const decoded = jwt.verify(token, secretKey);
                const user= await adminSchema.findOne({email:decoded.email}) || await Customer.findOne({email:decoded.email});
                if(user){
                    req.query.userId=user._id;
                    req.query.name=user.name;
                    req.body.email=decoded.email;
                    req.query.email=decoded.email;
          
                    next();
                 }
                 else{
                    res.send({
                        success: false,
                        statuscode: 500,
                        message: "authtoken expired or user not found!!!",
                    });
                 }
            }
            else{
                next();
            }
        }catch(err) {
            res.send(err);
        }
};

const isAdmin = async (req, res, next) => {
    console.log("isadmin");
    try {
        const token = req.headers.authtoken ;
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded);
        const user= await adminSchema.findOne({email:decoded.email});
        console.log(user);
        if(user.role=="Admin"){
              next();
        }
        else{
            res.send("You are not authorized!!!!!");
        }
        
    } catch(err) {
        res.send(err);
    }
};



module.exports = {checkLogin,isAdmin,loginornot,checkLoginForUser};