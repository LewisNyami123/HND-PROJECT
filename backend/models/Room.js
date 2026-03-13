const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {type:String, required:true},
    capacity: {type:Number, required:true},
    location:{type:String},
    isAvailable:{type:Boolean, default:true}
});

module.exports = mongoose.model('Room', roomSchema);