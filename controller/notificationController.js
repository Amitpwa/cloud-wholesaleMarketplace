const mongoose = require('mongoose');
const notification = require("../models/notification.js");

const getAllNotification = async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.query);
      const notificationDetails = await notification.find({ touser: { $in:mongoose.Types.ObjectId(req.query.userId)}}).exec();
      res.status(200).send({
        success:true,
        message:"Sucessfully fetch!",
        notificationDetails,
      })
    } catch (err) {
        console.log(err),
        res.status(500).send({
         message: err.message,
        });
    }
};

const getNotificationById = async (req, res) => {
  try {
    const notificationId = req.query.notificationId;
    const userId = req.query.userId;

    // Fetch notification details
    const notificationDetails = await notification.findOne({ _id: mongoose.Types.ObjectId(notificationId) }).exec();
    console.log(notificationDetails);
    if (!notificationDetails) {
      return res.status(404).send({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if the userId already exists in the viewers array
    if (!notificationDetails.viewers.includes(userId)) {
      // If not present, push userId to viewers array
      notificationDetails.viewers.push(userId);
    }

    // Set viewsOrNot to true
    notificationDetails.viewsOrNot = true;

    // Save the updated notification
    await notificationDetails.save();

    res.status(200).send({
      success: true,
      message: "Successfully viewed!",
      notificationDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }
};


module.exports = {
  getAllNotification,
  getNotificationById
};
