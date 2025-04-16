const Report = require('../Models/report'); // Adjust the path based on your structure
const asyncWrapper = require('../Middleware/async');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');
const { sendNotification } = require('./notificationController');
const reportController = {
  
  // Create a new medical report
  createReport: asyncWrapper(async (req, res, next) => {
    const { patient, summary } = req.body;

    if (!patient || !summary) {
      return next(new BadRequest('Patient and summary are required.'));
    }

    const newReport = new Report(req.body);
    const savedReport = await newReport.save();
       // Send notification to the patient about the new report
       await sendNotification({
        user: patient,
        message: 'A new medical report has been created for you.',
        type: 'report',
      });
  
    
    res.status(201).json({ message: 'Report created successfully', data: savedReport });
  }),

  // Get all reports
  getAllReports: asyncWrapper(async (req, res) => {
    const reports = await Report.find()
      .populate('patient')
      .populate('doctor');

    res.status(200).json({ total: reports.length, data: reports });
  }),

  // Get single report by ID
  getReportById: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const report = await Report.findById(id)
      .populate('patient')
      .populate('doctor');

    if (!report) return next(new NotFound('Report not found'));

    res.status(200).json(report);
  }),

  // Get all reports by patient ID
  getReportsByPatient: asyncWrapper(async (req, res, next) => {
    const { patientId } = req.params;

    const reports = await Report.find({ patient: patientId })
      .populate('doctor');

    if (reports.length === 0) {
      return next(new NotFound('No reports found for this patient'));
    }

    res.status(200).json(reports);
  }),

  // Get all reports by doctor ID
  getReportsByDoctor: asyncWrapper(async (req, res, next) => {
    const { doctorId } = req.params;

    const reports = await Report.find({ doctor: doctorId })
      .populate('patient');

    if (reports.length === 0) {
      return next(new NotFound('No reports found for this doctor'));
    }

    res.status(200).json(reports);
  }),

  // Update a report
  updateReport: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const updated = await Report.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(new NotFound('Report not found to update'));
    }

    res.status(200).json({ message: 'Report updated successfully', data: updated });
  }),

  // Delete a report
  deleteReport: asyncWrapper(async (req, res, next) => {
    const { id } = req.params;

    const deleted = await Report.findByIdAndDelete(id);

    if (!deleted) {
      return next(new NotFound('Report not found to delete'));
    }

    res.status(200).json({ message: 'Report deleted successfully', data: deleted });
  }),
};

module.exports = reportController;
