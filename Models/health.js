const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    unique: true
  },
  chronicDiseases: {
    type: [String],
    default: [],
  },
  allergies: [
    {
      allergen: String,
      reaction: String,
      severity: {
        type: String,
        enum: ['Mild', 'Moderate', 'Severe']
      },
      notes: String
    }
  ],
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      startDate: Date,
      endDate: Date
    }
  ],
  surgeries: [
    {
      type: String,
      date: Date,
      notes: String
    }
  ],
  familyHistory: [
    {
      relation: String,
      condition: String,
      notes: String
    }
  ],
  lifestyle: {
    smoker: Boolean,
    alcohol: Boolean,
    exerciseFrequency: String, // e.g. "Daily", "Occasionally"
    diet: String // e.g. "Vegetarian", "Keto", etc.
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
healthSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Health', healthSchema);
