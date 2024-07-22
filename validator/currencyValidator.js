const Joi = require('joi');

const currencyValidation = async (req, res, next) => {
  try {
    const currencyValidate = Joi.object({
      name: Joi.string().required(),
      symbol: Joi.string(),
      // iso_code: Joi.string().required(),
      // exchange_rate: Joi.string(),
      status: Joi.string().valid('show', 'hide').default('show'),
      live_exchange_rates: Joi.string().valid('show', 'hide').default('show'),
    });
    const value = await currencyValidate.validateAsync(req.body);
    console.log("currencyValidation");
    next();
  } catch (error) {
    return res.status(400).send({
      code: 3,
      message: "Bad Request: Invalid Parameters",
      payload: error,
    });
  }
};

module.exports = currencyValidation;
