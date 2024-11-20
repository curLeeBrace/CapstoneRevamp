import { Request, Response } from "express";
import AuditLogSchema from "../../db_schema/AuditLogSchema";

export const fetchAuditLogs = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, action, province_code, municipality_code, user_type } = req.query;
    let filter: any = {};

    // Date range filtering
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate as string) : null;
      const end = endDate ? new Date(endDate as string) : null;

      if (end) {
        end.setHours(23, 59, 59, 999); // Set the end date to the end of the day
      }

      filter.dateTime = {
        ...(start && { $gte: start }),
        ...(end && { $lte: end }),
      };
    }

    // Action filtering
    if (action) {
      filter.action = { $regex: new RegExp(action as string, 'i') };
    }

    if (province_code) {
      filter["lgu_municipality.province_code"] = province_code;
    }

    if (user_type === "lu_admin") {
      filter["lgu_municipality.municipality_name"] = { $regex: "^Laguna University$", $options: "i" };
    } else if (user_type === "lgu_admin" && municipality_code) {
      filter["lgu_municipality.municipality_code"] = municipality_code;
      filter.user_type = { $in: ["surveyor", "lgu_admin"] };
    }

    const auditLogs = await AuditLogSchema.find(filter).sort({ dateTime: -1 }).limit(100).exec();

    res.status(200).json(auditLogs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Error fetching audit logs" });
  }
};
