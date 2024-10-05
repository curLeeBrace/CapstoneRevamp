import mongoose from 'mongoose'


const AgricultureForm = new mongoose.Schema({
    survey_data : { type : {

  
       

        live_stock :{type : {
            buffalo  : {type : Number, required : true},//
            cattle : {type : Number, required : true},//
            goat : {type : Number, required : true},//
            horse : {type : Number, required : true},//
            poultry : {type : Number, required : true},//
            swine : {type : Number, required : true},//
            non_dairyCattle :{type : Number, required : true}

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
    dateTime_edited : {type : Date}
})


export = mongoose.model('(agriculture) liveStocks', AgricultureForm);