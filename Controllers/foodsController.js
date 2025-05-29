const asyncWrapper = require('../Middleware/async');
const FoodRecommendation = require('../Models/foodsModel');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./notificationController');

const foodRecommendationController = {
  // Create a new food recommendation
  createFoodRecommendation: asyncWrapper(async (req, res, next) => {
    const { patient, recommendedFoods, notes } = req.body;

    if (!patient || !recommendedFoods || !Array.isArray(recommendedFoods) || recommendedFoods.length === 0) {
      return next(new BadRequest('Missing required fields: patient or recommendedFoods.'));
    }

    const recommendation = new FoodRecommendation({
      patient,
      recommendedFoods,
      notes
    });

    const savedRecommendation = await recommendation.save();

    await sendNotification({
      user: patient,
      message: 'Your doctor has sent new food recommendations.',
      type: 'foodRecommendation'
    });

    res.status(201).json({ message: 'Recommendation created successfully', recommendation: savedRecommendation });
  }),
  // Get recommendations by patient ID
getRecommendationsByPatient: asyncWrapper(async (req, res, next) => {
  const { patientId } = req.params;

  const recommendations = await FoodRecommendation.find({ patient: patientId });

  res.status(200).json({ recommendations });
}),

  // Get all food recommendations
  getAllRecommendations: asyncWrapper(async (req, res, next) => {
    const recommendations = await FoodRecommendation.find().populate('patient');
    res.status(200).json({ recommendations });
  }),

  // Get recommendation by ID
  getRecommendationById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const recommendation = await FoodRecommendation.findById(id).populate('patient');

    if (!recommendation) {
      return next(new NotFound(`No recommendation found with ID ${id}`));
    }

    res.status(200).json({ recommendation });
  }),

  // Update a recommendation
  updateRecommendation: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedRecommendation = await FoodRecommendation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecommendation) {
      return next(new NotFound(`No recommendation found with ID ${id}`));
    }

    res.status(200).json({ message: 'Recommendation updated successfully', recommendation: updatedRecommendation });
  }),

  // Delete a recommendation
  deleteRecommendation: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedRecommendation = await FoodRecommendation.findByIdAndDelete(id);

    if (!deletedRecommendation) {
      return next(new NotFound(`No recommendation found with ID ${id}`));
    }

    res.status(200).json({ message: 'Recommendation deleted successfully' });
  })
};

module.exports = foodRecommendationController;
