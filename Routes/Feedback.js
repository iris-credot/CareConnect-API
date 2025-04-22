const express = require('express');
const Feedbackrouter = express.Router();
const auth = require('../Middleware/authentication');
const feedbackController = require('../Controllers/feedbackController');

// Create new feedback
Feedbackrouter.post('/create', auth.BothJWT, feedbackController.createFeedback);
Feedbackrouter.get('/user/:userId', auth.BothJWT, feedbackController.getFeedbackByUser);
Feedbackrouter.get('/:feedbackId', auth.AuthJWT, feedbackController.getFeedbackById);
Feedbackrouter.put('/status/:feedbackId', auth.AuthJWT, feedbackController.updateFeedbackStatus);
Feedbackrouter.delete('/delete/:feedbackId', auth.BothJWT, feedbackController.deleteFeedback);

module.exports = Feedbackrouter;
