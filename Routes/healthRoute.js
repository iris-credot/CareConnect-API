const express = require('express');
const Healthrouter = express.Router();
const auth = require('../Middleware/authentication');
const healthController = require('../Controllers/healthController');

// Create a new health record
Healthrouter.post('/create', auth.BothJWT, healthController.createHealthRecord);
Healthrouter.get('/all', auth.BothJWT, healthController.getAllHealthRecords);
Healthrouter.get('/patient/:patientId', auth.BothJWT, healthController.getHealthByPatient);
Healthrouter.put('/patient/:patientId', auth.BothJWT, healthController.updateHealthRecord);
Healthrouter.delete('/patient/:patientId', auth.BothJWT, healthController.deleteHealthRecord);

module.exports = Healthrouter;
