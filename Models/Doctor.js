// models/manager.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Define the Manager Schema
const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },

  yearsOfExperience: {type:Number},
  hospital:{type: String},
  availableSlots: [{
    date:{type: Date},
    from: {type:String}, // e.g., "09:00 AM"
    to: {type:String}    // e.g., "11:00 AM"
  }],
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }]
},{ timestamps: true });

// Create the Manager model
const Doctor = mongoose.model('Doctor', doctorSchema);

// Export the Manager model
module.exports = Doctor;
