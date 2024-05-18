import mongoose from 'mongoose'

const FuelForm = new mongoose.Schema({

    surver_data : { type : {
        form_type : {type : String},
        vehicle_type : {type : String},
        vehicle_age : {type : Number},
        fuel_type : {type : String},
        liters_consumption : {type : Number},
        },required : true
    },
    surveyor_info : {type :  {
        email : {type : String},
        full_name : {type : String},
        municipality_name : {type : String},
        municipality_code : {type : String},
        province_code : {type : String},
    }, required : true},

    dateTime_created : {type : String, required : true},
    dateTime_edited : {type : String}



})

export default mongoose.model('FuelForm_collection', FuelForm);