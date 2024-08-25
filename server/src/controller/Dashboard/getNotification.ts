import { Request, Response } from "express";
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from "../../db_schema/WasteWaterFormShema";



type ResponseTypes = {
    surveyor_name : string
    img_id : string
    form_id : string
    survey_data : any
}




const getNotification = async (req : Request, res : Response) => {

    //For Response
    //surveyor name
    //img_id
    const {municipality_code} = req.query;

    try {
        const query = {
            "survey_data.status" : "1",
            "surveyor_info.municipality_code" : municipality_code
        }
        const mobileCombustion_formData = await FuelFormSchema.find(query).exec();
        const wasteWater_formData = await WasteWaterFormShema.find(query).exec();

   


        if(mobileCombustion_formData.length <= 0 && wasteWater_formData.length <= 0) return res.sendStatus(204);

        const mobileCombustionResponse = prepareResponse(mobileCombustion_formData, "mobile-combustion");
        const wasteWaterResponse = prepareResponse(wasteWater_formData, "waste-water");
        const response = [...mobileCombustionResponse, ...wasteWaterResponse]


        return res.status(200).send(response);
        
    } catch (error) {
        console.log("GET NOTIFICATION : ", error);
        return res.sendStatus(500);
    }
}





const prepareResponse = (form_data : any[], form_category : string) : ResponseTypes[]  => {
    
        const response = form_data.map(data => {
            return {
                form_category,
                surveyor_name : data.surveyor_info.full_name,
                img_id :  data.surveyor_info.img_id,
                form_id : data._id,
                survey_data : data.survey_data
            }
        })

        return response

}

export {getNotification}