const mongoose = require("mongoose");

const tempimageSchema = new mongoose.Schema({
  id: String,
});

module.exports = mongoose.model("TempImage", tempimageSchema);
