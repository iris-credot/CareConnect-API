
const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsSeen,
  deleteNotification
} = require('../Controllers/notificationController');

// Get all notifications for a user
router.get('/get/:id', getUserNotifications);

// Mark a single notification as seen
router.put('/:id/seen', markAsSeen);

// Delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;
