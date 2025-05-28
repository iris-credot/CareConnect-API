const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true 
  },
newDate: {
    type: Date,
    
  },
  newTimeSlot: {
    type: String,
   
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending','Confirmed', 'Completed', 'Cancelled','Rescheduled','Denied'],
    default: 'Pending'
  },
  action:{
    type: String,
    enum:['accept','deny']
  },
  notes: {
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointments', appointmentSchema);
