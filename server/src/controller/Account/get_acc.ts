import { Request, Response } from "express";
import AccountSchema from "../../db_schema/AccountSchema";



const get_acc = async (req : Request, res : Response) => {

    const {municipality_code, user_type, get_all} = req.params;
    // console.log(get_all, typeof(get_all))
    
    try {
        const query = get_all === "false" ? {'lgu_municipality.municipality_code' : municipality_code, user_type:user_type} : {user_type : user_type};

        const accs =  await AccountSchema.find(query).exec();
        
        if(!accs) return res.sendStatus(204);
        
        const filterAcc = accs.map((acc)=>{
           return {
                full_name : acc.f_name + " " + acc.l_name,
                img_name : acc.img_name,
                municipality_name : acc.lgu_municipality.municipality_name,
                user_type : acc.user_type

            }
        })
        return res.status(200).json(filterAcc)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("cannot get the account!");
    }


}


export {get_acc}