const { boolean } = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: false,
    },
    sku: {
      type: String,
      required: false,
    },
    HsnSacNumber: {
      type: Number,
      required: false,
    },
    askForPrice: {
      type: Boolean,
      required: false,
    },
    fewLeft: {
      type: Boolean,
      required: false,
    },
    barcode: {
      type: String,
      required: false,
      default:null,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default:''
    },
    slug: {
      type: String,
      required: false,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    image: [{
      medialink: {
        type: String,
        required: true
      },
      isDefault: {
        type: Boolean,
        required: true
      }
    }],
    stock: {
      type: Number,
      required: false,
      default:null
    },
    tax: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tax",
      required: false,
    }],
    warrantyPeriods: {
        duration: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          enum: ['months', 'years', 'days'],
          required: true,
         },
    },
    minimumOrderOfQuantity: {
      type: Number,
      required: true,
    },
    moqSlab: [{
      name: String,
      minQuantity:Number,
      maxQuantity:Number,
      moqSalePrice:Number,
      typeOfDiscount:{
        type:String,
        default:"Quantity wise"
      },
    }],
    sales: {
      type: Number,
      required: false,
    },
    tag: [String],
    prices: {
      price: {
        type: Number,
        required: false,
      },
      salePrice: {
        type: Number,
        required: false,
      },
      discount: {
        type: Number,
        required: false,
      },
    },
    variants: [{}],
    isCombination: {
      type: Boolean,
      required: false,
    },
    status: {
      type: String,
      default: "show",
      enum: ["show", "hide"],
    },
    userManual: 
      [{
        medialink: {
          type: String,
          required: false,
        }
      }],
    technicalSpecification: [
      {
        medialink: {
          type: String,
          required: false,
        }
      }],
    
    productSpecification:{
      productType:{
        type:String,
        required:false,
        default:null
      },
      productLine:{
        type:String,
        required:false,
        default:null
      },
      brand:{
        type:String,
        required:false,
        default:null
      },
      uom:{
        type:String,
        required:false,
        default:null
      },
      originCountry:{
        type:String,
        required:false,
        default:null
      },
      importerName:{
        type:String,
        required:false,
        default:null
      },
      importerAddress:{
        type:String,
        required:false,
        default:null
      },
      returnPolicy:{
        isReturnable:{
          type:Boolean,
          default:false,
          required:false
        },
        returnDays:{
          type:Number,
          default:null,
          required:false
        }
      }
    },
    dataSheet: 
      [{
        medialink: {
          type: String,
          required: false,
        }
      }]
  },
  {
    timestamps: true,
  }
);

// module.exports = productSchema;

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
