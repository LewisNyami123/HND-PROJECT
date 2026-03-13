const express = require('express');
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    exam:{type: mongoose.Schema.Types.ObjectId, ref:'Exam'},
    answers:[{
        question:{type: mongoose.Schema.Types.ObjectId, ref:'Question'},
        submittedAnswer:{type:String},
    }
],
    score:{type:Number},
    submissionTime:{type:Date, default:Date.now}
});

module.exports = mongoose.model('Result', resultSchema);