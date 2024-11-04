import { Request, Response, NextFunction } from "express";
import getWasteWaterGHGeSum from "../../../custom_funtions/wasteWaterActions";
import {getIndustrialOverallGHGe} from "../../../custom_funtions/Industrial/industrialAction";
import getAgricultureGHGe from "../../../custom_funtions/agriculture";
import {getStationaryGHGe} from "../../../custom_funtions/stationary";




const ghgeSummary = (req:Request, res:Response) => {

    try {
        const {
            user_type,
            province_code,
            municipality_name,
            brgy_name,
        } = req.query;

        ///Thingking about, what prams to pass in this file....
        // it about filtering ghge of filtered locations... 






    } catch (error) {
        console.log("GHGe Summary", error);
        return res.sendStatus(500);
    }




}


export default ghgeSummary
