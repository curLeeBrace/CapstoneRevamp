import mongoose from 'mongoose'


const WasteWaterForm = new mongoose.Schema({

    survey_data : { type : {
        form_type : {type : String, required : true},
        septic_tanks : {type : Number, default : 0},
        open_pits : {type : Number, default : 0},
        latrines : {type : Number, default : 0},
        flush_waterUse : {type : Number, default : 0},
        sodrl : {type : Number, default : 0}, // Stagnant oxygen deficient rivers and lakes
        rle : {type : Number, default : 0}, //Rivers, lakes, estuaries
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


export = mongoose.model('wasteWaterForm', WasteWaterForm);