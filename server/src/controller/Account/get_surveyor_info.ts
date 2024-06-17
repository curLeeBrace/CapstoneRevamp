import { Request, Response } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import FuelFormSchema from "../../db_schema/FuelFormSchema";


const get_surveyor_info = async (req : Request, res : Response) => {

    const {municipality_code, get_all} = req.params;
    // console.log(get_all, typeof(get_all))
    
    try {
        const query = get_all === "false" ? {'lgu_municipality.municipality_code' : municipality_code, user_type:"surveyor"} : {user_type : "surveyor"};

        const accs =  await AccountSchema.find(query).exec();
        const fuelFrom = await FuelFormSchema.find({});

        if(!accs) return res.sendStatus(204);
        


        let user_infos : any [] = []

        accs.forEach((acc)=>{
            let survey_count = 0;

            fuelFrom.forEach(fuel => {
                if(fuel.surveyor_info.email === acc.email){
                    survey_count++;
                }
            })


            user_infos.push({
                full_name : acc.f_name + " " + acc.l_name,
                img_name : acc.img_name,
                municipality_name : acc.lgu_municipality.municipality_name,
                user_type : acc.user_type,
                survey_count
            })
         
        })



        return res.status(200).json(user_infos)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("cannot get the account!");
    }


}


export {get_surveyor_info}