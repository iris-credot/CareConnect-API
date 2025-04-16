// controllers/notificationController.js
const Notification = require('../Models/Notification');


/**
 * Sends a notification to a user
 * @param {Object} param0
 * @param {mongoose.Types.ObjectId} param0.user - The user ID to notify
 * @param {String} param0.message - Notification content
 * @param {'appointment'|'report'|'chat'|'reminder'} param0.type - Notification type
 * @param {Boolean} [param0.seen=false] - Whether the notification has been seen
 */
const sendNotification = async ({ user, message, type, seen = false }) => {
  try {
    const notification = new Notification({
      user,
      message,
      type,
      seen,
    });

    await notification.save();
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
};

module.exports = sendNotification;
