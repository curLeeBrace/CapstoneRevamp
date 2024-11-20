import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from '../../db_schema/WasteWaterFormShema';

import MineralSchema from '../../db_schema/Industrial/MineralSchema';
import ChemicalSchema from '../../db_schema/Industrial/ChemicalSchema';
import MetalSchema from '../../db_schema/Industrial/MetalSchema';
import ElectronicsSchema from '../../db_schema/Industrial/ElectronicsSchema';
import OthersSchema from '../../db_schema/Industrial/OthersSchema';


import AgricultureCrops from '../../db_schema/Agriculture/AgricultureCrops';
import AgricultureLiveStock from '../../db_schema/Agriculture/AgricultureLiveStock';


import StationarySchema from '../../db_schema/StationarySchema';

const formData = async (req:Request, res:Response) => {

    const {
        municipality_code,
        brgy_code,
        brgy_name,
        user_type,
        surveyType,
    } = req.query;
    const { form_category } = req.params;
    // const { user_type } = req.query; // Now we get user_type from query params

    try {

        let query: any = {};

        if (user_type === "lu_surveyor") {
            if (form_category === "waste-water" || form_category === "mobile-combustion" || 
                form_category === "stationary" || form_category === "agriculture-crops" || form_category === "agriculture-livestocks" ||
                form_category === "industrial-mineral" || form_category === "industrial-chemical" ||form_category === "industrial-metal" ||
                form_category === "industrial-electronics" || form_category === "industrial-others" 
             ) {
                if (brgy_code !== undefined) {
                    query = {
                        "survey_data.form_type": surveyType,
                        "surveyor_info.municipality_name": "Laguna University", // For LU Surveyors
                        "survey_data.brgy_code": brgy_code
                    };
                } else {
                    query = {
                        "survey_data.form_type": surveyType,
                        "surveyor_info.municipality_name": "Laguna University" // For LU Surveyors
                    };
                }
            }
        } else {
            // Default query for other users
            if (form_category === "waste-water" || form_category === "mobile-combustion" || form_category === "stationary") {
                if (brgy_code !== undefined) {
                    query = {
                        "survey_data.form_type": surveyType,
                        "survey_data.brgy_code": brgy_code,
                        "surveyor_info.municipality_name": { $ne: "Laguna University" },
                        "surveyor_info.municipality_code": municipality_code
                    };
                } else {
                    query = {
                        "survey_data.form_type": surveyType,
                        "surveyor_info.municipality_name": { $ne: "Laguna University" },
                        "surveyor_info.municipality_code": municipality_code
                    };
                }
            } else {
                // Query for other categories
                if (brgy_code !== undefined) {
                    query = {
                        "survey_data.brgy_code": brgy_code,
                        "surveyor_info.municipality_name": { $ne: "Laguna University" },
                        "surveyor_info.municipality_code": municipality_code
                    };
                } else {
                    query = {
                        "surveyor_info.municipality_code": municipality_code,
                        "surveyor_info.municipality_name": { $ne: "Laguna University" }
                    };
                }
            }
        }
        // console.log ("Form query:",query);
     

        let form_data :any[] = [];

        if(form_category === "waste-water"){
            form_data = await WasteWaterFormShema.find(query).exec()
        } else if (form_category === "mobile-combustion"){
            form_data = await FuelFormSchema.find(query).exec();
        } else if(form_category === "industrial-mineral"){
            form_data = await MineralSchema.find(query).exec();
        } else if(form_category === "industrial-chemical"){
            form_data = await ChemicalSchema.find(query).exec();
        } else if(form_category === "industrial-metal"){
            form_data = await MetalSchema.find(query).exec();
        } else if(form_category === "industrial-electronics"){
            form_data = await ElectronicsSchema.find(query).exec();
        } else if(form_category === "industrial-others"){
            form_data = await OthersSchema.find(query).exec();
        } else if(form_category === "agriculture-crops"){
            form_data = await AgricultureCrops.find(query).exec()
        } else if(form_category === "agriculture-livestocks"){
            form_data = await AgricultureLiveStock.find(query).exec()
        } else {
            form_data = await StationarySchema.find(query).exec();
        }




        
    
        if(!form_data) return res.sendStatus(204);
    
        
        const response = form_data.map((data : any)=> {
            return {
                survey_data : data.survey_data,
                dateTime_created : data.dateTime_created,
                form_id : data._id
            }
        }).sort((a:any,b:any)=> b.dateTime_created - a.dateTime_created);
    
        return res.status(200).send(response);
    } catch (error) {
        console.log("formData : ", error);
        return res.sendStatus(500);
    }
}











const oneFormData = async (req:Request, res:Response) =>{
    
    const {
       form_id
    } = req.query

    const {form_category} = req.params
    
    try {
        

        const form_data = form_category === "waste-water" ? await WasteWaterFormShema.findById(form_id).exec() : await FuelFormSchema.findById(form_id).exec()
        
        if(!form_data) return res.sendStatus(204);


        return res.status(200).send({
            survey_data : form_data.survey_data,
            form_id : form_data._id
        })




    } catch (error) {
        console.log("oneMobileCombustionData : ", error);
        return res.sendStatus(500);
    }
}





export {formData, oneFormData}