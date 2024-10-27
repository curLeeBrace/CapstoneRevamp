import mongoose from 'mongoose'


const WasteWaterForm = new mongoose.Schema({
    survey_data : { type : {
        form_type : {type : String, required : true},

        septic_tanks : {type : Number,  required : true},

        openPits_latrines : {type : {
            cat1 : {type : Number,  required : true}, //dry climate, ground water table lower than latrine, small family (2-5 people)		
            cat2 : {type : Number,  required : true}, // dry climate, ground water table lower than latrine, communal		
            cat3 : {type : Number,  required : true}, // wet climate/flush water use, ground water table than latrine		
            cat4 : {type : Number,  required : true}, // regular sediment removal for fertilizer		
        }, required : true},
        riverDischarge : {type : {
            cat1 : {type : Number,  required : true},// Stagnant oxygen deficient rivers and lakes
            cat2 : {type : Number,  required : true},//Rivers, lakes, estuaries

        }, required : true},

        brgy_name  :{type : String, required : true},
        brgy_code : {type : String, required : true},
        status : {type : String, required : true, default : "0"}
        },required : true
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


export = mongoose.model('wasteWaterForm', WasteWaterForm);