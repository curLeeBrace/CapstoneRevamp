// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';

// import { auditLogType, saveAuditLog } from './../controller/AuditLog/audit_log';
// import AccountSchema from "../db_schema/AccountSchema";

// export const logoutAccount = async (req: Request, res: Response) => {
//     try {
//         // Extract token from request headers
//         const token = req.header('Authorization')?.replace('Bearer ', '');
//         if (!token) {
//             return res.sendStatus(401); // Unauthorized
//         }

//         // Verify and decode JWT token
//         const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as jwt.Secret);
//         const email = decoded.email;

//         // Find account details based on decoded email
//         const authAcc = await AccountSchema.findOne({ email }).exec();

//         if (authAcc) {
//             const { f_name, m_name, l_name, lgu_municipality, user_type } = authAcc;

//             // Create audit log
//             const auditLog: auditLogType = {
//                 name: `${f_name} ${m_name ? m_name[0] : ''} ${l_name}`,
//                 lgu_municipality: {
//                     municipality_name: lgu_municipality.municipality_name,
//                     municipality_code: lgu_municipality.municipality_code,
//                     province_code: lgu_municipality.province_code,
//                 },
//                 user_type,
//                 dateTime: new Date(),
//                 action: "User logged out",
//             };

//             // Save audit log
//             await saveAuditLog(auditLog);

//             return res.sendStatus(200); // OK
//         } else {
//             return res.sendStatus(404); // Not Found
//         }
//     } catch (error) {
//         console.error("Error during logout:", error);
//         return res.sendStatus(500); // Internal Server Error
//     }
// }
