const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invoiceDetails:{
      invoiceNumber: {
        type: Number,
        required: false,
      },
      invoiceDocs: {
        type: String,
        required: false,
      }
    },
    cart: [{}],
   user_info: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
      gstnumber: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Delivered', 'Cancel'],
    },
  },
  {
    timestamps: true,
  }
);

const Order =mongoose.model(
    'Order',
    orderSchema.plugin(AutoIncrement, {
      inc_field: 'invoiceDetails.invoiceNumber',
      start_seq: 10000000000,
    })
  );
module.exports = Order;
