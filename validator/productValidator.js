const Joi = require('joi');

const productValidation=async (req,res,next)=>{
    try { 
      const productValidation = Joi.object({
        productId: Joi.string(),
        sku: Joi.string(),
        barcode: Joi.string().default(null),
        title: Joi.string().required(),
        askForPrice: Joi.boolean().optional(),
        fewLeft: Joi.boolean().optional(),
        HsnSacNumber: Joi.number().optional(),
        description: Joi.string().required(),
        slug: Joi.string(),
        categories: Joi.array().items(Joi.string()).allow(null), // Array of strings or null
        category: Joi.string().allow(null).required(), // String or null, 
        image: Joi.array().items(
          Joi.object({
            medialink: Joi.string().required(),
            isDefault: Joi.boolean().required(),
          })
        ).required(),
        stock: Joi.number().allow(null),
        tax: Joi.array().items(Joi.string()).allow(null),
        warrantyPeriods: Joi.object({
          duration: Joi.number().required(),
          unit: Joi.string().valid('months', 'years', 'days').required(),
        }).required(),
        minimumOrderOfQuantity: Joi.number().required(),
        moqSlab: Joi.array().items(
          Joi.object({
            name: Joi.string(),
            minQuantity: Joi.number(),
            maxQuantity: Joi.number(),
            moqSalePrice: Joi.number(),
            typeOfDiscount: Joi.string().default('Quantity wise'),
          })
        ),
        sales: Joi.number(),
        tag: Joi.array().items(Joi.string()),
        prices: Joi.when('askForPrice', {
          is: true,
          then: Joi.object({
            price: Joi.string().allow(''),
            salePrice: Joi.string().allow(''),
            discount: Joi.string().allow('')
          }).allow(null),
          otherwise: Joi.object({
            price: Joi.number().required(),
            salePrice: Joi.number().required(),
            discount: Joi.number().required(),
          }).required()
        }),
        variants: Joi.array(),
        isCombination: Joi.boolean().required(),
        status: Joi.string().valid('show', 'hide').default('show'),
        userManual: Joi.array().max(1).items(
          Joi.object({
            medialink: Joi.string().required(),
          })
        ),
        technicalSpecification: Joi.array().max(1).items(
          Joi.object({
            medialink: Joi.string().required(),
          })
        ),
        productSpecification: Joi.object({
          productType: Joi.string().optional(),
          productLine: Joi.string().optional(),
          brand: Joi.string().optional(),
          uom: Joi.string().optional(),
          originCountry: Joi.string().optional(),
          importerName: Joi.string().optional(),
          importerAddress: Joi.string().optional(),
          returnPolicy: Joi.object({
            isReturnable: Joi.boolean().optional(),
            returnDays: Joi.number().optional(),
          }).optional(),
        }),
        dataSheet: Joi.array().items(
          Joi.object({
            medialink: Joi.string().required(),
          })
        ),
        email: Joi.string().email(), // Include email field in the schema
      }).unknown(false);
            
            const value = await productValidation.validateAsync(req.body);
            console.log("joivalidation")
            next() 
    } 
    catch (error) {
            if (error.details && error.details.length > 0) {
              const errorMessages = error.details.map(detail => detail.message);
              return res.status(400).send({
                success: false,
                messages: errorMessages,
              });
            }
            return res.status(400).send({
              success: false,
              messages: "Invalid Entry",
            });
    }
}


module.exports = productValidation;