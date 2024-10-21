import { Request, Response } from 'express';
import AgricultureCropsSchema from "../../../db_schema/Agriculture/AgricultureCrops";
import AgricultureLiveStocksSchema from "../../../db_schema/Agriculture/AgricultureLiveStock";
import {agricultureTotalGHGe} from "../../../../custom_funtions/agriculture"



const agricultureRawData = async (req : Request, res : Response) =>{

        const {agricultureType, municipality_name, brgy_name, user_type, year} = req.query

        let responseContainer = undefined;
        try {
 
            if(user_type === "s-admin") {
                let query = {}

                if(!municipality_name){
                    query = 
                        {
                            dateTime_created : {
                                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                                $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                            },
                        }
                } else {
                    query = {
                            "surveyor_info.municipality_name" : municipality_name,
                            dateTime_created : {
                                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                                $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                            },
                        }
                }


                if(agricultureType === "crops") {
                    
                    responseContainer = await processIndustrialRawData("crops", query)
                    
                } else {
                    responseContainer = await processIndustrialRawData("liveStocks", query)
                }
                
                // return res.status(200).send(responseContainer);


            } else if(user_type === "lgu_admin"){

                let query = {}

                if(!brgy_name){
                    query = {
                        "surveyor_info.municipality_name" : municipality_name,
                        dateTime_created : {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                        },
                    }
                } else {
                    query = {
                        "surveyor_info.municipality_name" : municipality_name,
                        "survey_data.brgy_name" : brgy_name,
                        dateTime_created : {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                        },
                    }
                }





                if(agricultureType === "crops") {
                    
                    responseContainer = await processIndustrialRawData("crops", query)

                } else {
                    
                    responseContainer = await processIndustrialRawData("liveStocks", query)
                }


                
                

            }

            ///Handle Response
            if(!responseContainer) return res.sendStatus(204);
            return res.status(200).send(responseContainer);
                
            

            


        } catch (error) {

            return res.sendStatus(500);
        }


}



const processIndustrialRawData = async (agricultureType : "crops" | "liveStocks", query : {}):Promise<{}[]>=> {

    let reponseContainer : {}[] = []

    if(agricultureType === "crops"){
        const cropsData = await AgricultureCropsSchema.find(query).exec();
                    
                    reponseContainer = cropsData.map(data => {
                        const form_id = data._id;
                        const {email, municipality_name} = data.surveyor_info
                        const brgy_name = data.survey_data.brgy_name
                        const {
                            rdsi,
                            rdsr,
                            rwsi,
                            rwsr,
                            crop_residues,
                            dol_limestone,
                        } =  data.survey_data.crops
                        const ghge = agricultureTotalGHGe(data.survey_data.crops, "crops");
                        const dateTime = data.dateTime_created;

                        return {
                            form_id,
                            email,
                            municipality_name,
                            brgy_name,
                            rdsi,
                            rdsr,
                            rwsi,
                            rwsr,
                            crop_residues,
                            dol_limestone,
                            ghge,
                            dateTime
                        }
                    })
    } else {
        const cropsData = await AgricultureLiveStocksSchema.find(query).exec();

        reponseContainer = cropsData.map(data => {
            const form_id = data._id;
            const {email, municipality_name} = data.surveyor_info
            const brgy_name = data.survey_data.brgy_name
            const {
                buffalo,
                cattle,
                goat,
                horse,
                poultry,
                swine,
                non_dairyCattle,
            } =  data.survey_data.live_stock
            const ghge = agricultureTotalGHGe(data.survey_data.live_stock, "liveStocks");
            const dateTime = data.dateTime_created;

            return {
                form_id,
                email,
                municipality_name,
                brgy_name,
                buffalo,
                cattle,
                goat,
                horse,
                poultry,
                swine,
                non_dairyCattle,
                ghge,
                dateTime
            }
        })
        
    }   


    return reponseContainer
}



export default agricultureRawData