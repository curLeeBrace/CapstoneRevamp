import mongoose from "mongoose";


const AccountSchema = new mongoose.Schema({

    email : {type : String, required : true, unique: true},
    pass : { type: String, required: true },
    f_name : {type:String, required : true},
    m_name : {type:String, default : ""},
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
    user_type : {type : String, required : true}, 
    verified : { type: Boolean, default: false },
})


export = mongoose.model("account_collection", AccountSchema)

