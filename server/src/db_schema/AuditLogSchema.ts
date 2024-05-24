import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({

    name : {type : String, required : true},
    lgu_municipality : {type :{
        municipality_name : {type:String, required : true},
        municipality_code : {type:String, required : true},
        province_code : {type:String, required : true},
      },
      required : true
    },
    user_type : {type : String, required : true},
    dateTime : {type : Date, required : true},
    action : {type : String, required : true},

})

export default mongoose.model("audit_log", AuditLogSchema)