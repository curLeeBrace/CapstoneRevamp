import { Request, Response } from "express";
import FuelFormSchema from "../../db_schema/FuelFormSchema";





const getMobileCombustionNotification = async (req : Request, res : Response) => {

    //For Response
    //surveyor name
    //img_id
    const {municipality_code} = req.query;


    try {

        const mc_data = await FuelFormSchema.find({
            "survey_data.status" : "1",
            "surveyor_info.municipality_code" : municipality_code
        }).exec()

        if(mc_data.length <= 0 || !mc_data) return res.sendStatus(204);
        console.log("mc_data", mc_data)
        const response = mc_data.map(data => {

            return {
                surveyor_name : data.surveyor_info.full_name,
                img_id :  data.surveyor_info.img_id
            }
        })


        return res.status(200).send(response);
        
    } catch (error) {
        console.log("GET NOTIFICATION : ", error);
        return res.sendStatus(500);
    }
}

export {getMobileCombustionNotification}