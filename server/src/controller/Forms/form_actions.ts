import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from '../../db_schema/WasteWaterFormShema';
import MineralSchema from '../../db_schema/Industrial/MineralSchema';


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
                action: `Inserted ${form_category} data for ${survey_data.form_type} form. (${surveyor_info.municipality_name})`,
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








const updateMobileCombustionData = async (req: Request, res: Response) => {
    const {form_id, form_category} = req.params;
    const {survey_data} = req.body;

    console.log("Form ID : ", form_id);
    try {
        const update =  {
            survey_data : survey_data,
            dateTime_edited : new Date()
        }



        const form_data = form_category === "mobile-combustion" ? await FuelFormSchema.findByIdAndUpdate(form_id, update).exec() : await WasteWaterFormShema.findByIdAndUpdate(form_id, update).exec()

        if(!form_data) return res.sendStatus(204);

        return res.status(200).send("Success Requesting Update!");
        
    } catch (error) {
        console.log("updateMobileCombustionData : ", error);
        return res.sendStatus(500)
    }

}



const acceptUpdateMobileCombustionData = async (req: Request, res: Response) => {

    const {form_id} = req.body;
    const {form_category} = req.params;

    try {
        
        const form_data = form_category === "mobile-combustion" ?
            await FuelFormSchema.findByIdAndUpdate(form_id, {"survey_data.status" : "2"}).exec()
        :   await WasteWaterFormShema.findByIdAndUpdate(form_id, {"survey_data.status" : "2"}).exec()

        if(!form_data) return res.sendStatus(204);
    
        return res.status(200).send("Request Update Accepted!!");
    } catch (error) {
        console.log("acceptUpdateMobileCombustionData : ", error)
        return res.sendStatus(500);
    }




}




export {
    insertFormData,
    updateMobileCombustionData,
    acceptUpdateMobileCombustionData

}
