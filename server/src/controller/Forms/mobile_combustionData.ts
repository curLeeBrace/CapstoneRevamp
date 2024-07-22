import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";




const mobile_combustionData = async (req:Request, res:Response) => {

    const {
        municipality_code,
        brgy_code,
        surveyType,
    } = req.query

    try {
        const mc_data = await FuelFormSchema.find({
            "survey_data.form_type" : surveyType,
            "survey_data.brgy_code" : brgy_code,
            "surveyor_info.municipality_code" : municipality_code
        }).exec();
    
        if(!mc_data) return res.sendStatus(204);
    
        
        const response = mc_data.map(data => {
    
            return {
                survey_data : data.survey_data,
                dateTime_created : data.dateTime_created,
                form_id : data._id
            }
        }).sort((a:any,b:any)=> a.dateTime_created = b.dateTime_created);
    
        return res.status(200).send(response);
    } catch (error) {
        console.log("mc_data : ", error);
        return res.sendStatus(500);
    }
    

}





const oneMobileCombustionData = async (req:Request, res:Response) =>{
    
    const {
       form_id
    } = req.query
    
    try {
        

        const mc_data = await FuelFormSchema.findById(form_id).exec()
        
        if(!mc_data) return res.sendStatus(204);


        return res.status(200).send({
            survey_data : mc_data.survey_data,
            form_id : mc_data._id
        })




    } catch (error) {
        console.log("oneMobileCombustionData : ", error);
        return res.sendStatus(500);
    }
}





export {mobile_combustionData, oneMobileCombustionData}