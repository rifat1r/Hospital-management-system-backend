const express = require("express");
const {
  getAllAppointments,
  getAllAdmins,
} = require("../controllers/adminController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/allAppointments").get(isAuthenticated, getAllAppointments);

router
  .route("/all")
  .get(isAuthenticated, authorizeRoles("admin"), getAllAdmins);

module.exports = router;
