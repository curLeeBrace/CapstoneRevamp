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
        email : {type : String, required : true},
        full_name : {type : String, required : true},
        municipality_name : {type : String, required : true},
        municipality_code : {type : String, required : true},
        province_code : {type : String, required : true},
        img_id : {type : String, required : true}
    }, required : true},

    dateTime_created : {type : Date, required : true},
    dateTime_edited : {type : Date}


})

export = mongoose.model('FuelForm_collection', FuelForm);