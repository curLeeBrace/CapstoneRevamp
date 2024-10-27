import mongoose from "mongoose";

const MineralSchema = new mongoose.Schema({

    survey_data : {type : {
        
            dsi : {type : String},
            type_ofData : {type : String},
    
    
            cpp : {type : Number, required:true}, //Cement Production - Portland
            cpb : {type : Number, required:true}, //Cement Production - Blended
            lp :  {type : Number, required:true}, //Lime Production
            gp :  {type : Number, required:true}, //Glass Production
            
            brgy_name  :{type : String, required : true},
            brgy_code : {type : String, required : true},
            status : {type : String, required : true, default : "0"}
        
    }, required : true},

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

export = mongoose.model('(industrial) mineralForm', MineralSchema);