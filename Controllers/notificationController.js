const Notification = require('../Models/Notification');


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

/**
 * Get all notifications for a specific user
 */
const getUserNotifications = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ user: id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * Mark a notification as seen
 */
const markAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as seen' });
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

module.exports = {
  sendNotification,
  getUserNotifications,
  markAsSeen,
  deleteNotification
};
