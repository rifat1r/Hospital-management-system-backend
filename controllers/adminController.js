const asyncWrapper = require("../middleware/asyncWrapper");
const Appointment = require("../models/appointmentModel");
const Admin = require("../models/adminModel");

exports.getAllAppointments = asyncWrapper(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

exports.getAllAdmins = asyncWrapper(async (req, res, next) => {
  const admins = await Admin.find({});
  res.status(200).json({
    success: true,
    count: admins.length,
    admins,
  });
});
