import mongoose from "mongoose";
/*
    email : "",
    f_name : "",
    m_name : "",
    l_name : "",
    date : "",

    address : {
      brgy_name : "",
      municipality_code : "",
      municipality_name : "",
      province_code : "",
    } as Address,

    img_name :"",
    lgu_municipality :"",
    user_type :"",


*/


const AccountSchema = new mongoose.Schema({

    email : {type : String, required : true, unique: true},
    pass : { type: String, required: true },
    f_name : {type:String, required : true},
    m_name : {type:String},
    l_name : {type:String, required : true},

    address : {type :{
        brgy_name : {type:String, required : true},
        municipality_name : {type:String, required : true},
      }, 
      required : true
    },

    lgu_municipality : {type :{
        municipality_name : {type:String, required : true},
        municipality_code : {type:String, required : true},
        province_code : {type:String, required : true},
      },
      required : true
    },

    img_name : {type : String, required : true},
    user_type : {type : String, required : true}, //"0-user | 1-admin | 2-super_admin"
    verified : { type: Boolean, default: false },
})


export = mongoose.model("account_collection", AccountSchema)

