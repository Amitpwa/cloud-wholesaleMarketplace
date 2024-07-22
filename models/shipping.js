const mongoose = require("mongoose");

const shipping = new mongoose.Schema(
  {
    shippingMethod: {
      type: String,
      required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    deliveryTime: {
        type: String,
        required: false,
    }
  },
  {
    timestamps: true,
  }
);


const Shipping = mongoose.model("shipping", shipping);
module.exports = Shipping;