import { Request, Response } from "express";
import AuditLogSchema from "../../db_schema/AuditLogSchema";

export const fetchAuditLogs = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, action } = req.query;

    let filter: any = {};

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

    if (action) {
      filter.action = { $regex: new RegExp(action as string, 'i') };
    }
    console.log('Constructed filter:', filter);
    // Fetch audit logs from the database with the filter applied
    const auditLogs = await AuditLogSchema.find(filter).sort({ dateTime: -1 }).exec();
    res.status(200).json(auditLogs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Error fetching audit logs" });
  }
};
