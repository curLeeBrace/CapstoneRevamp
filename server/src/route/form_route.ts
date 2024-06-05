import express from "express";
const router = express.Router();
import {authenticate_token} from "../controller/Token/auth_token";
import {insertFuelFormData} from "../controller/Forms/fuel"
import { fetchAuditLogs } from "../controller/AuditLog/get_logs";

router.post('/fuel/insert', authenticate_token,insertFuelFormData)
router.get('/fuel/audit', authenticate_token, fetchAuditLogs);


export default router