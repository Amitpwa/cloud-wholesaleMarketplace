const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const enquirySchema = new mongoose.Schema(
  {
    productImage: {
      type: String,
      required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    address: {
      type: String,
      required: false,
    },
    Message: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    zipCode: {
        type: Number,
        required: false,
      },
    status: {
      type: String,
      required: false,
      default: "pending",
      enum: ["pending","resolve","processing","cancel"],
    },
    quantity: {
      type: Number,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("enquiry", enquirySchema);

module.exports = Enquiry;
