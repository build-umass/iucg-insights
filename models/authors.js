const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    content: String,
    imageID: String
});

module.exports = mongoose.model('Author', AuthorSchema);
