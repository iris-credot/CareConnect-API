const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: String,
    required: true,
  },
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    respirationRate: Number,
  },
  diagnosis: {type:String},
  allergies: [String],
  medications: [String],
  lifestyleRecommendations:{type: String},
  nextAppointment: {
    type: Date,
  },
  attachedFiles: [String], // e.g., links to PDF/image scans
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
