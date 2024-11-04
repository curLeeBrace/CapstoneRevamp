import { Request, Response, NextFunction } from "express";
import getWasteWaterGHGeSum from "../../../custom_funtions/wasteWaterActions";
import {getIndustrialOverallGHGe} from "../../../custom_funtions/Industrial/industrialAction";
import getAgricultureGHGe from "../../../custom_funtions/agriculture";
import {getStationaryGHGe} from "../../../custom_funtions/stationary";
import {get_mobileComstion_GHGe} from "../Dashboard/overview_data"
import getAvailableLocations from "../../../custom_funtions/getAvailableLocations"



const ghgeSummary = async (req:Request, res:Response) => {

    try {
        const {
            user_type,
            municipality_code,
            brgy_code,
            year,
            province_code,
        } = req.query as any;

        ///Thingking about, what prams to pass in this file....
        // it about filtering ghge of filtered locations... 

    

        //prepare query
        let query = undefined;

        if(user_type === "s-admin"){
            query = municipality_code ? {
                "surveyor_info.municipality_code" : municipality_code,
                dateTime_created : {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                },
                $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
            } : {
                dateTime_created : {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                },
                $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
            };



        } else {
            query = brgy_code ? {
                "survey_data.brgy_code" : brgy_code, 
                "surveyor_info.municipality_code" : municipality_code,
                dateTime_created : {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                },
                $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
            } : 
            {
                "surveyor_info.municipality_code" : municipality_code,
                dateTime_created : {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                },
                $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}]
            };

        }

        //prepare response
        const parent_code = user_type === "s-admin" ? province_code : municipality_code
        const locations = getAvailableLocations(parent_code, user_type);



        const mobileComstion_data =  await get_mobileComstion_GHGe(user_type, query, locations);  
        const wasteWaterGHGe = await getWasteWaterGHGeSum(user_type, query, locations);
        const industrialGHGe = await getIndustrialOverallGHGe(user_type, query, locations)
        const agriculture_cropsGHGe = await getAgricultureGHGe(user_type, query, locations, "crops")
        const agriculture_liveStocksGHGe = await getAgricultureGHGe(user_type, query, locations, "liveStocks")
        const stationaryGHGe = await getStationaryGHGe(user_type, query, locations);


        let total_ghge = 0;
        mobileComstion_data.forEach((mb_data, index) => {
            total_ghge += Number(mb_data.emission.ghge.toFixed(2));
            total_ghge += Number(wasteWaterGHGe[index].toFixed(2));
            total_ghge += Number(industrialGHGe[index].toFixed(2));
            total_ghge += Number(agriculture_cropsGHGe[index].toFixed(2));
            total_ghge += Number(agriculture_liveStocksGHGe[index].toFixed(2));
            total_ghge += Number(stationaryGHGe[index].toFixed(2))
        })


        return res.status(200).send({
            mobileCombustionGHGe : mobileComstion_data,
            wasteWaterGHGe : wasteWaterGHGe,
            industrialGHGe,
            agriculture_cropsGHGe,
            agriculture_liveStocksGHGe,
            stationaryGHGe,
            total_ghge
        })










    } catch (error) {
        console.log("GHGe Summary", error);
        return res.sendStatus(500);
    }




}


export default ghgeSummary
