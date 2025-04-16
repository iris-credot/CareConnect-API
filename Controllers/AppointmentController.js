const asyncWrapper = require('../Middleware/async');
const Appointment = require('../Models/appointments');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./notificationController');


const appointmentController = {
  // Create a new appointment
  createAppointment: asyncWrapper(async (req, res, next) => {
    const { patient, doctor, date, timeSlot, reason, status, notes } = req.body;

    if (!patient || !doctor || !date || !timeSlot) {
      return next(new BadRequest('Missing required fields: patient, doctor, date, or timeSlot.'));
    }

    const appointment = new Appointment({
      patient,
      doctor,
      date,
      timeSlot,
      reason,
      status,
      notes,
    });

    const savedAppointment = await appointment.save();
    await Promise.all([
        sendNotification({
          user: patient,
          message: 'You have a new appointment scheduled.',
          type: 'appointment'
        }),
        sendNotification({
          user: doctor,
          message: 'A new appointment has been booked with you.',
          type: 'appointment'
        })
      ]);
    res.status(201).json({ message: 'Appointment created successfully', appointment: savedAppointment });
  }),

  // Get all appointments
  getAllAppointments: asyncWrapper(async (req, res, next) => {
    const appointments = await Appointment.find()
      .populate('patient')
      .populate('doctor');
    res.status(200).json({ appointments });
  }),

  // Get appointment by ID
  getAppointmentById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return next(new NotFound(`No appointment found with ID ${id}`));
    }

    res.status(200).json({ appointment });
  }),

  // Update appointment
  updateAppointment: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedAppointment) {
      return next(new NotFound(`No appointment found with ID ${id}`));
    }
    await Promise.all([
        sendNotification({
          user: updatedAppointment.patient,
          message: 'Your appointment details have been updated.',
          type: 'appointment'
        }),
        sendNotification({
          user: updatedAppointment.doctor,
          message: 'An appointment assigned to you has been updated.',
          type: 'appointment'
        })
      ]);

    res.status(200).json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
  }),

  // Delete appointment
  deleteAppointment: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return next(new NotFound(`No appointment found with ID ${id}`));
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  }),

  // Filter appointments by doctor, patient, status or date
  filterAppointments: asyncWrapper(async (req, res, next) => {
    const { doctor, patient, status, date } = req.query;

    const filter = {};
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;
    if (status) filter.status = status;
    if (date) filter.date = new Date(date);

    const appointments = await Appointment.find(filter)
      .populate('patient')
      .populate('doctor');

    res.status(200).json({ appointments });
  }),

  // Change appointment status
  changeAppointmentStatus: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return next(new BadRequest('Invalid status value.'));
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return next(new NotFound(`No appointment found with ID ${id}`));
    }

    res.status(200).json({ message: 'Status updated successfully', appointment: updatedAppointment });
  }),
};

module.exports = appointmentController;
