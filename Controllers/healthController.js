const asyncWrapper = require('../Middleware/async');
const Health = require('../Models/health');
const NotFound = require('../Error/NotFound');
const BadRequest = require('../Error/BadRequest');
const { sendNotification } = require('./notificationController');
const healthController = {

  // Create a new health record
  createHealthRecord: asyncWrapper(async (req, res, next) => {
    const { patient } = req.body;

    // Ensure one record per patient
    const existing = await Health.findOne({ patient });
    if (existing) return next(new BadRequest('Health record already exists for this patient'));

    const newRecord = new Health(req.body);
    const saved = await newRecord.save();
    await sendNotification({
        user: patient,
        message: 'A new health record has been created for you.',
        type: 'health',
      });
    res.status(201).json({ message: 'Health record created', data: saved });
  }),

  // Get all health records (for admin purposes)
  getAllHealthRecords: asyncWrapper(async (req, res, next) => {
    const records = await Health.find().populate('patient').populate('medications.prescribedBy');
    res.status(200).json({ data: records });
  }),

  // Get health record by patient ID
  getHealthByPatient: asyncWrapper(async (req, res, next) => {
    const { patientId } = req.params;
    const record = await Health.findOne({ patient: patientId })
      .populate('patient')
      .populate('medications.prescribedBy');

    if (!record) return next(new NotFound('Health record not found'));

    res.status(200).json({ data: record });
  }),

  // Update health record by patient ID
  updateHealthRecord: asyncWrapper(async (req, res, next) => {
    const { patientId } = req.params;
    const updated = await Health.findOneAndUpdate({ patient: patientId }, req.body, {
      new: true,
      runValidators: true
    })
      .populate('patient')
      .populate('medications.prescribedBy');

    if (!updated) return next(new NotFound('Health record not found'));

    res.status(200).json({ message: 'Health record updated', data: updated });
  }),

  // Delete health record by patient ID
  deleteHealthRecord: asyncWrapper(async (req, res, next) => {
    const { patientId } = req.params;
    const deleted = await Health.findOneAndDelete({ patient: patientId });

    if (!deleted) return next(new NotFound('Health record not found'));

    res.status(200).json({ message: 'Health record deleted', data: deleted });
  })

};

module.exports = healthController;
