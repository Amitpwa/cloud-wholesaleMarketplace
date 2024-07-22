const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
        type: String,
        required: false,
      },
    message: {
        type: String,
        required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ['pending','resolved','cancel','processing'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);


const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
