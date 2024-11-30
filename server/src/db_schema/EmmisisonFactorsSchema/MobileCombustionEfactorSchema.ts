import mongoose from "mongoose";

const MobileCombustionEfactorSchema = new mongoose.Schema({
    
    fuel_type : {type : String, required : true},
    co2 : {type : Number, required : true},
    ch4 : {type : Number, required : true},
    n2o : {type : Number, required : true},
    year : {type : String, required : true},
    
})


export = mongoose.model("mobileCombustion_efactor", MobileCombustionEfactorSchema);


