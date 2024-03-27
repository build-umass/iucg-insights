// Description: This file contains the schema for the article model.
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  synopsis: String,
  author: String,
  authorImgID: String,
  content: String,
  contentImgID: String,
  industries: [String],
  categories: [String],
  images: [String],
  created: { type: Date, default: Date.now },
  edited: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Article", articleSchema);
