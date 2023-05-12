// Description: This file contains the schema for the article model.
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  synopsis: String,
  author: String,
  authorImg: String,
  content: String,
  contentImg: String,
  tags: [String],
  images: [String],
});

module.exports = mongoose.model("Article", articleSchema);
