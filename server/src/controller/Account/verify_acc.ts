import { Request, Response, NextFunction } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import TokenSchema from '../../db_schema/TokenSchema';

interface Verify_Req {
    acc_id : string;
    token : string;
}

export const verify_acc = async (req : Request, res : Response) => {
    
    const {acc_id, token} = req.body as Verify_Req;
    console.log("Verification req.body : ", req.body);
    try {
        const verify_acc = await TokenSchema.findOne({acc_id, token}).exec();
        
        if(verify_acc){
            await AccountSchema.findOneAndUpdate({_id : acc_id}, {verified : true}).exec();
            await TokenSchema.findOneAndDelete({acc_id}).exec()
            return res.status(200).send("Account Verified!")
        }

        return res.sendStatus(204);

        
    } catch (error) {
        console.log(error);
    }
}


