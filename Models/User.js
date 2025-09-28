const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  hasProfile: { type: Boolean, required: false}, //added this
});

const User = mongoose.model("User", userSchema);
module.exports = User;