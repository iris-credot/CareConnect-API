const asyncWrapper = require('../Middleware/async');
const Feedback = require('../Models/Feedback');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./notificationController');

const feedbackController = {
  // Create new feedback
  createFeedback: asyncWrapper(async (req, res, next) => {
    const { sender, receiver, feedbackText, rating } = req.body;

    // Create the new feedback entry
    const newFeedback = new Feedback({
      sender,
      receiver,
      feedbackText,
      rating,
    });

    const savedFeedback = await newFeedback.save();
    await sendNotification({
        user: receiver,
        message: `You have received new feedback from ${sender}`,
        type: 'feedback',
      });
  
      // Optionally send a notification to the sender (feedback created successfully)
      await sendNotification({
        user: sender,
        message: 'Your feedback was successfully submitted.',
        type: 'feedback',
      });
  
    res.status(201).json({
      message: 'Feedback created successfully',
      feedback: savedFeedback,
    });
  }),

  // Get all feedback for a particular user (sender or receiver)
  getFeedbackByUser: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params; // User ID as a parameter in the request URL
    
    // Get all feedback where the user is either the sender or receiver
    const feedbacks = await Feedback.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    if (!feedbacks || feedbacks.length === 0) {
      return next(new NotFound('No feedback found for this user.'));
    }

    res.status(200).json({ feedbacks });
  }),

  // Get feedback by feedback ID
  getFeedbackById: asyncWrapper(async (req, res, next) => {
    const { feedbackId } = req.params;

    // Find feedback by ID
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return next(new NotFound('Feedback not found.'));
    }

    res.status(200).json({ feedback });
  }),

  // Update the feedback status (e.g., resolving a feedback)
  updateFeedbackStatus: asyncWrapper(async (req, res, next) => {
    const { feedbackId } = req.params;
    const { status } = req.body; // Status can be 'pending' or 'resolved'

    // Validate status
    if (!['pending', 'resolved'].includes(status)) {
      return next(new BadRequest('Invalid status.'));
    }

    // Find and update the feedback
    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    );

    if (!feedback) {
      return next(new NotFound('Feedback not found.'));
    }

    res.status(200).json({
      message: 'Feedback status updated successfully',
      feedback,
    });
  }),

  // Delete feedback
  deleteFeedback: asyncWrapper(async (req, res, next) => {
    const { feedbackId } = req.params;

    // Find and delete the feedback
    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return next(new NotFound('Feedback not found.'));
    }

    res.status(200).json({
      message: 'Feedback deleted successfully',
      feedback: deletedFeedback,
    });
  }),
};

module.exports = feedbackController;
