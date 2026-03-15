const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:[true,'Exam title is required'],
        trim:true
    },

    course:{
        type:String,
        required:[true,'Course name is required'],
        trim:true
    },

    faculty:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Faculty member is required']
    },

    level:{
        type:String,
        required:[true,'Student level is required'],
        trim:true
    },

    department:{
        type:String,
        required:[true,'Department is required'],
        trim:true
    },

    duration:{
        type:Number,
        required:[true,'Exam duration is required'],
        min:[30,'Duration must be at least 30 minutes'],
        max:[300,'Duration cannot exceed 5 hours']
    },

    scheduledTime:{
        type:Date,
        required:[true,'Scheduled date and time is required']
    },

    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room'
    },

    status:{
        type:String,
        enum:['pending','ongoing','completed'],
        default:'pending'
    },

    questions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Question'
        }
    ],

    totalMarks:{
        type:Number,
        default:100,
        min:0
    },

    passMark:{
        type:Number,
        default:50,
        min:0,
        max:100
    }

},
{
    timestamps:true
});

// Virtual end time
examSchema.virtual('endTime').get(function(){
    if(!this.scheduledTime || !this.duration) return null;
    return new Date(this.scheduledTime.getTime() + this.duration * 60 * 1000);
});

// Indexing
examSchema.index({scheduledTime:1,level:1,department:1});
examSchema.index({status:1});

module.exports = mongoose.model('Exam',examSchema);