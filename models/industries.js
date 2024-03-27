const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IndustrySchema = new Schema({
    content: String,
    count: Number
});

module.exports = mongoose.model('Industry', IndustrySchema);
