import mongoose from "mongoose";

const FALU_EfactorSchema = new mongoose.Schema({
    wood : {type : {
        fuelwood_co2 : {type : Number, default : 0},
        charcoal_co2 : {type : Number, default : 0},
        construction_co2 : {type : Number, default : 0},
        novelties_co2 : {type : Number, default : 0},
    }, default : {
        fuelwood_co2 : 0,
        charcoal_co2 : 0,
        construction_co2 : 0,
        novelties_co2 : 0,
    }},

    forestland : {type : {
        ufA_co2 : {type : Number, default : 0},
        uaG_co2 : {type : Number, default : 0},
        laBA_co2 : {type : Number, default : 0},
    }, default : {
        ufA_co2 : 0,
        uaG_co2 : 0,
        laBA_co2 : 0,
    }},
    year : {type : String, required : true},
})


export default mongoose.model("falu_efactor", FALU_EfactorSchema);