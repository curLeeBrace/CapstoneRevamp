import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    acc_id : {type : String, required : true, unique: true},
    token : {type : String, required : true, unique: true}
})

export = mongoose.model("token_collections", TokenSchema)