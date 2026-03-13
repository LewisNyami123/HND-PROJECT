
const Question = require('../models/Questions');

const createQuestion = async (req, res)=>{
    try{
     const question = new Question(req.body);
     await question.save();
     res.status(201).json({message: 'Question created successfully',question});
    }catch(err){
      res.status(500).json({message: err.message})
    }
};

module.exports = {createQuestion};