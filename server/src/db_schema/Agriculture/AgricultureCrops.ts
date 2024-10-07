import mongoose from 'mongoose'


const AgricultureForm = new mongoose.Schema({
    survey_data : { type : {

        // form_type : {type : String, required : true},
        crops : {type:{
            rdsi : {type:Number, required : true}, //Rice (Dry Season, Irrigated)
            rdsr : {type:Number, required : true}, //Rice (Dry Season, Rainfed)
            rwsi : {type:Number, required : true}, //Rice (Wet Season, Irrigated)
            rwsr : {type:Number, required : true}, //Rice (Wet Season, Rainfed)
            crop_residues : {type:Number, required : true}, // Crop Residues (tonnes of dry weight)
            dol_limestone : {type:Number, required : true},//Dolomite and/or Limestone Consumption
        },required : true},


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


export = mongoose.model('(agriculture) crops', AgricultureForm);