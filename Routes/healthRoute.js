const express = require('express');
const Healthrouter = express.Router();
const auth = require('../Middleware/authentication');
const healthController = require('../Controllers/healthController');

// Create a new health record
Healthrouter.post('/create', auth.BothJWT, healthController.createHealthRecord);
Healthrouter.get('/all', auth.BothJWT, healthController.getAllHealthRecords);
Healthrouter.get('/health/:healthId', auth.AuthJWT, healthController.getHealthByPatient);
Healthrouter.put('/update/:healthId', auth.BothJWT, healthController.updateHealthRecord);
Healthrouter.delete('/delete/:healthId', auth.BothJWT, healthController.deleteHealthRecord);

module.exports = Healthrouter;
