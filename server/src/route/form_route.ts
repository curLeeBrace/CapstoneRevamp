import express from "express";
const router = express.Router();
import {authenticate_token} from "../controller/Token/auth_token";
import {insertFuelFormData, updateMobileCombustionData, acceptUpdateMobileCombustionData} from "../controller/Forms/fuel"
import { fetchAuditLogs } from "../controller/AuditLog/get_logs";
import { mobile_combustionData, oneMobileCombustionData} from "../controller/Forms/mobile_combustionData";

router.post('/fuel/insert', authenticate_token,insertFuelFormData)
router.get('/fuel/audit', authenticate_token, fetchAuditLogs);
router.get('/mobile-combustion/surveyed-data', mobile_combustionData);
router.get('/mobile-combustion/one-surveyed-data', oneMobileCombustionData);
router.put('/mobile-combustion/update-surveyed-data/:form_id', updateMobileCombustionData);
router.put('/mobile-combustion/accept-update', acceptUpdateMobileCombustionData);

export default router