const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','faculty','student'],
        default:'student'
    },
    level: { 
        type: String,
        trim: true
     } // 👈 add this


});

module.exports = mongoose.model('User',userSchema )