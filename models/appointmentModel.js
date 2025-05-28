const mongoose = require("mongoose");
const Doctor = require("./doctorModel");
const Patient = require("./patientModel");
const { NotFoundError } = require("../errors");

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: Date,
    status: {
      type: String,
      enum: ["requested", "scheduled", "cancelled"],
      default: "requested",
    },
    department: {
      type: String,
      enum: ["general", "cardiology", "neurology", "orthopedics", "pediatrics"],
      required: [true, "Please provide a department"],
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.pre("save", async function (next) {
  const doctor = await Doctor.findById(this.doctor);
  const patient = await Patient.findById(this.patient);
  if (!doctor || !patient) {
    throw new NotFoundError("Doctor or Patient not found");
  }
  doctor.appointments.push(this._id);
  patient.appointments.push(this._id);

  await doctor.save({ validateBeforeSave: false });
  await patient.save({ validateBeforeSave: false });
  next();
});

appointmentSchema.pre("remove", async function (next) {
  const doctor = await Doctor.findById(this.doctor);
  const patient = await Patient.findById(this.patient);
  if (!doctor || !patient) {
    throw new NotFoundError("Doctor or Patient not found");
  }
  doctor.appointments.pull(this._id);
  patient.appointments.pull(this._id);

  await doctor.save({ validateBeforeSave: false });
  await patient.save({ validateBeforeSave: false });
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
