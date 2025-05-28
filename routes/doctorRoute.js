const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const {
  getAllDoctors,
  getAppointments,
} = require("../controllers/doctorController");

const router = express.Router();

router
  .route("/all")
  .get(isAuthenticated, authorizeRoles("admin"), getAllDoctors);

router.route("/appointments").get(isAuthenticated, getAppointments);

module.exports = router;
