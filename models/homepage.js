const mongoose = require("mongoose");

const homepage = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// module.exports = productSchema;

const Homepage = mongoose.model("Homepage", homepage);
module.exports = Homepage;