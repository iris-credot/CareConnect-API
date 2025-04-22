const express = require('express');
const Patientrouter= express.Router();
const auth = require('../Middleware/authentication');
const authController = require('../Controllers/patientController');


Patientrouter.post('/create',authController.createPatient);
Patientrouter.get('/all' ,auth.BothJWT,authController.getAllPatients);
Patientrouter.put('/profile/:id', auth.AuthJWT,authController.updatePatient);
Patientrouter.get('/getPatient/:id', auth.BothJWT,authController.getPatientById);
Patientrouter.get('/getPatientByUser/:userId', auth.BothJWT,authController.getPatientByUserId);
Patientrouter.delete('/delete/:id', auth.BothJWT,authController.deletePatient);


module.exports = Patientrouter;