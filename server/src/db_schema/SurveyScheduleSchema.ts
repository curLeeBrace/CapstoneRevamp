import mongoose from 'mongoose'

const SurveySchedule = new mongoose.Schema({
    
    survey_type : {type:String, required : true},
    start_date : {type : Date},
    deadline  : {type : Date},
    status : {type : String, required : true},
    municipality_name : {type : String, required : true},
    year : {type : String, required : true}

})



export = mongoose.model('Survey_Schedule_Collections', SurveySchedule);