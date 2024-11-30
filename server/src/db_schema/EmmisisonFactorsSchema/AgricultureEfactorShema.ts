import mongoose from "mongoose";

const AgricultureEfactorShema = new mongoose.Schema({
    
    agriculture_type : {type : String, required : true},
    e_factors : {type : [{
        co2 : {type : Number, default : 0},
        ch4 : {type : Number, default : 0},
        n2o : {type : Number, default : 0},
    }], required : true},
    year : {type : String, required : true},


    
    
})


export = mongoose.model("agriculture_efactor", AgricultureEfactorShema);

