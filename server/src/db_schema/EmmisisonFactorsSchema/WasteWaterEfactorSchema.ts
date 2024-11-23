import mongoose from "mongoose";

const WasteWaterEfactorSchema = new mongoose.Schema({
    surveyType : {type : String, required : true},
    uncollected : {type : {
        percapitaBODgeneration_perday : {type:Number, required : true},
        percapitaBODgeneration_peryear : {type:Number, required : true},
        cfi_BOD_dischargersSewer : {type:Number, required : true},

        methane_correction_factor : {type : {
            septic_tanks : {type : Number,  required : true},

            openPits_latrines : {type : {
                cat1 : {type : Number,  default : 0}, //dry climate, ground water table lower than latrine, small family (2-5 people)		
                cat2 : {type : Number,  default : 0}, // dry climate, ground water table lower than latrine, communal		
                cat3 : {type : Number,  default : 0}, // wet climate/flush water use, ground water table than latrine		
                cat4 : {type : Number,  default : 0}, // regular sediment removal for fertilizer		
            }, required : true},
            riverDischarge : {type : {
                cat1 : {type : Number,  default : 0},// Stagnant oxygen deficient rivers and lakes
                cat2 : {type : Number,  default : 0},//Rivers, lakes, estuaries

            }, required : true},
        }, required : true}

    }, required : true},
    max_ch4Production : {type:Number, required : true},

})

export = mongoose.model("wastewater_efactors", WasteWaterEfactorSchema);
