const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:String,
    _id:String
});

module.exports= mongoose.model('user',userSchema);