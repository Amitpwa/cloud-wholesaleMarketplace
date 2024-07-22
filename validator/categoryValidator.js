const Joi = require('joi');

const categoryValidation = async (req, res, next) => {
  try {
    const categoryValidate = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      slug: Joi.string(),
      parentId: Joi.string(),
      parentName: Joi.string(),
      id: Joi.string(),
      icon: Joi.string(),
      status: Joi.string().valid('show', 'hide').default('show'),
    });
    const value = await categoryValidate.validateAsync(req.body);
    console.log("categoryValidation");
    next();
  } catch (error) {
    return res.status(400).send({
      code: 3,
      message: "Bad Request: Invalid Parameters",
      payload: error,
    });
  }
};

module.exports = categoryValidation;
