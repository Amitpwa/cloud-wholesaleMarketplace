const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    parentId: {
      type: String,
      required: false,
      default: null,  // Set parentId to null if parentId not present,that mean it will be main category,not sub category
    },
    parentName: {
      type: String,
      required: false,
      default: function () {
        return this.name; // Set parentName to name if not present
      },
    },
    id: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      lowercase: true,
      enum: ['show', 'hide'],
      default: 'show',
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = categorySchema;

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
