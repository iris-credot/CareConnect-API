const mongoose = require('mongoose');

const SportRecommendationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  recommendedSports: [
    {
      name: { type: String, required: true },           // e.g., Walking, Swimming
      duration: { type: String },                        // e.g., "30 minutes", "1 hour"
      frequency: { type: String },                       // e.g., "3 times a week"
      intensity: { type: String }                        // e.g., "Low", "Moderate", "High"
    }
  ],
  notes: {
    type: String                                         // Any additional advice or info
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SportRecommendation', SportRecommendationSchema);
