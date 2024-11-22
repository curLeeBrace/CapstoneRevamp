import mongoose from "mongoose";

const IndustrialEfactorSchema = new mongoose.Schema({
    industry_type : {type : String, required : true},
    e_factor : {type : [{
        CO2 : {type : Number, default : 0},
        CH4 : {type : Number, default : 0},
        CF4 : {type : Number, default : 0},
        C2F6_1st : {type : Number, default : 0},
        CHF3 : {type : Number, default : 0},
        C3F8 : {type : Number, default : 0},
        C2F6_2nd : {type : Number,  default : 0},
        NF3 : {type : Number, default : 0},
        SF6 : {type : Number, default : 0},
        C6F14 : {type : Number, default : 0},
    }], required : true}
})


export = mongoose.model("industrial_efactor", IndustrialEfactorSchema);