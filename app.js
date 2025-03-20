const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

//middleware
app.use(express.json());
app.use(cookieParser());

const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");
const patientRoute = require("./routes/patientRoute");
const errorhandlerMiddleware = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

//routes
app.use("/api/auth/admin", adminRoute);
app.use("/api/auth/doctor", doctorRoute);
app.use("/api/auth/patient", patientRoute);

// error middleware
app.use(errorhandlerMiddleware);
app.use(notFound);

app.get("/", (req, res) => {
  res.send("welcome ");
});

module.exports = app;
