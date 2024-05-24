import AuditLogSchema from "../../db_schema/AuditLogSchema";

export type auditLogType = {

    name : string;
    lgu_municipality : {
        municipality_name : string;
        municipality_code : string;
        province_code : string;
    };
    user_type : string;
    dateTime : Date;
    action : string;
}


export const saveAuditLog = async (auditLog : auditLogType) : Promise<boolean> => {
try {
    let isCreated = await AuditLogSchema.create(auditLog);
    if(isCreated) return true;

    return false
    

} catch (error) {
    console.log(error)
    return false
}



}

