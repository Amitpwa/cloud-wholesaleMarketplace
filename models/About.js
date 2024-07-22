const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: true,
    },
    bannerTitle: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    productImage: [{
      type: String,
      required: true,
    }],
    socialInteraction: [{
      counting: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    }],
    briefDescription: {
      type: String,
      required: true,
    },
    centerImage: {
      type: String,
      required: true,
    },
    ourTeam: {
      teamDescription: {
        type: String,
        required: true,
      },
      members: [{
        mediaLink: {
          type: String,
        },
        name: {
          type: String,
        },
        position: {
          type: String,
        },
      }],
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model("About", aboutSchema);

module.exports = About;
