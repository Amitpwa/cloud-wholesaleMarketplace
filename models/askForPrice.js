const { string } = require("joi");
const mongoose = require("mongoose");

const askForPriceSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product', // Add this line if you want to explicitly state the reference
      required: true,
    },
    personalDetails:{
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: false,
        },
        emailAddress:{
            type: String,
            required: true,
        },
        phoneNumber:{
            type: Number,
            required: true,
        }
    },
    shippingDetails:{
        streetAddress:{
            type: String,
            required: true,
        },
        state:{
            type: String,
            required: true,
        },
        city:{
            type: String,
            required: true,
        },
        zipCode:{
            type: Number,
            required: true,
        }
    },
    message:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: false,
        enum: ['pending','resolved','cancel','processing'],
        default:"pending"
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = productSchema;

const askForPrice = mongoose.model("askForPrice", askForPriceSchema);
module.exports = askForPrice;
