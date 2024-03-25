const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    content: String
});

module.exports = mongoose.model('Category', CategorySchema);
