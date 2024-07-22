const mongoose = require("mongoose");

const productRequest = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    purchageQuantity: {
      type: Number,
      required: true,
    },
    details: {
        file: {
            type: String,
            required: true,
        },
        requestedBy: {
            name: {
                type: String,
                required: true,
            },
            userId: {
                type: Object,
                required: true,
            },
        },
        message: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: Number,
            required: true,
        },
    },
   
    status: {
        type: Boolean,
        required: true,
        enum: ['pending','resolved','cancel','processing'],
        default: 'pending',
      },
  },
  {
    timestamps: true,
  }
);

// module.exports = productSchema;

const ProductRequest = mongoose.model("productRequest", productRequest);
module.exports = ProductRequest;
