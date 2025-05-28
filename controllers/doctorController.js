const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const asyncWrapper = require("../middleware/asyncWrapper");
const { NotFoundError } = require("../errors");

exports.getAllDoctors = asyncWrapper(async (req, res, next) => {
  const doctors = await Doctor.find({});
  res.status(200).json({
    success: true,
    count: doctors.length,
    doctors,
  });
});

exports.getAppointments = asyncWrapper(async (req, res, next) => {
  const appointments = await Appointment.find({ doctor: req.user.userId });
  if (!appointments) {
    throw new NotFoundError("No appointments found");
  }
  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});
