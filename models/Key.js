const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  key: String,
  used: { type: Boolean, default: false },
  usedBy: { type: String, default: null },
  expiry: Date,
  note: { type: String, default: '' } // 👈 Added this
});

module.exports = mongoose.model("Key", keySchema);
