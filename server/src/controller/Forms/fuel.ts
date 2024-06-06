import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import { auditLogType, saveAuditLog } from "../AuditLog/audit_log";

const insertFuelFormData = async (req: Request, res: Response) => {
    try {
        // Insert the fuel form data
        console.log("Request body:", req.body);
        const insert = await FuelFormSchema.create(req.body);

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
                action: `Inserted fuel data for ${survey_data.form_type} form. (${surveyor_info.municipality_name})`,
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
        console.error("Error inserting fuel form data:", error);
        return res.sendStatus(500); // Internal server error
    }
}

export {
    insertFuelFormData
}
