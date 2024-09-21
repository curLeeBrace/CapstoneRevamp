import mongoose from "mongoose";

const OthersSchema = new mongoose.Schema({
    survey_data : {
        dsi : {type : String},
        type_ofData : {type : String},



        ppi : {type : Number}, //Pulp and Paper Industry 
        fbi : {type : Number}, //Food and Beverages Industry 
        other : {type : Number}, //Other
        brgy_name  :{type : String, required : true},
        brgy_code : {type : String, required : true},
        status : {type : String, required : true, default : "0"}
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

export = mongoose.model('(industrial) metalForm', OthersSchema);