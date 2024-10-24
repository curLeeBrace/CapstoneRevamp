import { Request, Response } from "express";
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from "../../db_schema/WasteWaterFormShema";
import MineralSchema from "../../db_schema/Industrial/MineralSchema"
import ChemicalSchema from "../../db_schema/Industrial/ChemicalSchema"
import MetalSchema from "../../db_schema/Industrial/MetalSchema"
import ElectronicsSchema = require("../../db_schema/Industrial/ElectronicsSchema");
import OthersSchema = require("../../db_schema/Industrial/OthersSchema");

import AgricultureCrops = require("../../db_schema/Agriculture/AgricultureCrops");
import AgricultureLiveStock = require("../../db_schema/Agriculture/AgricultureLiveStock");


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
    const {municipality_code, user_type} = req.query;

    try {

        const status = user_type == "lgu_admin" ? "1" : "2"


    




        const query = {
            "survey_data.status" : status,
            "surveyor_info.municipality_code" : municipality_code
        }
        const mobileCombustion_formData = await FuelFormSchema.find(query).exec();
        const wasteWater_formData = await WasteWaterFormShema.find(query).exec();

        const mineral_formData = await MineralSchema.find(query).exec();
        const chemical_formData = await ChemicalSchema.find(query).exec();
        const metal_formData =  await MetalSchema.find(query).exec();
        const electronics_formData = await ElectronicsSchema.find(query).exec();
        const others_formData = await OthersSchema.find(query).exec();
        const cropsFormData = await AgricultureCrops.find(query).exec();
        const livestocksData = await AgricultureLiveStock.find(query).exec();

   


        // if(mobileCombustion_formData.length <= 0 && wasteWater_formData.length <= 0 &&) return res.sendStatus(204);

        const mobileCombustionResponse = prepareResponse(mobileCombustion_formData, "mobile-combustion");
        const wasteWaterResponse = prepareResponse(wasteWater_formData, "waste-water");

        const mineralResponse = prepareResponse(mineral_formData, "industrial-mineral");
        const chemicalResponse = prepareResponse(chemical_formData, "industrial-chemical");
        const metalResponse = prepareResponse(metal_formData, "industrial-metal");
        const electronicsResponse = prepareResponse(electronics_formData, "industrial-electronics");
        const othersResponse = prepareResponse(others_formData, "industrial-others");

        const cropsResponse = prepareResponse(cropsFormData, "agriculture-crops");
        const livestocksResponse = prepareResponse(livestocksData, "agriculture-livestocks");

        const response = [
            ...mobileCombustionResponse, 
            ...wasteWaterResponse, 
            ...mineralResponse, 
            ...chemicalResponse,
            ...metalResponse,
            ...electronicsResponse,
            ...othersResponse,
            ...cropsResponse,
            ...livestocksResponse
        ]


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