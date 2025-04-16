const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Could be a patient or doctor
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Generic to allow doctor/patient/future roles
      required: true
    }
  ],
  messages: [messageSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

chatSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
