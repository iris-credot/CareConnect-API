const express = require('express');
const foodsrouter = express.Router();
const auth = require('../Middleware/authentication');
const foodsController = require('../Controllers/foodsController');

foodsrouter.post('/create',auth.BothJWT,foodsController.createFoodRecommendation);
foodsrouter.get('/all',auth.BothJWT, foodsController.getAllRecommendations);
foodsrouter.get('/get/:id',auth.AuthJWT,foodsController.getRecommendationById);
foodsrouter.put('/update/:id',auth.BothJWT,foodsController.updateRecommendation);
foodsrouter.delete('/delete/:id',auth.AuthJWT,foodsController.deleteRecommendation);
foodsrouter.get('/patient/:patientId', auth.BothJWT, foodsController.getRecommendationsByPatientId);



module.exports = foodsrouter;
