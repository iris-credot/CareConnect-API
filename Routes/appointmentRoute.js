const express = require('express');
const Appointmentrouter = express.Router();
const auth = require('../Middleware/authentication');
const appointmentController = require('../Controllers/AppointmentController');

Appointmentrouter.post('/create', auth.BothJWT, appointmentController.createAppointment);
Appointmentrouter.get('/all', auth.BothJWT, appointmentController.getAllAppointments);
Appointmentrouter.get('get/:id', auth.BothJWT, appointmentController.getAppointmentById);
Appointmentrouter.put('/update/:id', auth.BothJWT, appointmentController.updateAppointment);
Appointmentrouter.delete('/delete/:id', auth.BothJWT, appointmentController.deleteAppointment);
Appointmentrouter.get('/filter', auth.BothJWT, appointmentController.filterAppointments);
Appointmentrouter.put('/status/:id', auth.BothJWT, appointmentController.changeAppointmentStatus);

module.exports = Appointmentrouter;
