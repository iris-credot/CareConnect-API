const PatientRoute = require('./patient.js');
const userRoute = require('./userRoute.js');
const DoctorRoute = require('./doctorRoute.js');
const appointmentRoute = require('./appointmentRoute.js');
const feedbackRoute = require('./Feedback.js');
const chatroute = require('./chatRoute.js');
const healthroute = require('./healthRoute.js');
const reportroute = require('./report.js');
const ntifications =require('./notifications.js');
const foods =require('./foodsRoute.js');
const sports =require('./sportsRoute.js');

const express = require('express');

const Router= express.Router();
Router.use('/doctor',DoctorRoute);
Router.use('/patient',PatientRoute);
Router.use('/user',userRoute);
Router.use('/appointment',appointmentRoute);
Router.use('/feedback',feedbackRoute);
Router.use('/chat',chatroute);
Router.use('/health',healthroute);
Router.use('/report',reportroute);
Router.use('/notify',ntifications);
Router.use('/sports',sports);
Router.use('/foods',foods);


module.exports = Router;