const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // This will be the user who sends the feedback (could be a patient or a doctor)
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // This will be the user who receives the feedback (could be a doctor or patient)
    required: true,
  },
  feedbackText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,  // This can be an optional field for giving ratings (e.g., 1-5)
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
