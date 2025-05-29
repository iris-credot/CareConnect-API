const asyncWrapper = require('../Middleware/async');
const Appointment = require('../Models/appointments');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const {sendNotification}  = require('./notificationController');


const appointmentController = {
  // Create a new appointment
  createAppointment: asyncWrapper(async (req, res, next) => {
    const {user, patient, doctor, date, timeSlot, reason, status, notes } = req.body;

    if ( !patient || !doctor || !date || !timeSlot) {
      return next(new BadRequest('Missing required fields: patient, doctor, date, or timeSlot.'));
    }

    const appointment = new Appointment({
      user,
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
      .populate('user')
      .populate('doctor');

    res.status(200).json({ appointments });
  }),

  // Get appointment by ID
  getAppointmentById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('patient')
       .populate('user')
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
       .populate('user')
      .populate('doctor');

    res.status(200).json({ appointments });
  }),

  // Change appointment status
  changeAppointmentStatus: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending','Confirmed', 'Completed', 'Cancelled','Rescheduled','Denied'].includes(status)) {
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
  // Get appointments by patient ID
    getAppointmentsByPatientId: asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const appointments = await Appointment.find({ patient: id })
    .populate('patient')
    .populate('doctor');

  if (!appointments || appointments.length === 0) {
    return next(new NotFound(`No appointments found for patient ID ${patientId}`));
  }

  res.status(200).json({ appointments });
}),
 rescheduleAppointment: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { newDate, newTimeSlot } = req.body;

    // Ensure both newDate and newTimeSlot are provided
    if (!newDate || !newTimeSlot) {
      return next(new BadRequest('Missing required fields: newDate or newTimeSlot.'));
    }

    // Find the original appointment
    const originalAppointment = await Appointment.findById(id);

    if (!originalAppointment) {
      return next(new NotFound(`No appointment found with ID ${id}`));
    }

    // Update the appointment with new date, new time slot, and change status to Rescheduled
    originalAppointment.newDate = newDate;
    originalAppointment.newTimeSlot = newTimeSlot;
    originalAppointment.status = 'Rescheduled';

    const updatedAppointment = await originalAppointment.save();

    // Notify both patient and docto
    await Promise.all([
      sendNotification({
        user: updatedAppointment.patient,
        message:'Your appointment reschedule request is pending confirmation.',
        type: 'appointment',
      }),
      sendNotification({
        user: updatedAppointment.doctor,
        message: 'A patient has requested to reschedule an appointment.',
        type: 'appointment',
      }),
    ]);

    res.status(200).json({
      message: 'Appointment rescheduled successfully',
      appointment: updatedAppointment,
    });
  }),
  getAppointmentsByUserId: asyncWrapper(async (req, res, next) => {
  const { userId } = req.params;  // patient ID from route params

  // Find all appointments where patient field matches id, populate patient and doctor refs
  const appointments = await Appointment.find({ user: id })
  .populate('user')
    .populate('patient')
    .populate('doctor');

  if (!appointments || appointments.length === 0) {
    return next(new NotFound(`No appointments found for patient ID ${id}`));
  }

  res.status(200).json({ appointments });
}),

  respondToRescheduleRequest: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { action } = req.body; // action = "accept" or "deny"
  
    if (!['accept', 'deny'].includes(action)) {
      return next(new BadRequest('Invalid action. Must be "accept" or "deny".'));
    }
  
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new NotFound(`No appointment found with ID ${id}`));
    }
  
    if (!appointment.newDate || !appointment.newTimeSlot) {
      return next(new BadRequest('No reschedule request found for this appointment.'));
    }
  
    if (action === 'accept') {
      // Move newDate/timeSlot into original ones
      appointment.date = appointment.newDate;
      appointment.timeSlot = appointment.newTimeSlot;
      appointment.status = 'Confirmed';
      appointment.newDate = undefined;
      appointment.newTimeSlot = undefined;
  
      await appointment.save();
  
      await Promise.all([
        sendNotification({
          user: appointment.patient,
          message: `Your reschedule request has been accepted. New appointment: ${appointment.date} at ${appointment.timeSlot}`,
          type: 'appointment',
        }),
        sendNotification({
          user: appointment.doctor,
          message: 'You accepted a reschedule request.',
          type: 'appointment',
        }),
      ]);
  
      return res.status(200).json({ message: 'Reschedule accepted.', appointment });
    }
  
    if (action === 'deny') {
      appointment.status = 'Denied';
      appointment.newDate = undefined;
      appointment.newTimeSlot = undefined;
  
      await appointment.save();
  
      await Promise.all([
        sendNotification({
          user: appointment.patient,
          message: 'Your reschedule request has been denied.',
          type: 'appointment',
        }),
        sendNotification({
          user: appointment.doctor,
          message: 'You denied a reschedule request.',
          type: 'appointment',
        }),
      ]);
  
      return res.status(200).json({ message: 'Reschedule denied.', appointment });
    }
  }),

};

module.exports = appointmentController;
