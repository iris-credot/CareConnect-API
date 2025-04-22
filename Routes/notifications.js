
const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authentication');
const {
  getUserNotifications,
  markAsSeen,
  deleteNotification
} = require('../Controllers/notificationController');

// Get all notifications for a user
router.get('/get/:id', auth.AuthJWT,getUserNotifications);

// Mark a single notification as seen
router.put('/:id/seen',auth.AuthJWT, markAsSeen);

// Delete a notification
router.delete('/:id', auth.AuthJWT,deleteNotification);

module.exports = router;
