const mongoose = require("mongoose");

const promotion = new mongoose.Schema(
  [{
    image: {
      type: String,
      required: true,
    },
    heading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ctaText: {
        type: String,
        required: true,
    },
    ctaLink: {
        type: String,
        required: true,
    }
  }],
  {
    timestamps: true,
  }
);


const Promotion = mongoose.model("promotion", promotion);
module.exports = Promotion;