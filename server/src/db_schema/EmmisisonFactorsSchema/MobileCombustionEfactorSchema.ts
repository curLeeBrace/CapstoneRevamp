import mongoose from "mongoose";

const MobileCombustionEfactorSchema = new mongoose.Schema({
    
    fuel_type : {type : String, required : true},
    co2 : {type : Number, required : true},
    ch4 : {type : Number, required : true},
    n2o : {type : Number, required : true},
    
})


export = mongoose.model("mobileCombustionEfactor", MobileCombustionEfactorSchema);


