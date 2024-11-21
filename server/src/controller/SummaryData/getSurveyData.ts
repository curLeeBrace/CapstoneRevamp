import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from '../../db_schema/WasteWaterFormShema';
import {get_MobileCombustionEmission} from '../Dashboard/overview_data'
import { prepareQuery, RequestQueryTypes } from './mobile_combustion';
import {PopulationUsingTheSystems, getWasteWaterData_perSurvey} from '../../../custom_funtions/wasteWaterActions';




type MC_DATA = {
    // surveyor : string;
    form_id : string;
    email : string;
    municipality_name : string;
    brgy_name : string;
    
    v_type : string;
    v_age : string;
    f_type : string;
    f_consumption : string;
    dateTime : Date;
    ghge : number;

}


// type WasteWaterDataTypes = {
//     populationUsingTheSystem : PopulationUsingTheSystems;
//     wasteWaterGHGe_perSurvey : number;
// }



const getSurveyData = async (req : Request, res : Response) => {
    const {province_code, user_type, municipality_code} = req.query;
    const {form_category} = req.params

    const parent_code = user_type === "s-admin" ? province_code : municipality_code
    let response:any[] = []

    try {

        
        const preparedQuery = prepareQuery(req.query as RequestQueryTypes)

        await FuelFormSchema.find(preparedQuery).exec();
        
        if(form_category === "mobile-combustion") {

            const data = await FuelFormSchema.find(preparedQuery).exec() 
            if(!data) return res.sendStatus(204);

            response = data.map((dt:any) => {
                const ghge = get_MobileCombustionEmission(dt.survey_data.fuel_type as string, dt.survey_data.liters_consumption);
                const {email, municipality_name} = dt.surveyor_info 

                return {
                    form_id : dt._id,
                    email,
                    municipality_name,
                    municipality_code,
                    brgy_name : dt.survey_data.brgy_name as string,
                    
                    f_type : dt.survey_data.fuel_type as string,
                    v_age : dt.survey_data.vehicle_age?.toString(),
                    v_type : dt.survey_data.vehicle_type as string,
                    f_consumption : dt.survey_data.liters_consumption.toString(),
                    dateTime : dt.dateTime_created as Date,
                    ghge : ghge.ghge,
                }
            }) as MC_DATA[]

        } else if (form_category === "waste-water"){

            const wasteWaterDatas = await getWasteWaterData_perSurvey(user_type as string, preparedQuery);
            if(!wasteWaterDatas) return res.sendStatus(204);
            response = wasteWaterDatas

        }
    
        



        return res.status(200).send(response)

    } catch (error) {
        console.log("get_mcData : ", error);
        return res.sendStatus(500)
    }
   


}



export { getSurveyData }