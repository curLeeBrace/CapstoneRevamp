import {Request, Response} from "express"
import AccountSchema from "../../db_schema/AccountSchema"


const changePass = async(req : Request, res : Response)=>{
    const {newPass, email} = req.body;
    console.log(req.body)
    try {
        const acc_info = await AccountSchema.findOneAndUpdate({email}, {pass : newPass}).exec()
        console.log("acc_info", acc_info)
        if(acc_info){
            return res.sendStatus(200);
        } else {
            return res.sendStatus(204)
        }
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

export {changePass}