import express from "express";
const router = express.Router();
import {authenticate_token} from "../controller/Token/auth_token";
import {insertFormData, updateMobileCombustionData, acceptUpdateMobileCombustionData} from "../controller/Forms/form_actions"
import { fetchAuditLogs } from "../controller/AuditLog/get_logs";
import { formData, oneMobileCombustionData} from "../controller/Forms/form_data";

router.post('/:form_category/insert', authenticate_token,insertFormData)
router.get('/fuel/audit', authenticate_token, fetchAuditLogs);

router.get('/:form_category/surveyed-data', authenticate_token, formData);
router.get('/mobile-combustion/one-surveyed-data', authenticate_token,  oneMobileCombustionData);
router.put('/mobile-combustion/update-surveyed-data/:form_id', authenticate_token, updateMobileCombustionData);
router.put('/mobile-combustion/accept-update', authenticate_token,  acceptUpdateMobileCombustionData);


//waste water
// router.post('/wast-water/insert', authenticate_token)

export default router