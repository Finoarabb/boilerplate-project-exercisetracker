const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const exerciseSchema = new mongoose.Schema({
    username: String,
  description: String,
  duration: Number,
  date: Date,
  userId: ObjectId,
});

module.exports = mongoose.model('exercise',exerciseSchema);