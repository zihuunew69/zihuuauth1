// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  hwid: String,
  expiry: Date 
});

module.exports = mongoose.model("User", userSchema);
