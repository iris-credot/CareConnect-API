const express = require('express');
const foodsrouter = express.Router();
const auth = require('../Middleware/authentication');
const foodsController = require('../Controllers/foodsController');

foodsrouter.post('/create', auth.BothJWT, foodsController.createFoodRecommendation);
foodsrouter.get('/all', auth.BothJWT, foodsController.getAllRecommendations);
foodsrouter.get('/get/:id', auth.BothJWT, foodsController.getRecommendationById);
foodsrouter.put('/update/:id', auth.BothJWT, foodsController.updateRecommendation);
foodsrouter.delete('/delete/:id', auth.BothJWT, foodsController.deleteRecommendation);


module.exports = foodsrouter;
