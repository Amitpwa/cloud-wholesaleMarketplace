
const Notification = require('../models/notification'); // Import the notification schema

// Function to create and store a new notification
const sendNotification = async (toUserIds, notificationSubject, notificationBody) => {
  try {
    // Create a new notification instance
    const newNotification = new Notification({
      touser: toUserIds,
      notification: {
        notification_subject: notificationSubject,
        notification_body: notificationBody
      },
      
    });

    // Save the new notification to the database
    await newNotification.save();

    // Return the saved notification
    return newNotification;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error sending notification: ${error.message}`);
  }
};

module.exports = sendNotification;
