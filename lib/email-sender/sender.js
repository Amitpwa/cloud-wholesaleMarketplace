require("dotenv").config();
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const fs = require('fs');
const path = require('path');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

// const sendEmail =async (body, res,filePath) => {
  
//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     service: process.env.SERVICE, //comment this line if you use custom server/domain
//     port: process.env.EMAIL_PORT,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },

//     //comment out this one if you usi custom server/domain
//     // tls: {
//     //   rejectUnauthorized: false,
//     // },
//   });

//   transporter.verify(function (err, sucess) {
//     if (err) {
//       res.status(403).send({
//         message: `Error happen when verify ${err.message}`,
//       });
//       console.log(err.message);
//     } else {
//       console.log(sucess);
//       console.log("Server is ready to take our messages");
//     }
//   });

//   transporter.sendMail(body,async (err, data) => {
//     if (err) {
//       console.log(err);
//       return false;
//     } else {
//       if(filePath){
//         await unlinkAsync(filePath);
//       }
//       return true;
//     }
//   });
// };
//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});



// const sendEmail = async (body, res, filePath) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.HOST,
//       service: process.env.SERVICE, // comment this line if you use custom server/domain
//       port: process.env.EMAIL_PORT,
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       // comment out this one if you use custom server/domain
//       // tls: {
//       //   rejectUnauthorized: false,
//       // },
//     });
// console.log(filePath);
//     // Verify the transporter
//     await transporter.verify();

//     // Send the email
//     // const info = await transporter.sendMail(body);
//     transporter.sendMail(body,async (err, data) => {
//           if (err) {
//             console.log(err);
//             return false;
//           } else {
//             if(filePath){
//               await unlinkAsync(toString(filePath));
//             }
//             return true;
//           }
//     });

//     // Remove file if filePath is provided
//     // if (filePath) {
//     //   await unlinkAsync(filePath);
//     // }

//    // return true;
//   } catch (err) {
//     console.error(`Error: ${err.message}`);
//     res.status(500).send({
//       message: `Failed to send email: ${err.message}`,
//     });
//     return false;
//   }
// };




const sendEmail = async (body, filePath) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE, // comment this line if you use custom server/domain
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // comment out this one if you use custom server/domain
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    console.log(filePath); // Log the file path for debugging

    // Verify the transporter
    await transporter.verify();

    // Send the email
    var a=await transporter.sendMail(body);
console.log(a);
    // Remove file if filePath is provided
    if (filePath) {
      await unlinkAsync(filePath);
    }

    return true;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return false;
  }
};


const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

module.exports = {
  sendEmail,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
};
