const express = require('express');
const sportsrouter = express.Router();
const auth = require('../Middleware/authentication');
const sportsController = require('../Controllers/sportsController');

sportsrouter.post('/create', auth.BothJWT, sportsController.createSportRecommendation);
sportsrouter.get('/all', auth.BothJWT, sportsController.getAllSportRecommendations);
sportsrouter.get('/get/:id', auth.BothJWT, sportsController.getSportRecommendationById);
sportsrouter.put('/update/:id', auth.BothJWT, sportsController.updateSportRecommendation);
sportsrouter.delete('/delete/:id', auth.BothJWT, sportsController.deleteSportRecommendation);


module.exports = Appointmentrouter;
