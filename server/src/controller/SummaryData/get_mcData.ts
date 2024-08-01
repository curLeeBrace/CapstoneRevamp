import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import {get_emission} from '../Dashboard/overview_data'
import { prepareQuery, RequestQueryTypes } from './mobile_combustion';

type MC_DATA = {
    surveyor : string;
    v_type : string;
    v_age : string;
    f_type : string;
    f_consumption : string;
    dateTime : Date;
    ghge : number;

}



const get_mcData = async (req : Request, res : Response) => {

    const year = new Date().getFullYear();
    try {
        

        // dateTime_created : {
        //     $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        //     $lte: new Date(`${year}-12-30T23:59:59.000Z`)
        // },

        const preparedQuery = prepareQuery(req.query as RequestQueryTypes)

        
        const data = await FuelFormSchema.find(preparedQuery).exec();





        if(!data) return res.sendStatus(204);



      

        const filterData:MC_DATA[] = data.map(dt => {
            const ghge = get_emission(dt.survey_data.fuel_type as string, dt.survey_data.liters_consumption);
            return {
                surveyor : dt.surveyor_info.full_name as string,
                f_type : dt.survey_data.fuel_type as string,
                v_age : dt.survey_data.vehicle_age?.toString(),
                v_type : dt.survey_data.vehicle_type as string,
                f_consumption : dt.survey_data.liters_consumption.toString(),
                dateTime : dt.dateTime_created as Date,
                ghge : ghge.ghge
            }
        }) as MC_DATA[]





        return res.status(200).send(filterData)

   

    } catch (error) {
        console.log("get_mcData : ", error);
        return res.sendStatus(500)
    }
   


}



export { get_mcData }