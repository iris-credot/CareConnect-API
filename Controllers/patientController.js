const asyncWrapper = require('../Middleware/async');
const patientModel = require('../Models/Patient');
const userModel = require('../Models/User');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');

const patientController = {

  // Get all patients
  getAllPatients: asyncWrapper(async (req, res, next) => {
    const patients = await patientModel.find().populate('user');
    res.status(200).json({ patients });
  }),

  // Get one patient by ID
  getPatientById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const patient = await patientModel.findById(id).populate('user');
    if (!patient) {
      return next(new NotFound('Patient not found'));
    }
    res.status(200).json({ patient });
  }),

  // Create a new patient (must be linked to an existing user with role = patient)
  createPatient: asyncWrapper(async (req, res, next) => {
    const { user, bloodType, emergencyContact, insurance, weight, height } = req.body;

    const userId = await userModel.findById(user);
    if (!userId) {
      return next(new NotFound('User not found'));
    }

    const existingPatient = await patientModel.findOne({ user: userId });
    if (existingPatient) {
      return next(new BadRequest('Patient record already exists for this user'));
    }

    const patient = await patientModel.create({
      user: userId,
      bloodType,
      emergencyContact,
      insurance,
      weight,
      height,
    });
    if (userId.role !== 'patient') {
      userId.role = 'patient';
      await userId.save();
    }

    res.status(201).json({ patient });
  }),

  // Update patient details
  updatePatient: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updatedPatient = await patientModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('user');

    if (!updatedPatient) {
      return next(new NotFound('Patient not found'));
    }

    res.status(200).json({ updatedPatient });
  }),

  // Delete a patient by ID
  deletePatient: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedPatient = await patientModel.findByIdAndDelete(id);

    if (!deletedPatient) {
      return next(new NotFound('Patient not found'));
    }

    res.status(200).json({ message: 'Patient deleted successfully', patient: deletedPatient });
  }),

  // Get patient by userId
  getPatientByUserId: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const patient = await patientModel.findOne({ user: userId }).populate('user');
    console.log('Received userId:', userId);

    if (!patient) {
      return next(new NotFound('Patient not found for the given user'));
    }

    res.status(200).json({ patient });
  }),
    getPatientByDoctorId: asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const patient = await patientModel.findOne({ doctor: userId }).populate('doctor');
    console.log('Received userId:', userId);

    if (!patient) {
      return next(new NotFound('Patient not found for the given user'));
    }

    res.status(200).json({ patient });
  })
};

module.exports = patientController;
