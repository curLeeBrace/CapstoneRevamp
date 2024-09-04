import { Request, Response } from 'express';
import { RequestQueryTypes, prepareQuery} from './mobile_combustion';
import WasteWaterFormShema from '../../db_schema/WasteWaterFormShema';
import getAvailableLocations from '../../../custom_funtions/getAvailableLocations';


interface wasteWaterSummary {
    location : {};
    septic_tanks : number;
    openPits_latrines : {
        cat1 : number;
        cat2 : number;
        cat3 : number;
        cat4 : number;
    };
    riverDischarge : {
        cat1 : number;
        cat2 : number;
    }

}




const getWasteWaterSummary = async (req : Request, res : Response) => {
    const {brgy_code, form_type, municipality_code, province_code, selectAll, user_type} = req.query as RequestQueryTypes
    const parent_code = user_type === "s-admin" ? province_code : municipality_code
    const locations = getAvailableLocations(parent_code, user_type);
    const query = prepareQuery(req.query as RequestQueryTypes);
    const wasteWaterData = await WasteWaterFormShema.find(query).exec();




    let wasteWaterSummaries : wasteWaterSummary[] = [];

    locations.forEach(loc => {
        

        let wasteWaterSummary : wasteWaterSummary  = {
            location : loc,
            openPits_latrines : {
                cat1 : 0,
                cat2 : 0,
                cat3 : 0,
                cat4 : 0
            },
            riverDischarge : {
                cat1 : 0,
                cat2 : 0
            },
            septic_tanks : 0
        }

        wasteWaterData.forEach(data => {
            if(user_type === "s-admin") {
                if(loc.city_name === data.surveyor_info.municipality_name){
                    
                    wasteWaterSummary.septic_tanks += data.survey_data.septic_tanks;
                    wasteWaterSummary.openPits_latrines.cat1 += data.survey_data.openPits_latrines.cat1
                    wasteWaterSummary.openPits_latrines.cat2 += data.survey_data.openPits_latrines.cat2
                    wasteWaterSummary.openPits_latrines.cat3 += data.survey_data.openPits_latrines.cat3
                    wasteWaterSummary.openPits_latrines.cat4 += data.survey_data.openPits_latrines.cat4
                    wasteWaterSummary.riverDischarge.cat1 += data.survey_data.riverDischarge.cat1;
                    wasteWaterSummary.riverDischarge.cat2 += data.survey_data.riverDischarge.cat2;

                }
            } else if (user_type === "lgu-admin"){

                if(loc.brgy_name === data.survey_data.brgy_name){

                    wasteWaterSummary.septic_tanks += data.survey_data.septic_tanks;
                    wasteWaterSummary.openPits_latrines.cat1 += data.survey_data.openPits_latrines.cat1
                    wasteWaterSummary.openPits_latrines.cat2 += data.survey_data.openPits_latrines.cat2
                    wasteWaterSummary.openPits_latrines.cat3 += data.survey_data.openPits_latrines.cat3
                    wasteWaterSummary.openPits_latrines.cat4 += data.survey_data.openPits_latrines.cat4
                    wasteWaterSummary.riverDischarge.cat1 += data.survey_data.riverDischarge.cat1;
                    wasteWaterSummary.riverDischarge.cat2 += data.survey_data.riverDischarge.cat2;
                }
            }
        })

       




        wasteWaterSummaries.push(wasteWaterSummary);




    })
  


    return res.status(200).send(wasteWaterSummaries);



}


export default getWasteWaterSummary