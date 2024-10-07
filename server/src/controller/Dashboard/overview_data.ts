import { Request, Response, NextFunction } from "express";
import FuelFormSchema from "../../db_schema/FuelFormSchema";

import getAvailableLocations from "../../../custom_funtions/getAvailableLocations"

import AccountSchema from "../../db_schema/AccountSchema";
import getWasteWaterGHGeSum from "../../../custom_funtions/wasteWaterActions";
import {getIndustrialOverallGHGe} from "../../../custom_funtions/Industrial/industrialAction";
import getAgricultureGHGe from "../../../custom_funtions/agriculture";

interface Municipality {
    city_code : String;
    city_name : String;
    province_code : String;
}



interface Brgys {
    brgy_code : String;
    brgy_name : String;
    city_code : String;
}




export type Emission = {
    co2e : number;
    ch4e : number;
    n2oe : number;
    ghge : number;
}

export type MobileCombustionTableData = {
    loc_name : String;
    loc_code : String;
    emission : Emission;
}


type DashBoardData = {
    total_surveryor : number;
    total_LGU_admins : number;
    table_data: {
        mobileCombustionGHGe : MobileCombustionTableData[],
        wasteWaterGHGe : number[]
        industrialGHGe : number[]
        agriculture_cropsGHGe : number[]
        agriculture_liveStocksGHGe : number[]

    }
    total_ghge : number;

 }
 

 const overview_data = async (req : Request, res : Response) => {

    const {province_code, user_type, municipality_code} = req.params;

    try {

            let total_ghge = 0;

            const accounts = user_type === "s-admin" ? await AccountSchema.find({
                'lgu_municipality.province_code' : province_code
            }) : await AccountSchema.find({'lgu_municipality.province_code' : province_code, 'lgu_municipality.municipality_code' : municipality_code});
     

            const lgu_admin = accounts.filter(acc => acc.user_type === "lgu_admin");
            const surveyor = accounts.filter(acc => acc.user_type === "surveyor");


            const parent_code = user_type === "s-admin" ? province_code : municipality_code

            const query = user_type === "s-admin" ? 
                {
                    'surveyor_info.province_code': province_code,
                    $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
                }
            : 
                {
                    'surveyor_info.municipality_code': municipality_code,
                    $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
                }

            
            const locations = getAvailableLocations(parent_code, user_type);
            
            const mobileComstion_data =  await get_mobileComstion_data(user_type, query, locations);  
            const wasteWaterGHGe = await getWasteWaterGHGeSum(user_type, query, locations);
            const industrialGHGe = await getIndustrialOverallGHGe(user_type, query, locations)
            const agriculture_cropsGHGe = await getAgricultureGHGe(user_type, query, locations, "crops")
            const agriculture_liveStocksGHGe = await getAgricultureGHGe(user_type, query, locations, "liveStocks")
            



            mobileComstion_data.forEach((mb_data, index) => {
                total_ghge += Number(mb_data.emission.ghge.toFixed(2));
                total_ghge += Number(wasteWaterGHGe[index].toFixed(2));
                total_ghge += Number(industrialGHGe[index].toFixed(2));
                total_ghge += Number(agriculture_cropsGHGe[index].toFixed(2));
                total_ghge += Number(agriculture_liveStocksGHGe[index].toFixed(2));
            })

            // wasteWaterGHGe.forEach(ghge => {
            //     total_ghge += Number(ghge.toFixed(2));
            // })

            // industrialGHGe.forEach(ghge => {
            //     total_ghge += Number(ghge.toFixed(2));
            // })


            agriculture_cropsGHGe





            
            const response : DashBoardData = {
                    total_LGU_admins : lgu_admin.length,
                    total_surveryor : surveyor.length,
                    table_data: {
                        mobileCombustionGHGe : mobileComstion_data,
                        wasteWaterGHGe : wasteWaterGHGe,
                        industrialGHGe,
                        agriculture_cropsGHGe,
                        agriculture_liveStocksGHGe

                    },
                    total_ghge,
            }
    
    
            return res.status(200).json(response);



    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }


 }











 // This is mobile combustion function

 const get_mobileComstion_data = async (user_type:string , query : {}, locations : any[]) : Promise<MobileCombustionTableData[]> => {

    const table_data : MobileCombustionTableData[] = [];

    
    



   

    const form_data = await FuelFormSchema.find(query);
    // console.log("query : ", query)

    //iterate municipalities



    locations.forEach((loc : Brgys & Municipality, index) => {

        const root_loc_code = user_type === "s-admin" ? loc.city_code : loc.brgy_code;

        let tb_co2e = 0;
        let tb_ch4e = 0;
        let tb_n2oe = 0;
        let tb_ghge = 0;


        // iterate the form data
        form_data.forEach(data => {

            // check use type
            if(user_type === "s-admin"){
                //check if root_loc_code === data.surveyor_info.municipality_code
                if(data.surveyor_info.municipality_code === root_loc_code)  {
                    //compute the municipality emmisions
                    const single_form_emmmsion = get_emission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                    const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion
    
                    tb_co2e += co2e;
                    tb_ch4e += ch4e;
                    tb_n2oe += n2oe;
                    tb_ghge += ghge;
                }

            } else {

                if(data.survey_data.brgy_code === root_loc_code)  {
                    //compute the municipality emmisions
                    const single_form_emmmsion = get_emission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                    const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion
    
                    tb_co2e += co2e;
                    tb_ch4e += ch4e;
                    tb_n2oe += n2oe;
                    tb_ghge += ghge;
                }
            }


        })



        
        table_data.push({
            loc_name : user_type === "s-admin" ? loc.city_name : loc.brgy_name,
            loc_code :user_type === "s-admin" ? loc.city_code : loc.brgy_code,
            emission : {
                co2e : tb_co2e,
                ch4e : tb_ch4e,
                n2oe : tb_n2oe,
                ghge : tb_ghge,
            }
        })

    });







    return table_data


 }



 // This is mobile combustion function
 const get_emission = (fuel_type : string,  liters_consumption: number) : Emission  => {

     /*
        ==========================================
            -------Conversion-Factor-----
            co2 = 1
            ch4 = 28
            n20 = 265

         ==========================================
    */

    const emission_factors = fuel_type === "diesel" ? {
        co2 : 2.66,
        ch4 : 4.0e-4,
        n2o : 2.18e-5,
    } : {
        co2 : 2.07,
        ch4 : 3.2e-4,
        n2o : 1.9e-4,
    }


    const  co2e = (liters_consumption * emission_factors.co2) / 1000;
    const  ch4e =  (liters_consumption * emission_factors.ch4) / 1000;
    const  n2oe =  (liters_consumption * emission_factors.n2o) / 1000;

    const emission : Emission = {   
        co2e,
        ch4e,
        n2oe, 
        ghge : (co2e * 1) + (ch4e * 28) + (n2oe * 265)   
    }

    return emission

 }










export {overview_data, get_emission}






