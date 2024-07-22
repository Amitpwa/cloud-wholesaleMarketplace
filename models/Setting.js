const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false,
      default:"globalSetting"
    },
    numberOfImagePerProduct: {
      type: Number,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postCode: {
      type: Number,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    receiptSize: {
      type: String,
      required: true,
    },
    defaultCurrency: {
      type: String,
      required: true,
    },
    defaultTimeZone: {
      type: String,
      required: true,
    },
    defaultDateFormat: {
      type: String,
      required: true,
    },
    socialMedia: [{
      name: {
        type: String,
        required: false,
      },
      medialink: {
        type: String,
        required: false,
      },
    
    }]
  },
  {
    timestamps: true,
  }
);

// module.exports = settingSchema;

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
