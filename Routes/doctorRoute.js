const express = require('express');
const Doctorrouter= express.Router();
const auth = require('../Middleware/authentication');
const authController = require('../Controllers/doctorController');


Doctorrouter.post('/create',authController.createDoctor);
Doctorrouter.get('/all' ,auth.AuthJWT,authController.getAllDoctors);
Doctorrouter.delete('/delete/:id',auth.adminJWT, authController.deleteDoctor);
Doctorrouter.put('/put/:id', auth.BothJWT,authController.updateDoctor);
Doctorrouter.get('/getdoctor/:id', auth.adminJWT,authController.getDoctorById);
Doctorrouter.get('/getDoctorPatients/:doctorId', auth.BothJWT,authController.getDoctorPatients);


module.exports = Doctorrouter;