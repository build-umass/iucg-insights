// Description: This file contains the schema for the article model.
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  data: Buffer,
  type: String,
  created: { type: Date, default: Date.now},
});

module.exports = mongoose.model("Image", imageSchema);
