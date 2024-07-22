const mongoose = require("mongoose");

const brandCatalogSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    brandLogo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    brandFile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = productSchema;

const BandCatalog = mongoose.model("brandCatalog", brandCatalogSchema);
module.exports = BandCatalog;
