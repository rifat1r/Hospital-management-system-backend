const mongoose = require("mongoose");

const BlackListedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expireAt: {
    type: Date,
    expires: 5 * 24 * 60 * 60, // deletes after 5 days
  },
});

module.exports = mongoose.model("BlackListedTokens", BlackListedTokenSchema);
