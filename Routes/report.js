const express = require('express');
const Reportrouter = express.Router();
const auth = require('../Middleware/authentication');
const reportController = require('../Controllers/reportController');

// Create a new medical report
Reportrouter.post('/create', auth.BothJWT, reportController.createReport);
Reportrouter.get('/all', auth.BothJWT, reportController.getAllReports);
Reportrouter.get('/:id', auth.AuthJWT, reportController.getReportById);
Reportrouter.get('/patient/:patientId', auth.AuthJWT, reportController.getReportsByPatient);
Reportrouter.get('/doctor/:doctorId', auth.BothJWT, reportController.getReportsByDoctor);
Reportrouter.put('/:id', auth.BothJWT, reportController.updateReport);
Reportrouter.delete('/delete/:id', auth.BothJWT, reportController.deleteReport);

module.exports = Reportrouter;
