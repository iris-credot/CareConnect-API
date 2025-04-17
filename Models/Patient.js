const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
emergencyContact: {
  name: String,
  relation: String,
  phone: String
},   
insurance: {
  provider: String,
  policyNumber: String
},
weight: {
  type: Number,
},
height: {
  type: Number,
},
  },{ timestamps: true });

const patientModel = mongoose.model('Patient',patientSchema);
module.exports = patientModel;