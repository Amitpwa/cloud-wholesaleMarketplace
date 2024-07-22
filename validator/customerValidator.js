const Joi = require('joi');

const customerValidation = async (req, res, next) => {
  try {
    const customerValidate = Joi.object({
      name: Joi.string().required(),
      image: Joi.string(),
      address: Joi.string(),
      country: Joi.string(),
      city: Joi.string(),
      email: Joi.string().email().required(),
      phone: Joi.string(),
      password: Joi.string(),
    });
    const value = await customerValidate.validateAsync(req.body);
    console.log("customerValidation");
    next();
  } catch (error) {
    return res.status(400).send({
      code: 3,
      message: "Bad Request: Invalid Parameters",
      payload: error,
    });
  }
};

module.exports = customerValidation;
