const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");
const patientRoute = require("./routes/patientRoute");
const errorhandlerMiddleware = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

//routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/patient", patientRoute);
// error middleware
app.use(errorhandlerMiddleware);
app.use(notFound);

module.exports = app;
