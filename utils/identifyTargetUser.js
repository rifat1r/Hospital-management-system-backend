const getUserModel = require("./getUserModel");

//GOAL: Resolve the target user's ID, role, and corresponding model (supports admin managing other users)
const identifyTargetUser = (req, defaultRole = null) => {
  let userId = req.user.userId;
  let userRole = req.user.role;

  //   if the user is admin and trying to manage another user
  if (userRole === "admin" && req.query) {
    // accessing the target user's id and role from the query params
    const { id, role } = req.query;
    if (id && role) {
      userRole = role;
      userId = id;
    }
  }

  const Model = getUserModel(userRole);

  return { userId, Model, userRole };
};

module.exports = identifyTargetUser;
