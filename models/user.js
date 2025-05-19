const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;  // <-- get ObjectId from mongoose

const userSchema = new mongoose.Schema({
    username: String,
});

module.exports = mongoose.model('user', userSchema);
