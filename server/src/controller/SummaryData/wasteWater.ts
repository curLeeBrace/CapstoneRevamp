import { Request, Response } from 'express';
import { RequestQueryTypes, prepareQuery} from './mobile_combustion';
import WasteWaterFormShema from '../../db_schema/WasteWaterFormShema';
import getAvailableLocations from '../../../custom_funtions/getAvailableLocations';
// import getWasteWaterGHGeSum from '../../../custom_funtions/wasteWaterActions';

interface wasteWaterSummary {
    location : string;
    septic_tanks : number;
    openPits_latrines : {
        cat1 : number;
        cat2 : number
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
    // const wasteWaterGHGe_perLocations = await getWasteWaterGHGeSum(user_type, query, locations);
    
    // const totalGHGe = getGHGeSum(wasteWaterGHGe_perLocations);

    const location_names = locations.map(loc => {
 
        return user_type === "s-admin" ? loc.city_name : loc.brgy_name
    })


    let wasteWaterSummaries : wasteWaterSummary[] = [];

    location_names.forEach(loc => {
        

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
                if(loc === data.surveyor_info.municipality_name){
                    
                    wasteWaterSummary.septic_tanks += data.survey_data.septic_tanks;
                    wasteWaterSummary.openPits_latrines.cat1 += data.survey_data.openPits_latrines.cat1
                    wasteWaterSummary.openPits_latrines.cat2 += data.survey_data.openPits_latrines.cat2
                    wasteWaterSummary.openPits_latrines.cat3 += data.survey_data.openPits_latrines.cat3
                    wasteWaterSummary.openPits_latrines.cat4 += data.survey_data.openPits_latrines.cat4
                    wasteWaterSummary.riverDischarge.cat1 += data.survey_data.riverDischarge.cat1;
                    wasteWaterSummary.riverDischarge.cat2 += data.survey_data.riverDischarge.cat2;

                }
            } else if (user_type === "lgu_admin"){

                if(loc === data.survey_data.brgy_name){

                    // console.log("SEPTIC : ", data.survey_data.septic_tanks)
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

       console.log("WASTE WATER : ", wasteWaterSummary);

        wasteWaterSummaries.push(wasteWaterSummary);



    })
  

    return res.status(200).send(wasteWaterSummaries);


}



//****useless*****
// const getGHGeSum = (ghges : number[]) : number=> {

//     let total_ghge = 0;
//         ghges.forEach(ghge => {
//             total_ghge += ghge
//         });

//     return total_ghge

// }


export default getWasteWaterSummary