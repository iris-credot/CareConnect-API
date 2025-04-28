const express = require('express');
const Appointmentrouter = express.Router();
const auth = require('../Middleware/authentication');
const appointmentController = require('../Controllers/AppointmentController');

Appointmentrouter.post('/create', auth.BothJWT, appointmentController.createAppointment);
Appointmentrouter.get('/all', auth.BothJWT, appointmentController.getAllAppointments);
Appointmentrouter.get('/get/:id', auth.AuthJWT, appointmentController.getAppointmentById);
Appointmentrouter.put('/update/:id', auth.BothJWT, appointmentController.updateAppointment);
Appointmentrouter.delete('/delete/:id', auth.AuthJWT, appointmentController.deleteAppointment);
Appointmentrouter.get('/byPatient/:id', auth.AuthJWT, appointmentController.getAppointmentsByPatientId);
Appointmentrouter.get('/filter', auth.AuthJWT, appointmentController.filterAppointments);
Appointmentrouter.put('/status/:id', auth.AuthJWT, appointmentController.changeAppointmentStatus);

module.exports = Appointmentrouter;
