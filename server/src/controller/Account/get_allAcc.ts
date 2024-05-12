import { Request, Response, NextFunction } from "express";
import AccountSchema from '../../db_schema/AccountSchema';

const get_allAcc =  async(req :Request, res : Response) => {

    try {
        
        const accs = await AccountSchema.find({acc_type : "1"}).exec()
        
        // console.log("acc_email : ", acc_email)
        if(accs){
            let all_acc:any[] = [];

            accs.forEach(acc => {
                all_acc.push({
                    email : acc.email,
                    names : acc.name.first + " " + acc.name.last,
                    adminType : acc.admin_type,
                    acc_scope : acc.acc_scope
            })
            });
        
            return res.status(200).json(all_acc);
        }

        return res.status(204)

    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }



}

export {get_allAcc}