const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

exports.User = mongoose.model("User", userSchema);
