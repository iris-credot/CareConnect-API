const asyncWrapper = require('../Middleware/async');
const SportRecommendation = require('../Models/sportsModel');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./notificationController');


const sportController = {
  // Create a new sport recommendation
  createSportRecommendation: asyncWrapper(async (req, res, next) => {
    const { patient, recommendedSports, notes } = req.body;

    if (!patient || !recommendedSports || recommendedSports.length === 0) {
      return next(new BadRequest('Missing required fields: patient or recommendedSports.'));
    }

    const sportRecommendation = new SportRecommendation({
      patient,
      recommendedSports,
      notes,
    });

    const savedSportRecommendation = await sportRecommendation.save();
    // Inside createSportRecommendation
await sendNotification({
    user: patient,
    message: 'You have received a new sport recommendation.',
    type: 'sport'
  });
  
    res.status(201).json({
      message: 'Sport recommendation created successfully',
      sportRecommendation: savedSportRecommendation,
    });
  }),

  // Get all sport recommendations
  getAllSportRecommendations: asyncWrapper(async (req, res, next) => {
    const recommendations = await SportRecommendation.find().populate('patient');
    res.status(200).json({ recommendations });
  }),

  // Get sport recommendation by ID
  getSportRecommendationById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const recommendation = await SportRecommendation.findById(id).populate('patient');

    if (!recommendation) {
      return next(new NotFound(`No sport recommendation found with ID ${id}`));
    }

    res.status(200).json({ recommendation });
  }),

  // Update a sport recommendation
  updateSportRecommendation: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedRecommendation = await SportRecommendation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecommendation) {
      return next(new NotFound(`No sport recommendation found with ID ${id}`));
    }

    res.status(200).json({
      message: 'Sport recommendation updated successfully',
      sportRecommendation: updatedRecommendation,
    });
  }),

  // Delete a sport recommendation
  deleteSportRecommendation: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedRecommendation = await SportRecommendation.findByIdAndDelete(id);

    if (!deletedRecommendation) {
      return next(new NotFound(`No sport recommendation found with ID ${id}`));
    }

    res.status(200).json({ message: 'Sport recommendation deleted successfully' });
  }),
};

module.exports = sportController;
