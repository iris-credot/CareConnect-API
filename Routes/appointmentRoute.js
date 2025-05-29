const express = require('express');
const Appointmentrouter = express.Router();
const auth = require('../Middleware/authentication');
const appointmentController = require('../Controllers/AppointmentController');

Appointmentrouter.post('/create', auth.BothJWT, appointmentController.createAppointment);
Appointmentrouter.get('/all', auth.BothJWT, appointmentController.getAllAppointments);
Appointmentrouter.get('/get/:id', auth.AuthJWT, appointmentController.getAppointmentById);
Appointmentrouter.put('/update/:id', auth.BothJWT, appointmentController.updateAppointment);
Appointmentrouter.delete('/delete/:id', auth.adminJWT, appointmentController.deleteAppointment);
Appointmentrouter.get('/byPatient/:id', auth.AuthJWT, appointmentController.getAppointmentsByPatientId);
Appointmentrouter.get('/byUser/:userId', auth.AuthJWT, appointmentController.getAppointmentsByUserId);
Appointmentrouter.get('/filter', auth.AuthJWT, appointmentController.filterAppointments);
Appointmentrouter.put('/status/:id', auth.AuthJWT, appointmentController.changeAppointmentStatus);
Appointmentrouter.put('/appoint/:id/reschedule', auth.AuthJWT,appointmentController.rescheduleAppointment);
Appointmentrouter.put('/appoint/:id/reply',auth.BothJWT, appointmentController.respondToRescheduleRequest);

module.exports = Appointmentrouter;
