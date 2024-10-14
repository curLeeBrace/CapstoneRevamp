import { Request, Response } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import jwt, { Secret } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { auditLogType, saveAuditLog } from "../AuditLog/audit_log";

interface AuthBody {
    email: string;
    encrypt_pass: string;
}

const handleLogout = async (email: string, user: any) => {
    try {
        if (user) {
            const { f_name, m_name, l_name, lgu_municipality, user_type } = user;

            // Create the audit log for logout
            const auditLog: auditLogType = {
                name: `${f_name} ${m_name ? m_name[0] : ''} ${l_name}`,
                lgu_municipality: {
                    municipality_name: lgu_municipality.municipality_name,
                    municipality_code: lgu_municipality.municipality_code,
                    province_code: lgu_municipality.province_code,
                },
                user_type,
                dateTime: new Date(),
                action: `User logged out. (${lgu_municipality.municipality_name})`,
            };

            // Save the audit log for logout
            const isSaved = await saveAuditLog(auditLog);

            if (!isSaved) {
                console.error("Failed to save audit log for logout");
            }
        } else {
            console.error("User not found during logout");
        }
    } catch (error) {
        console.error("Error handling logout:", error);
    }
};

export const authenticate_account = async (req: Request, res: Response) => {
    const { email, encrypt_pass }: AuthBody = req.body as AuthBody;

    try {
        const auth_acc = await AccountSchema.findOne({ email }).exec();

        if (auth_acc) {
            const { email, user_type, verified, lgu_municipality, f_name, m_name, l_name, img_name, img_id, address} = auth_acc;
            const encrypted_db_pass = auth_acc.pass;

            const secret_key: string = process.env.SECRET_KEY as string;
            const decrypt_pass = CryptoJS.AES.decrypt(encrypt_pass.toString(), secret_key);
            const decrypt_db_pass = CryptoJS.AES.decrypt(encrypted_db_pass.toString(), secret_key);

            if (decrypt_pass.toString(CryptoJS.enc.Utf8) === decrypt_db_pass.toString(CryptoJS.enc.Utf8)) {
                const access_token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET as Secret, {expiresIn : "1d"});
                const refresh_token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET as Secret, {expiresIn : "3d"});

                const respo = {
                    email,
                    hash_pass: encrypted_db_pass,
                    municipality_code: lgu_municipality.municipality_code,
                    municipality_name: lgu_municipality.municipality_name,
                    province_code: lgu_municipality.province_code,
                    access_token,
                    refresh_token,
                    verified,
                    user_type,
                    username: f_name,
                    img_name,
                    full_name: `${f_name} ${m_name ? m_name[0] : ''} ${l_name}`,
                    img_id : img_id,
                    brgy_name : address.brgy_name
                };

                handleLogout(email, auth_acc);

                // Create the audit log
                const auditLog: auditLogType = {
                    name: `${f_name} ${m_name ? m_name[0] : ''} ${l_name}`,
                    lgu_municipality: {
                        municipality_name: lgu_municipality.municipality_name,
                        municipality_code: lgu_municipality.municipality_code,
                        province_code: lgu_municipality.province_code,
                    },
                    user_type,
                    dateTime: new Date(),
                    action: `User logged in. (${lgu_municipality.municipality_name})`,
                };

                // Save the audit log
                const isSaved = await saveAuditLog(auditLog);

                if (!isSaved) {
                    console.error("Failed to save audit log");
                }

                return res.status(200).json(respo);
            } else {
                return res.sendStatus(401); // Unauthorized
            }
        }

        return res.sendStatus(404); // Not Found
    } catch (error) {
        console.log(error);
        return res.sendStatus(500); // Internal Server Error
    }
}
