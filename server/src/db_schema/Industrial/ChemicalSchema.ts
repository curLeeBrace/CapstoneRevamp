import mongoose from "mongoose";

const ChemicalSchema = new mongoose.Schema({

    survey_data : {
        dsi : {type : String},
        type_ofData : {type : String},


        ap : {type : Number}, //Ammonia Production
        sap : {type : Number}, //Soda Ash Production
        pcbp_EDVCM :  {type : Number}, // Petrochemical and Carbon Black Production - Ethylene Dichloride and Vinyl Chloride Monomer
        pcbp_M :  {type : Number}, // Petrochemical and Carbon Black Production - Methanol
        pcbp_EO : {type : Number}, // Petrochemical and Carbon Black Production - Ethylene Oxide
        pcbp_CB : {type : Number}, // Petrochemical and Carbon Black Production - Carbon Black  
        pcbp_E :  {type : Number}, // Petrochemical and Carbon Black Production - Ethylene
        pcbp_A :  {type : Number}, // Petrochemical and Carbon Black Production - Acrylonitrile

        
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

export = mongoose.model('(industrial) chemicalForm', ChemicalSchema);