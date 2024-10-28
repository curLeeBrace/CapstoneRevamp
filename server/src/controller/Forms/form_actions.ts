import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from '../../db_schema/WasteWaterFormShema';
//Agricultre
import MineralSchema from '../../db_schema/Industrial/MineralSchema';
import ChemicalSchema from '../../db_schema/Industrial/ChemicalSchema';
import MetalSchema from '../../db_schema/Industrial/MetalSchema';
import ElectronicsSchema from '../../db_schema/Industrial/ElectronicsSchema';
import OthersSchema from '../../db_schema/Industrial/OthersSchema';
///

import AgricultureCrops from '../../db_schema/Agriculture/AgricultureCrops';
import AgricultureLiveStock from '../../db_schema/Agriculture/AgricultureLiveStock';


import StationarySchema from '../../db_schema/StationarySchema';
import { auditLogType, saveAuditLog } from "../AuditLog/audit_log";



const insertFormData = async (req: Request, res: Response) => {
    const {form_category} = req.params
    try {
        // Insert the fuel form data
        console.log("Request body:", req.body);
        let insert = undefined;
        
        if(form_category === "mobile-combustion"){
            insert = await FuelFormSchema.create(req.body);
        } else if(form_category === "waste-water"){
            insert = await WasteWaterFormShema.create(req.body);
        } else if (form_category === "industrial-mineral"){
            insert = await MineralSchema.create(req.body);
        } else if (form_category === "industrial-chemical"){
            insert = await ChemicalSchema.create(req.body);
        } else if (form_category === "industrial-metal"){
            insert = await MetalSchema.create(req.body);
        } else if (form_category === "industrial-electronics"){
            insert = await ElectronicsSchema.create(req.body);
        } else if (form_category === "industrial-others"){
            insert = await OthersSchema.create(req.body);
        } else if (form_category === "agriculture-crops") {
            insert = await AgricultureCrops.create(req.body);
        } else if (form_category === "agriculture-livestocks"){
            insert = await AgricultureLiveStock.create(req.body);
        } else if(form_category === "stationary") {
            insert = await StationarySchema.create(req.body);
        }





        if (insert) {
            // Create the audit log
            const { surveyor_info, survey_data } = req.body;
            const auditLog: auditLogType = {
                name: surveyor_info.full_name,
                lgu_municipality: {
                    municipality_name: surveyor_info.municipality_name,
                    municipality_code: surveyor_info.municipality_code,
                    province_code: surveyor_info.province_code,
                },
                user_type: "surveyor",
                dateTime: new Date(),
                action: `Inserted ${form_category} ${survey_data.form_type ? `data for ${survey_data.form_type}` : ""} survey (${surveyor_info.municipality_name})`,
            };

            // Save the audit log
            const isSaved = await saveAuditLog(auditLog);
            if (isSaved) {
                return res.sendStatus(201); // Created
            } else {
                console.error("Failed to save audit log");
                return res.sendStatus(500); // Internal server error
            }
        } else {
            return res.sendStatus(409); // Conflict, insertion failed
        }
    } catch (error) {
        console.error("Error inserting form data:", error);
        return res.sendStatus(500); // Internal server error
    }
}








const updateData = async (req: Request, res: Response) => {
    const {form_id, form_category} = req.params;
    const {survey_data} = req.body;

    console.log("Form ID : ", form_id);
    try {
        const update =  {
            survey_data : survey_data,
            dateTime_edited : new Date()
        }



        let form_data = null



        
        if(form_category === "waste-water"){
            form_data = await WasteWaterFormShema.findByIdAndUpdate(form_id, update).exec()
        } else if (form_category === "mobile-combustion"){
            form_data = await FuelFormSchema.findByIdAndUpdate(form_id, update).exec()
        } else if(form_category === "industrial-mineral"){
            form_data = await MineralSchema.findByIdAndUpdate(form_id, update).exec()
        } else if(form_category === "industrial-chemical"){
            form_data = await ChemicalSchema.findByIdAndUpdate(form_id, update).exec()
        } else if(form_category === "industrial-metal"){
            form_data = await MetalSchema.findByIdAndUpdate(form_id, update).exec()
        } else if(form_category === "industrial-electronics"){
            form_data = await ElectronicsSchema.findByIdAndUpdate(form_id, update).exec()
        } else if(form_category === "industrial-others"){
            form_data = await OthersSchema.findByIdAndUpdate(form_id, update).exec()
        } else if(form_category === "agriculture-crops"){
            form_data = await AgricultureCrops.findByIdAndUpdate(form_id, update).exec();
        } else if(form_category === "agriculture-livestocks") {
            form_data = await AgricultureLiveStock.findByIdAndUpdate(form_id, update).exec();
        } else {
            form_data = await StationarySchema.findByIdAndUpdate(form_id, update).exec();
        }

        if(!form_data) return res.sendStatus(204);

        return res.status(200).send("Success Requesting Update!");
        
    } catch (error) {
        console.log("updateMobileCombustionData : ", error);
        return res.sendStatus(500)
    }

}



const acceptUpdate = async (req: Request, res: Response) => {

    const {form_id,
        admin_name,
        img_id,
    } = req.body;
    const {form_category} = req.params;


    try {
        
        let form_data = undefined

        const updateQuery = {
            "survey_data.status" : "2",
            "acceptedBy.admin_name" : admin_name,
            "acceptedBy.img_id" : img_id
        };

        if(form_category === "waste-water"){
            form_data = await WasteWaterFormShema.findByIdAndUpdate(form_id, ).exec()
        } else if (form_category === "mobile-combustion"){
            form_data = await FuelFormSchema.findByIdAndUpdate(form_id, updateQuery).exec()
        } else if(form_category === "industrial-mineral"){
            form_data = await MineralSchema.findByIdAndUpdate(form_id, updateQuery).exec()
        } else if(form_category === "industrial-chemical"){
            form_data = await ChemicalSchema.findByIdAndUpdate(form_id, updateQuery).exec()
        } else if(form_category === "industrial-metal"){
            form_data = await MetalSchema.findByIdAndUpdate(form_id, updateQuery).exec()
        } else if(form_category === "industrial-electronics"){
            form_data = await ElectronicsSchema.findByIdAndUpdate(form_id, updateQuery).exec()
        } else if(form_category === "industrial-others"){
            form_data = await OthersSchema.findByIdAndUpdate(form_id, updateQuery).exec()
        }else if(form_category === "agriculture-crops"){
            form_data = await AgricultureCrops.findByIdAndUpdate(form_id, updateQuery).exec();
        } else if(form_category === "agriculture-livestocks") {
            form_data = await AgricultureLiveStock.findByIdAndUpdate(form_id, updateQuery).exec();
        } else {
            form_data = await StationarySchema.findByIdAndUpdate(form_id, updateQuery).exec();
        }



        
        if(!form_data) return res.sendStatus(204);
    
        return res.status(200).send("Request Update Accepted!!");
    } catch (error) {
        console.log("acceptUpdateMobileCombustionData : ", error)
        return res.sendStatus(500);
    }

}
















const finishFormData = async (req: Request, res: Response) => {
    const {form_id} = req.body;
    const {form_category} = req.params;


    try {

        let form_data = undefined
        if(form_category === "waste-water"){
            form_data = await WasteWaterFormShema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec()
        } else if (form_category === "mobile-combustion"){
            form_data = await FuelFormSchema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec()
        } else if(form_category === "industrial-mineral"){
            form_data = await MineralSchema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec()
        } else if(form_category === "industrial-chemical"){
            form_data = await ChemicalSchema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec()
        } else if(form_category === "industrial-metal"){
            form_data = await MetalSchema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec()
        } else if(form_category === "industrial-electronics"){
            form_data = await ElectronicsSchema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec()
        } else if(form_category === "industrial-others"){
            form_data = await OthersSchema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec()
        }else if(form_category === "agriculture-crops"){
            form_data = await AgricultureCrops.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec();
        } else if(form_category === "agriculture-livestocks") {
            form_data = await AgricultureLiveStock.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec();
        } else {
            form_data = await StationarySchema.findByIdAndUpdate(form_id, {"survey_data.status" : "0"}).exec();
        }


        return res.status(200).send("Succsess Updating Form Status!");



    } catch(err) {
        return res.sendStatus(500);
    }
}







export {
    insertFormData,
    updateData,
    acceptUpdate,
    finishFormData

}
