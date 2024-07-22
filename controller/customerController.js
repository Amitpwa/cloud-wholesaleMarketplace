require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const { signInToken, tokenForVerify } = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const {customerRegisterBody} = require("../lib/email-sender/templates/register");
const {forgetPasswordEmailBody} = require("../lib/email-sender/templates/forget-password");
const unirest = require('unirest');

// const verifyEmailAddress = async (req, res) => {
//   const isAdded = await Customer.findOne({ email: req.body.email });
//   if (isAdded) {
//     return res.status(403).send({
//       message: "This Email already Added!",
//     });
//   } else {
//     const token = tokenForVerify(req.body);
//     const option = {
//       name: req.body.name,
//       email: req.body.email,
//       token: token,
//     };
//     const body = {
//       from: process.env.EMAIL_USER,
//       to: `${req.body.email}`,
//       subject: "Email Activation",
//       subject: "Verify Your Email",
//       html: customerRegisterBody(option),
//     };
//     const message = "Please check your email to verify your account!";
//     let mailSent = await sendEmail(body, res,false);
//     console.log("ggg"+mailSent);
//     if(mailSent){return res.status(200).send({
//       mailSent,
//       message: message,
//     })}
//     else{
//       return res.status(500).send({
//         message: "Error happen when sending mail",
//       })
//     }
    
//   }
// };
const registerCustomer = async (req, res) => {
  const token = req.body.token;
  const { name, email, password } = jwt.decode(token);
  const isAdded = await Customer.findOne({ email: email });
   console.log("password",password);
  if (isAdded) {
    const token = signInToken(isAdded);
    return res.send({
      token,
      _id: isAdded._id,
      name: isAdded.name,
      email: isAdded.email,
      message: "Email Already Verified!",
    });
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Token Expired, Please try again!",
        });
      } else {
        const newUser = new Customer({
          name,
          email,
          password: bcrypt.hashSync(password),
        });
        newUser.save();
        const token = signInToken(newUser);
        res.send({
          token,
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          message: "Email Verified, Please Login Now!",
        });
      }
    });
  }
};

const verifyEmailAddress = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });

  if (isAdded) {
    return res.status(403).send({
      message: "This Email already Added!",
    });
  } else {
    const token = tokenForVerify(req.body);
    const option = {
      name: req.body.name,
      email: req.body.email,
      token: token,
    };
    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.email}`,
      subject: "Verify Your Email",
      html: customerRegisterBody(option),
    };
    const message = "Please check your email to verify your account!";
    const emailSent = await sendEmail(body, null); // No filePath for verification email

    if (emailSent) {
      return res.status(200).send({
        mailSent: emailSent,
        message: message,
      });
    } else {
      return res.status(500).send({
        message: "Error happened when sending mail",
      });
    }
  }
};


// Endpoint to register or verify a customer by mobile number
const registerCustomerByMobileOtp = async (req, res) => {
  const { name, email, phoneNumber, otp } = req.body;
  try {
    // Check if the mobile number is already registered
    const existingCustomer = await Customer.findOne({ phone: phoneNumber });
    console.log(0);
    if (existingCustomer) {
      console.log(1);
      // If OTP is provided, verify it
      if (otp) {
        // Check if the provided OTP is valid
        console.log(11);
        if (existingCustomer.otp && existingCustomer.otp == otp) {
          console.log(19);
          // Generate JWT token and send it as a response
          const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ success: true, message: 'OTP verification successful', token });
        } else {
          console.log(18);
          res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
      } else {
        console.log(12);
        // If OTP is not provided, it's an attempt to re-register, return an error
        res.status(400).json({ success: false, message: 'Customer already registered' });
      }
    } else {
      console.log(2);
      // If the mobile number is not registered and OTP is provided, handle it accordingly
      if (otp) {
        console.log(21);
        res.status(400).json({ success: false, message: 'Invalid mobile number' });
      } else {
        console.log(22);
        console.log(req.body);
        // If the mobile number is not registered and OTP is not provided, create a new user entry
        const newOtp = generateOTP();
        const newCustomer = new Customer({
          name,
          email,
          phone: phoneNumber,
          otp: newOtp,
        });
        await newCustomer.save();

        // Define Fast2SMS API URL and Authorization
       
        // Create a Fast2SMS request
        const fast2smsReq = unirest.post(process.env.url);
        fast2smsReq.headers({
          'authorization': process.env.authorization,
          'Content-Type': 'application/x-www-form-urlencoded',
        });

        // Set form data for the SMS
        fast2smsReq.form({
          'variables_values': newOtp,
          'route': 'otp',
          'numbers': phoneNumber,
        });
        // Send the request to Fast2SMS API
        fast2smsReq.end(function (fast2smsRes) {
          if (fast2smsRes.error) {
            console.error(fast2smsRes.error);
            res.status(500).json({ success: false, message: 'Failed to send SMS via Fast2SMS', error: fast2smsRes });
          } else {
            console.log(fast2smsRes.body);
            res.json({ success: true, message: 'SMS sent successfully!', response: fast2smsRes.body });
          }
        });        
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error, message: 'Internal server error' });
  }
};

const addAllCustomers = async (req, res) => {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const loginCustomer = async (req, res) => {
//   try {
//     const customer = await Customer.findOne({ email: req.body.registerEmail });
//     if (
//       customer &&
//       customer.password &&
//       bcrypt.compareSync(req.body.password, customer.password)
//     ) {
//       const token = signInToken(customer);
//       res.send({
//         token,
//         _id: customer._id,
//         name: customer.name,
//         email: customer.email,
//         address: customer.address,
//         phone: customer.phone,
//         image: customer.image,
//       });
//     } else {
//       res.status(401).send({
//         message: "Invalid user or password!",
//       });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };
const sendOTPviaSMS = async (phoneNumber) => {
  const otp = generateOTP(); // Replace this with your OTP generation logic

  // Save the OTP in the database along with the phone number
  await saveOTPinDB(phoneNumber, otp);

  // Create a request to Fast2SMS API
  const fast2smsReq = unirest.post(process.env.FAST2SMS_URL)
    .headers({
      'authorization': process.env.FAST2SMS_AUTHORIZATION,
    })
    .form({
      'variables_values': otp,
      'route': 'otp',
      'numbers': phoneNumber,
    });

  // Send the request to Fast2SMS API
  return new Promise((resolve, reject) => {
    fast2smsReq.end(function (fast2smsRes) {
      if (fast2smsRes.error) {
        console.error(fast2smsRes.error);
        reject({
          otpSent: false,
          error: fast2smsRes.error,
        });
      } else {
        resolve({
          otpSent: true,
          otp: otp,
        });
      }
    });
  });
};
const saveOTPinDB = async (phoneNumber, otp) => {
  try {
    // Find the user by phone number
    const user = await Customer.findOne({ phone: phoneNumber });

    if (user) {
      // Save the OTP in your database (replace this with your actual database saving logic)
      // Example using Mongoose:
      user.otp = otp;
      await user.save();
    } else {
      // Handle the case where the user is not found
      console.error("User not found for phone number: " + phoneNumber);
    }
  } catch (error) {
    // Handle database error
    console.error("Error saving OTP in the database: " + error.message);
    throw error;
  }
};
const verifyOTP = async (phoneNumber, enteredOTP) => {
  // Retrieve the stored OTP from the database based on the phone number
  const storedOtpRecord = await Customer.findOne({ phoneNumber: phoneNumber });

  if (storedOtpRecord) {
    const storedOtp = storedOtpRecord.otp;
    // Compare the entered OTP with the stored OTP
    return enteredOTP === storedOtp;
  }

  return false; // No stored OTP record found
};
const generateOTP = () => {
  // Replace this with your OTP generation logic (e.g., a random 6-digit number)
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const loginCustomer = async (req, res) => {
  try {
    console.log(1);
    const { loginType, loginIdentifier, otp } = req.body;
    const email=loginIdentifier;
    if (loginType === 'email') {
      // Email login
      const customer = await Customer.findOne({ email: email });

      if (!customer) {
        return res.status(404).send({
          message: "Customer not found!",
        });
      }

      // Check password if provided
      const password  = req.body.password;

      if (password && bcrypt.compareSync(password, customer.password)){
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.send({
          token,
          _id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          image: customer.image,
        });
      } else {
        return res.status(401).send({
          message: "Invalid password!",
        });
      }
    } else if (loginType === 'phone') {
      if (otp) {
        const phone=loginIdentifier;
        // Phone number OTP verification
        const isOtpValid = await verifyOTP(phone, otp);
        if (isOtpValid) {
          // Continue with the login logic (unchanged)
          const customer = await Customer.findOne({ phone: phone });

          if (customer) {
            const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.send({
              token,
              _id: customer._id,
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
            });
          } else {
            return res.status(404).send({
              message: "Customer not found!",
            });
          }
        } else {
          return res.status(401).send({
            message: "Invalid OTP!",
          });
        }
      } else {
        // Phone number OTP generation
        const otpResult = await sendOTPviaSMS(loginIdentifier);
        if (otpResult.otpSent) {
          // OTP sent successfully, optionally return the OTP for testing purposes
          return res.send({
            message: "OTP sent successfully!",
            otp: otpResult.otp,
          });
        } else {
          // OTP sending failed
          return res.status(500).send({
            message: "Failed to send OTP.",
            error: otpResult.error,
          });
        }
      }
    } else {
      return res.status(400).send({
        message: "Invalid login type!",
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const option = {
      name: isAdded.name,
      email: isAdded.email,
      token: token,
    };

    const body = {
      from: process.env.EMAIL_USER,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: forgetPasswordEmailBody(option),
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const customer = await Customer.findOne({ email: email });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_FOR_VERIFY, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        customer.password = bcrypt.hashSync(req.body.newPassword);
        customer.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer.password) {
      return res.send({
        message:
          "For change password,You need to sign in with email & password!",
      });
    } else if (
      customer &&
      bcrypt.compareSync(req.body.currentPassword, customer.password)
    ) {
      customer.password = bcrypt.hashSync(req.body.newPassword);
      await customer.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithProvider = async (req, res) => {
  try {
    // const { user } = jwt.decode(req.body.params);
    const user = jwt.decode(req.params.token);

    // console.log("user", user);
    const isAdded = await Customer.findOne({ email: user.email });
    if (isAdded) {
      const token = signInToken(isAdded);
      res.send({
        token,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        address: isAdded.address,
        phone: isAdded.phone,
        image: isAdded.image,
      });
    } else {
      const newUser = new Customer({
        name: user.name,
        email: user.email,
        image: user.picture,
      });

      const signUpCustomer = await newUser.save();
      const token = signInToken(signUpCustomer);
      res.send({
        token,
        _id: signUpCustomer._id,
        name: signUpCustomer.name,
        email: signUpCustomer.email,
        image: signUpCustomer.image,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const data = req.query;
    const limit = data.limit ? Number(data.limit) : 2;
    const page = data.page ? Number(data.page) : 1;
    // const searchQuery = data.searchQuery || "";
    // const stuffRole = data.stuffRole || "";

    // let query = {};

    // if (searchQuery) {
    //   query={'$match':
    //     {$or: [{'name': searchQuery},
    //             {'email': searchQuery}]
    //     }}
    // }
    // console.log(query);
    // if (stuffRole) {
    //   query["stuffRole"] = stuffRole;
    // }

    const users = await Customer.find()
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const allData = await Customer.find().exec();

    const count = allData.length;
    const totallength = Math.ceil(count / limit);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totallength ? page + 1 : null;
    const hasPrevPage = page > 1;
    const hasNextPage = page < totallength;

    const pagination = {
      TotalDocuments: count,
      limit,
      TotalPages: totallength,
      CurrentPage: page,
      PrevPage: prevPage,
      NextPage: nextPage,
      HasPrevPage: hasPrevPage,
      HasNextPage: hasNextPage,
      PagingCounter: page,
    };

    res.send({
      status: true,
      message: "Successfully fetch!!",
      users,
      Pagination: pagination,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.name = req.body.name;
      customer.email = req.body.email;
      customer.address = req.body.address;
      customer.phone = req.body.phone;
      customer.image = req.body.image;
      const updatedUser = await customer.save();
      const token = signInToken(updatedUser);
      res.send({
        token,
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        image: updatedUser.image,
      });
    }
  } catch (err) {
    res.status(404).send({
      message: "Your email is not valid!",
    });
  }
};

const deleteCustomer = (req, res) => {
  Customer.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "User Deleted Successfully!",
      });
    }
  });
};

module.exports = {
  loginCustomer,
  registerCustomer,
  registerCustomerByMobileOtp,
  addAllCustomers,
  signUpWithProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};