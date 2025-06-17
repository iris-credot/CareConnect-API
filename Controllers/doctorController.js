const asyncWrapper = require('../Middleware/async');
const Doctor = require('../Models/Doctor');
const User = require('../Models/User');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');

const doctorController = {
  // Get all doctors
  getAllDoctors: asyncWrapper(async (req, res, next) => {
    const doctors = await Doctor.find().populate('user');
    res.status(200).json({ doctors });
  }),

  // Get single doctor by ID
  getDoctorById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).populate('user').populate('patients');
    if (!doctor) {
      return next(new NotFound('Doctor not found'));
    }
    res.status(200).json({ doctor });
  }),
  getdoctor:asyncWrapper(async(req,res,next)=>{
  try {
    // req.user.id is the logged-in user's ID, you must get it from your auth middleware
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'firstName lastName');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
  }),
  getDoctorByUserId: asyncWrapper(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}),
 
  // Create a new doctor profile (after user registration)
  createDoctor: asyncWrapper(async (req, res, next) => {
    const { user, licenseNumber, specialization, yearsOfExperience, hospital, availableSlots, patients } = req.body;

    // Check if user exists and is a doctor
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return next(new NotFound('User not found'));
    }

   
    const existingDoctor = await Doctor.findOne({ user });
    if (existingDoctor) {
      return next(new BadRequest('Doctor profile already exists for this user'));
    }

    const newDoctor = await Doctor.create({
      user,
      licenseNumber,
      specialization,
      yearsOfExperience,
      hospital,
      availableSlots,
      patients,
    });
    if (foundUser.role !== 'doctor') {
      foundUser.role = 'doctor';
      await foundUser.save();
    }

    res.status(201).json({ message: 'Doctor created successfully', doctor: newDoctor });
  }),

  // Update doctor info
  updateDoctor: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('user');

    if (!updatedDoctor) {
      return next(new NotFound('Doctor not found'));
    }

    res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  }),

  // Delete doctor
  deleteDoctor: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return next(new NotFound('Doctor not found'));
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  }),

  // Get patients assigned to a doctor
  getDoctorPatients: asyncWrapper(async (req, res, next) => {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate({
      path: 'patients',
      populate: {
        path: 'user', // Include user details of each patient
      },
    });

    if (!doctor) {
      return next(new NotFound('Doctor not found'));
    }

    res.status(200).json({ patients: doctor.patients });
  }),
};

module.exports = doctorController;
