import mongoose from 'mongoose'

const StationaryForm = new mongoose.Schema({


    survey_data : { type : {
        form_type : {type : String, required : true},
        
        cooking : {type : {
            charcoal : {type : Number, required :true},
            diesel: {type : Number, required :true},
            kerosene: {type : Number, required :true},
            propane: {type : Number, required :true},
            wood: {type : Number, required :true},
        }, required : true},

        generator : {type : {
            motor_gasoline: {type : Number, required :true}, 
            diesel: {type : Number, required :true},
            kerosene: {type : Number, required :true},
            residual_fuelOil: {type : Number, required :true},
        }, required : true},


        lighting : {type : {
            kerosene : {type : Number, required :true},
        }, required : true},


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
    dateTime_edited : {type : Date},


    acceptedBy : {type : {
        admin_name : {type : String, required : true},
        img_id : {type : String, required : true}
    }}



})


export = mongoose.model('StationaryForm_collection', StationaryForm);

