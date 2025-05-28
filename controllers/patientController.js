const asyncWrapper = require("../middleware/asyncWrapper");
const Patient = require("../models/patientModel");
const Appointment = require("../models/appointmentModel");

exports.createAppointment = asyncWrapper(async (req, res, next) => {
  const doctorId = req.params.doctorId;
  const appointment = await Appointment.create({
    ...req.body,
    patient: req.user.userId,
    doctor: doctorId,
  });
  res.status(201).json({
    success: true,
    appointment,
  });
});

exports.getMyAppointments = asyncWrapper(async (req, res, next) => {
  const appointments = await Appointment.find({
    patient: req.user.userId,
  }).populate("doctor", "name designation");
  res.status(200).json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

exports.getAllPatients = asyncWrapper(async (req, res, next) => {
  const patients = await Patient.find({});
  res.status(200).json({
    success: true,
    count: patients.length,
    patients,
  });
});
