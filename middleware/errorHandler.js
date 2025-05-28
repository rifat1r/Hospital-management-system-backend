const { StatusCodes } = require("http-status-codes");

module.exports = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "something went wrong",
  };

  // mongoose validation error
  if (err.name === "ValidationError") {
    customError.message = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});

    customError.statusCode = 400;
  }

  res.status(customError.statusCode).json({ msg: customError.message });
};
