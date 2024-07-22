const Joi = require('joi');

const couponValidation = async (req, res, next) => {
  try {
    const couponValidate = Joi.object({
      title: Joi.string().required(),
      logo: Joi.string(),
      couponCode: Joi.string().required(),
      startTime: Joi.date(),
      endTime: Joi.date().required(),
      discountType: Joi.object(),
      minimumAmount: Joi.number().required(),
      productType: Joi.string(),
      status: Joi.string().valid('show', 'hide').default('show'),
    });
    const value = await couponValidate.validateAsync(req.body);
    console.log("couponValidation");
    next();
  } catch (error) {
    return res.status(400).send({
      code: 3,
      message: "Bad Request: Invalid Parameters",
      payload: error,
    });
  }
};

module.exports = couponValidation;
