const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    content: String,
    count: Number
});

module.exports = mongoose.model('Category', CategorySchema);
