
const mongoose = require('mongoose');
const FoodRecommendationSchema = new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    recommendedFoods: [
      {
        name: { type: String, required: true },
        quantity: { type: String },
        timeOfDay: { type: String }
      }
    ],
    notes: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  const FoodRecommendation = mongoose.model('FoodRecommendation', FoodRecommendationSchema);

module.exports = FoodRecommendation;
  