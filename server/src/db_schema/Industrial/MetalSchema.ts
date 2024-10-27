import mongoose from "mongoose";

const MetalSchema = new mongoose.Schema({
    survey_data : {
        dsi : {type : String},
        type_ofData : {type : String},

        ispif : {type: Number}, //Iron and Steel Production from Integrated Facilities
        ispnif : {type: Number}, // Iron and Steel Production from Non-integrated Facilities
        
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
    dateTime_edited : {type : Date},
    acceptedBy : {type : {
        admin_name : {type : String, required : true},
        img_id : {type : String, required : true}
    }}
})

export = mongoose.model('(industrial) metalForm', MetalSchema);