const CustomAPIError = require("./customApiError");
const BadRequestError = require("./badRequestError");
const NotFoundError = require("./notFoundError");
const UnauthenticatedError = require("./unauthenticatedError");

module.exports = {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  CustomAPIError,
};
