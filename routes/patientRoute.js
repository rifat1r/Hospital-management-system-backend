const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAllPatients,
} = require("../controllers/patientController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/appointment/:doctorId").post(isAuthenticated, createAppointment);
router.route("/appointments").get(isAuthenticated, getMyAppointments);

router
  .route("/all")
  .get(isAuthenticated, authorizeRoles("admin"), getAllPatients);

module.exports = router;
