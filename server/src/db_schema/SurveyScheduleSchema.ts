import mongoose from 'mongoose'

const SurveySchedule = new mongoose.Schema({
    
    survey_type : {type:String, required : true},
    start_date : {type : Date},
    deadline  : {type : Date},
    status : {typed : String, required : true},
    municipality_name : {type : String, required : true},
    year : {type : String, required : true}

})



export = mongoose.model('survey_schedule_collections', SurveySchedule);