const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");
const asyncWrapper = require("../middleware/asyncWrapper");

exports.createAppointment = asyncWrapper(async (req, res, next) => {
  const { doctorId, patientId, date } = req.body;
  const newAppointment = await Appointment.create({ ...req.body });

  //update Doctor's appointment array
  await Doctor.findByIdAndUpdate(doctorId, {
    $push: { appointments: newAppointment._id },
  });

  //update Patient's appointment array
  await Patient.findByIdAndUpdate(patientId, {
    $push: { appointments: newAppointment._id },
  });

  res.status(201).json({
    success: true,
  });
});
