import { Request, Response, NextFunction } from "express";
import FuelFormSchema from "../../db_schema/FuelFormSchema";

import getAvailableLocations from "../../../custom_funtions/getAvailableLocations"

import AccountSchema from "../../db_schema/AccountSchema";
import getWasteWaterGHGeSum from "../../../custom_funtions/wasteWaterActions";
import {getIndustrialOverallGHGe} from "../../../custom_funtions/Industrial/industrialAction";

import getAgricultureGHGe from "../../../custom_funtions/agriculture";
import { getStationaryGHGe} from "../../../custom_funtions/stationary"
import MobileCombustionEfactorSchema = require("../../db_schema/EmmisisonFactorsSchema/MobileCombustionEfactorSchema");

import {getFALU_GHGe} from "../../../custom_funtions/forestryLanUse";
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
    // loc_code : String;
    emission : Emission;
}


type DashBoardData = {
    total_surveryor : number;
    total_LGU_admins : number;
    total_LU_surveyors: number;
    total_LU_admins: number;
    table_data: {
        mobileCombustionGHGe : MobileCombustionTableData[],
        wasteWaterGHGe : {
            ghge : number,
            loc_name : string
        }[]
        industrialGHGe : {
            ghge : number,
            loc_name : string
        }[]
        agriculture_cropsGHGe : {
            ghge : number,
            loc_name : string
        }[]
        agriculture_liveStocksGHGe : {
            ghge : number,
            loc_name : string
        }[]
        // stationaryGHGe : number[]
        
        residentialGHGe: {
            ghge : number,
            loc_name : string
        }[]
        commercialGHGe : {
            ghge : number,
            loc_name : string
        }[],
        forestLandUseGHGe : {
            ghge : number,
            loc_name : string
        }[]
       

    }
    total_ghge : number;
    loc_names : string[]

 }
 

 const overview_data = async (req : Request, res : Response) => {

    const {province_code, user_type, municipality_code} = req.params;
    
    try {
            const yearNow = new Date().getFullYear().toString()
            let total_ghge = 0;

            const accounts = user_type === "s-admin" ? await AccountSchema.find({
                'lgu_municipality.province_code' : province_code
            }) : await AccountSchema.find({'lgu_municipality.province_code' : province_code, 'lgu_municipality.municipality_code' : municipality_code});
     
            
            const lgu_admin = accounts.filter(acc => acc.user_type === "lgu_admin");
            const surveyor = accounts.filter(acc => acc.user_type === "surveyor");

            const lu_admin = accounts.filter(acc => acc.user_type === "lu_admin" &&
                acc.lgu_municipality.municipality_name === "Laguna University");

            const lu_surveyor = accounts.filter(acc => acc.user_type === "lu_surveyor" &&
                acc.lgu_municipality.municipality_name === "Laguna University");

            const parent_code = user_type === "s-admin" ? province_code : municipality_code


            let query:any = user_type === "s-admin" ? 
            {
                'surveyor_info.province_code': province_code,
                $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
            }
            : 
            user_type === "lu_admin" ?
            {
                'surveyor_info.municipality_name': "Laguna University",
                $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
            } :
            {
                'surveyor_info.municipality_code': municipality_code,
                $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
            }



           query = {...query,   dateTime_created : {
                $gte: new Date(`${yearNow}-01-01T00:00:00.000Z`),
                $lte: new Date(`${yearNow}-12-30T23:59:59.000Z`)
                }
            }

            
            const locations = getAvailableLocations(parent_code, user_type);
            // console.log(locations)
            
            const mobileComstion_data =  await get_mobileComstion_GHGe(user_type, query, locations);  
            const wasteWaterGHGe = await getWasteWaterGHGeSum(user_type, query, locations);
            const industrialGHGe = await getIndustrialOverallGHGe(user_type, query, locations)
            const agriculture_cropsGHGe = await getAgricultureGHGe(user_type, query, locations, "crops")
            const agriculture_liveStocksGHGe = await getAgricultureGHGe(user_type, query, locations, "liveStocks")
            // const stationaryGHGe = await getStationaryGHGe(user_type, query, locations); 
            const residentialGHGe = await getStationaryGHGe(user_type, query, locations, "residential")
            const commercialGHGe = await getStationaryGHGe(user_type, query, locations, "commercial")
            

            //FALU...///////////////////////////////////////////////////////////////////////////////
            let falu_wood = await getFALU_GHGe(user_type, query, locations, "falu-wood");
            let falu_forestland = await getFALU_GHGe(user_type, query, locations, "falu-forestland");

            // console.log("Forest Wood : ", falu_wood),
            // console.log("ForestLand : ", falu_forestland)
            let forestAndLandUseContainer : {loc_name:string, ghge:number}[] =[] 

            falu_wood.forEach((falu_woodData)=>{
                let total_ghge = 0
                falu_forestland.forEach(falu_forestland => {
                    if(falu_woodData.loc_name === falu_forestland.loc_name){
                        total_ghge += falu_woodData.ghge + falu_forestland.ghge
                    }
                })
                forestAndLandUseContainer.push({
                    loc_name : falu_woodData.loc_name,
                    ghge : total_ghge
                })

            })

            ////////////////////////////////////////////////////////////////////////////////////
            mobileComstion_data.forEach((mb_data, index) => {
                total_ghge += mb_data.emission.ghge
                total_ghge += wasteWaterGHGe[index].ghge
                total_ghge += industrialGHGe[index].ghge
                total_ghge += agriculture_cropsGHGe[index].ghge
                total_ghge += agriculture_liveStocksGHGe[index].ghge
                total_ghge += residentialGHGe[index].ghge
                total_ghge += commercialGHGe[index].ghge

                total_ghge += falu_wood[index].ghge
                total_ghge += falu_forestland[index].ghge

              
            })
                

            // wasteWaterGHGe.forEach(ghge => {
            //     total_ghge += Number(ghge.toFixed(2));
            // })

            // industrialGHGe.forEach(ghge => {
            //     total_ghge += Number(ghge.toFixed(2));
            // })

            
            const response : DashBoardData = {
                    total_LGU_admins : lgu_admin.length,
                    total_surveryor : surveyor.length,
                    total_LU_admins : lu_admin.length,
                    total_LU_surveyors: lu_surveyor.length,
                    table_data: {
                        mobileCombustionGHGe : mobileComstion_data,
                        wasteWaterGHGe : wasteWaterGHGe,
                        industrialGHGe,
                        agriculture_cropsGHGe,
                        agriculture_liveStocksGHGe,
                        // stationaryGHGe,
                        residentialGHGe,
                        commercialGHGe,
                        forestLandUseGHGe : forestAndLandUseContainer
                        
                    },
                    total_ghge,
                    loc_names: locations.map((loc) => user_type === "s-admin" ? loc.city_name : loc.brgy_name),
            }
    
    
            return res.status(200).json(response);



    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }


 }




 // This is mobile combustion function

 const get_mobileComstion_GHGe = async (user_type:string , query : {}, locations : any[], year:string|undefined = new Date().getFullYear().toString()) : Promise<MobileCombustionTableData[]> => {

    const table_data : MobileCombustionTableData[] = [];

 
    const form_data = await FuelFormSchema.find(query);
    // console.log("query : ", query)

    //iterate municipalities


    await Promise.all (
        locations.map(async (loc : Brgys & Municipality, index) => {

            const root_loc_code = user_type === "s-admin" ? loc.city_code : loc.brgy_code;

            let tb_co2e = 0;
            let tb_ch4e = 0;
            let tb_n2oe = 0;
            let tb_ghge = 0;


            // iterate the form data
            await Promise.all (
                form_data.map(async (data) => {

                // check use type
                if(user_type === "s-admin"){
                    //check if root_loc_code === data.surveyor_info.municipality_code
                    if(data.surveyor_info.municipality_code === root_loc_code)  {
                        //compute the municipality emmisions
                        const single_form_emmmsion = await get_MobileCombustionEmission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption, year );
                        const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion
        
                        tb_co2e += co2e;
                        tb_ch4e += ch4e;
                        tb_n2oe += n2oe;
                        tb_ghge += ghge;
                    }

                } else {

                    if(data.survey_data.brgy_code === root_loc_code)  {
                        //compute the municipality emmisions
                        const single_form_emmmsion = await get_MobileCombustionEmission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption, year );
                        const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion
        
                        tb_co2e += co2e;
                        tb_ch4e += ch4e;
                        tb_n2oe += n2oe;
                        tb_ghge += ghge;
                    }
                }


            })
        )



            
            table_data.push({
                loc_name : user_type === "s-admin" ? loc.city_name : loc.brgy_name,
                // loc_code :user_type === "s-admin" ? loc.city_code : loc.brgy_code,
                emission : {
                    co2e : tb_co2e,
                    ch4e : tb_ch4e,
                    n2oe : tb_n2oe,
                    ghge : Number(tb_ghge.toFixed(2))
                }
            })

        })
    )

// Number((Math.trunc(tb_ghge * 100) / 100).toFixed(2)),





    return table_data


 }



 // This is mobile combustion function
 const get_MobileCombustionEmission = async (fuel_type : string,  liters_consumption: number, year:string|undefined = new Date().getFullYear().toString()) : Promise<Emission>  => {

     /*
        ==========================================
            -------Conversion-Factor-----
            co2 = 1
            ch4 = 28
            n20 = 265

         ==========================================
    */
    

    let emission_factors = undefined;

    const mb_efactor = await MobileCombustionEfactorSchema.findOne({fuel_type, year}).exec();

    if(!mb_efactor){
        emission_factors = fuel_type === "diesel" ? {
            co2 : 2.66,
            ch4 : 4.0e-4,
            n2o : 2.18e-5,
        } : {
            co2 : 2.07,
            ch4 : 3.2e-4,
            n2o : 1.9e-4,
        }
    } else {
        const {co2, ch4, n2o} = mb_efactor;
        emission_factors = {
            co2, ch4, n2o
        }
    }
 

   
    const  co2e = (liters_consumption * (emission_factors.co2)) / 1000;
    const  ch4e =  (liters_consumption * (emission_factors.ch4)) / 1000;
    const  n2oe =  (liters_consumption * (emission_factors.n2o)) / 1000;

    const emission : Emission = {   
        co2e,
        ch4e,
        n2oe, 
        ghge : (co2e * 1) + (ch4e * 28) + (n2oe * 265)   
    }

    return emission

 }










export {
    overview_data, 
    get_MobileCombustionEmission, 
    get_mobileComstion_GHGe,
}






