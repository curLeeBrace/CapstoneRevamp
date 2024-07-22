import mongoose from 'mongoose'

const FuelForm = new mongoose.Schema({

    survey_data : { type : {
        form_type : {type : String, required : true},
        vehicle_type : {type : String, required : true},
        vehicle_age : {type : Number, required : true},
        fuel_type : {type : String},
        liters_consumption : {type : Number, required : true},
        brgy_name  :{type : String, required : true},
        brgy_code : {type : String, required : true},
        status : {type : String, required : true, default : "0"}
        },required : true
    },
    surveyor_info : {type :  {
        email : {type : String},
        full_name : {type : String},
        municipality_name : {type : String},
        municipality_code : {type : String},
        province_code : {type : String},
    }, required : true},

    dateTime_created : {type : Date, required : true},
    dateTime_edited : {type : String}


})

export = mongoose.model('FuelForm_collection', FuelForm);