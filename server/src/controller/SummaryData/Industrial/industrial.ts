import { Request, Response } from 'express';

import getAvailableLocations from '../../../../custom_funtions/getAvailableLocations';



import ChemicalSchema from '../../../db_schema/Industrial/ChemicalSchema';
import MineralSchema  from '../../../db_schema/Industrial/MineralSchema';

import MetalSchema  from '../../../db_schema/Industrial/MetalSchema';
import ElectronicsSchema  from '../../../db_schema/Industrial/ElectronicsSchema';
import OthersSchema = require('../../../db_schema/Industrial/OthersSchema');




type RequestQueryTypes = {
    user_type : "s-admin" | "lgu_admin"
    industry_type : "all" | "mineral" | "chemical" | "metal" | "electronics" | "others";
    municipality_code : string;
    prov_code : string;
    year : string;
}


const getIndustrialSummary = async (req: Request, res:Response) => {


    const {industry_type, municipality_code, user_type, prov_code, year} = req.query as RequestQueryTypes

    const query = user_type === "s-admin" ? 
    {
        "surveyor_info.province_code" : prov_code,
        dateTime_created : {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-30T23:59:59.000Z`)
        },

    } 
    : 
    {
        "surveyor_info.municipality_code" : municipality_code,
        dateTime_created : {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-30T23:59:59.000Z`)
        },

    }



    let industryData : any[] = [];
    
    if(industry_type === "mineral"){
        industryData = await MineralSchema.find(query).exec();
    } else if (industry_type === "chemical"){
        industryData = await ChemicalSchema.find(query).exec();
    } else if (industry_type === "metal") {
        industryData = await MetalSchema.find(query).exec();
    } else if (industry_type === "electronics"){
        industryData = await ElectronicsSchema.find(query).exec();
    } else if (industry_type === "others") {
        industryData = await OthersSchema.find(query).exec();
    } else {

        const mineral_data = await MineralSchema.find(query).exec();
        const chemical_data = await ChemicalSchema.find(query).exec();
        const metal_data = await MetalSchema.find(query).exec();
        const electronics_data = await ElectronicsSchema.find(query).exec();
        const others_data = await OthersSchema.find(query).exec();

        industryData = [...mineral_data, ...chemical_data, ...metal_data, ...electronics_data, ...others_data]

    }

    // console.log("industryData : ", industryData);

    if(industryData.length <= 0) return res.sendStatus(204);





//TO_DO Later
// get locations
    const parent_code = user_type === "s-admin" ? prov_code : municipality_code
    const locations = getAvailableLocations(parent_code, user_type);

    let filter_locations : any[] = []

    //clean data/filterdata
    let filter_IndustryData : {
        brgy_name : string
        municipality_name    : string
        dsi : string
        typeOfData : string
    }[] = industryData.map((data)=>{
        return {
            brgy_name : data.survey_data.brgy_name,
            municipality_name : data.surveyor_info.municipality_name,
            dsi : data.survey_data.dsi,
            typeOfData : data.survey_data.type_ofData

        }
    }) 
    
    let responsePerLocation :{
        location: string; 
        count: number;
    }[] = [];





    if(user_type === "s-admin") {

        
        filter_locations = locations.map((loc) => {
            return {
                loc_code : loc.city_code,
                loc_name : loc.city_name
            }
        })

        // call Analytics function
        const surveyData_LocName = filter_IndustryData.map((industry_data)=> industry_data.municipality_name)
        responsePerLocation = getResponseCountPerLocation(filter_locations, surveyData_LocName);
        // console.log("Response per Locations : ", )
      


    } else {

        filter_locations = locations.map((loc) => {
            return {
                loc_code : loc.brgy_code,
                loc_name : loc.brgy_name
            }
        })

        const surveyData_LocName = filter_IndustryData.map((industry_data)=> industry_data.brgy_name)
        responsePerLocation = getResponseCountPerLocation(filter_locations, surveyData_LocName);
    }




    
    const survey_dsi_types = filter_IndustryData.map((industry_data) => industry_data.dsi)
    const survey_typeOfDatas = filter_IndustryData.map((industry_data) => industry_data.typeOfData)
    const dsi_analytics = getDSI_Analytics(survey_dsi_types)
    const tyoeOfDataAnalytics = getTypeOfDataAnalytics(survey_typeOfDatas)
    // console.log("DSI Analytics : ", dsi_analytics)




    // const mineral_data = await MineralSchema.find(query).exec();
    // const chemical_data = await ChemicalSchema.find(query).exec();
    // const metal_data = await MetalSchema.find(query).exec();
    // const electronics_data = await ElectronicsSchema.find(query).exec();
    // const others_data = await OthersSchema.find(query).exec();


   
//make some response
    return res.status(200).send({
        responsePerLocation,
        dsi_analytics,
        tyoeOfDataAnalytics,
    });



}



const getResponseCountPerLocation = (locations : {loc_code : string, loc_name : string}[], surveyData_LocNames: string[]):{location : string, count : number}[] => {

    let responseCountContainer:{
        location : string;
        count : number;
    }[] = [];


    locations.forEach(({loc_code, loc_name})=>{
        
        let temp_obj = {
            location : loc_name,
            count : 0
        } 
        
        surveyData_LocNames.forEach((surveyData_LocName : string)=>{

            if(loc_name === surveyData_LocName) {
                temp_obj.count++;
            }

        })

        responseCountContainer.push(temp_obj);
    })

    return responseCountContainer
}




const getDSI_Analytics = (survey_dsi_types : string[]) : {
    commercial : number
    industrial : number
    institutional : number
    others : number
} => {

    let dsi_types : string[] = ["commercial", "industrial", "institutional", "others"];

   
    let dsi_countContainer : number [] = []

    dsi_types.forEach((dsi_type : string) => {

        let tempDSICounter = 0;

        survey_dsi_types.forEach((survey_dsi_type: string)=>{
            if(dsi_type === survey_dsi_type){
                tempDSICounter ++;
            }
        })
        dsi_countContainer.push(tempDSICounter);
    })


    const dsiCountContainer = {
        commercial : dsi_countContainer[0],
        industrial : dsi_countContainer[1],
        institutional :dsi_countContainer[2],
        others : dsi_countContainer[3],
    }



    return dsiCountContainer


}

const getTypeOfDataAnalytics = (survey_typeofDatas : string[]) : {census:number, ibs:number, others:number} => {

    const type_ofDatas = ["census", "ibs", "others"];

    let typeOfDatasCountContainer:number[] = [];

    type_ofDatas.forEach((typeOfData) => {
        
        let temp_counter = 0;
        survey_typeofDatas.forEach(surveyTypeOfData => {
            if(typeOfData === surveyTypeOfData){
                temp_counter++;
            }
        })

        typeOfDatasCountContainer.push(temp_counter);
    })


    const TypeofDataContainer = {
        census : typeOfDatasCountContainer[0],
        ibs : typeOfDatasCountContainer[1],
        others : typeOfDatasCountContainer[2],
    }


    return TypeofDataContainer


    
}






export default getIndustrialSummary