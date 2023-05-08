// Description: This file contains the schema for the article model.
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  synopsis: String,
  author: String,
  content: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  created: { type: Date, default: Date.now},
  //updated: String,
});

// Set created date to 'now'
articleSchema.pre('save', (next) => {
	if (!this.created) {
		this.created = new Date();
	}

	next();
});

module.exports = mongoose.model("Article", articleSchema);
