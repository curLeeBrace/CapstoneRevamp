import { Request, Response } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from "../../db_schema/WasteWaterFormShema";
import ChemicalSchema from "../../db_schema/Industrial/ChemicalSchema";
import ElectronicsSchema from "../../db_schema/Industrial/ElectronicsSchema";
import MetalSchema from "../../db_schema/Industrial/MetalSchema";
import MineralSchema from "../../db_schema/Industrial/MineralSchema";
import OthersSchema from "../../db_schema/Industrial/OthersSchema";
import AgricultureCrops from "../../db_schema/Agriculture/AgricultureCrops";
import AgricultureLiveStock from "../../db_schema/Agriculture/AgricultureLiveStock";
import StationarySchema from "../../db_schema/StationarySchema";
import WoodSchema from "../../db_schema/ForestryAndLandUSe/WoodSchema";
import ForestLandSchema from "../../db_schema/ForestryAndLandUSe/ForestLandSchema";

const get_surveyor_info = async (req : Request, res : Response) => {

    const {municipality_code, user_type, municipality_name} = req.params;
    // console.log(get_all, typeof(get_all))
    
    try {
        // const query = get_all === "false" ? {'lgu_municipality.municipality_code' : municipality_code, user_type:"surveyor"} : {user_type : "surveyor"};

        let query = {}

       
            if(user_type === "s-admin") {
                if(municipality_code === "undefined") {
                    query = { user_type: { $in: ["surveyor", "lu_surveyor"] } };

                } else {
                    query = { 'lgu_municipality.municipality_code': municipality_code, user_type: { $in: ["surveyor", "lu_surveyor"] } };
                }
            } else if (user_type === "lu_admin") {
                if(municipality_name === "Laguna University") {
                    query = { user_type: "lu_surveyor"};

                } else {
                    query = { 'lgu_municipality.municipality_name': "Laguna University", user_type: "lu_surveyor" };
                }
       
            } else {

                query = {'lgu_municipality.municipality_code' : municipality_code, user_type:"surveyor"}
            }

        console.log("QUERY : ", query)

      

        


        

        const accs =  await AccountSchema.find(query).exec();
        const mobileCombsutionData = await FuelFormSchema.find({});
        const wasteWaterData = await WasteWaterFormShema.find({});
        const [chemicalData, electronicsData, metalData, mineralData, othersData] = await Promise.all([
            ChemicalSchema.find({}),
            ElectronicsSchema.find({}),
            MetalSchema.find({}),
            MineralSchema.find({}),
            OthersSchema.find({})
        ]);

        const industrialData = {
            chemicalData,
            electronicsData,
            metalData,
            mineralData,
            othersData
        };

        const [cropsData, liveStocksData] = await Promise.all([
            AgricultureCrops.find({}),
            AgricultureLiveStock.find({}),
        ]);
        
        const agricultureData = {
            cropsData,
            liveStocksData,
        };
        
        const stationaryData = await StationarySchema.find({});


        const [falu_woodData, falu_forestlandData] = await Promise.all([
            WoodSchema.find({}),
            ForestLandSchema.find({})

        ])

        const forestryData = {
            falu_woodData,
            falu_forestlandData,
        }

        if(!accs) return res.sendStatus(204);
        


        let user_infos : any [] = []

        accs.forEach((acc)=>{
            let mobileCombustionSurveyCount = getSurveyCount(mobileCombsutionData, acc.email);
            let wasteWaterSurveyCount = getSurveyCount(wasteWaterData, acc.email);
            let industrialSurveyCount = getIndustrialSurveyCount(industrialData, acc.email);;
            let agricultureSurveyCount = getAgricultureSurveyCount(agricultureData, acc.email);;
            let stationarySurveyCount = getSurveyCount(stationaryData, acc.email);
            let forestrySurveyCount = getForestrySurveyCount(forestryData, acc.email);


        

            // Handle other user types if necessary
         
                user_infos.push({
                    full_name: acc.f_name + " " + acc.l_name,
                    img_id: acc.img_id,
                    municipality_name: acc.lgu_municipality.municipality_name,
                    user_type: acc.user_type,
                    mobileCombustionSurveyCount,
                    wasteWaterSurveyCount,
                    industrialSurveyCount,
                    agricultureSurveyCount,
                    stationarySurveyCount,
                    forestrySurveyCount
                });
            
        });


        return res.status(200).json(user_infos)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("cannot get the account!");
    }


}



const getSurveyCount = (surveyData : any[], email : string) : number => {

    let surveyCount = 0;
    surveyData.forEach(survey => {
        if(survey.surveyor_info.email === email){
            surveyCount++;
        }
    })


    return surveyCount
}



const getIndustrialSurveyCount = (industrialData: any, email: string): number => {
    // Count surveys 
    const chemicalCount = getSurveyCount(industrialData.chemicalData, email);
    const electronicsCount = getSurveyCount(industrialData.electronicsData, email);
    const metalCount = getSurveyCount(industrialData.metalData, email);
    const mineralCount = getSurveyCount(industrialData.mineralData, email);
    const othersCount = getSurveyCount(industrialData.othersData, email);


    return chemicalCount + electronicsCount + metalCount + mineralCount + othersCount;
};

const getAgricultureSurveyCount = (agricultureData: any, email: string): number => {
    // Count surveys 
    const cropsCount = getSurveyCount(agricultureData.cropsData, email);
    const liveStocksCount = getSurveyCount(agricultureData.liveStocksData, email);


    return cropsCount + liveStocksCount;
};

const getForestrySurveyCount = (forestryData: any, email: string): number => {
    // Count surveys 
    const woodCount = getSurveyCount(forestryData.falu_woodData, email);
    const forestLandCount = getSurveyCount(forestryData.falu_forestlandData, email);


    return woodCount + forestLandCount;
};
export { get_surveyor_info };