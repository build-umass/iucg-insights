// Description: This file contains the schema for the article model.
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  synopsis: String,
  author: String,
  authorImgID: String,
  authorID: String,
  content: String,
  contentImgID: String,
  industries: [String],
  categories: [String],
  images: [String],
  created: { type: Date, default: Date.now },
  edited: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0},
  clicksDecaying: { type: Number, default: 0},
  lastDecayed: { type: Date, default: Date.now },
  relevance: { type: Number, default: 0},
});
articleSchema.index({ title: "text" })

module.exports = mongoose.model("Article", articleSchema);
