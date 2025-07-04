import express from "express";
const router = express.Router();
import {authenticate_token} from "../controller/Token/auth_token";
import {insertFormData, updateData, acceptUpdate, finishFormData} from "../controller/Forms/form_actions"
import { fetchAuditLogs } from "../controller/AuditLog/get_logs";
import { formData, oneFormData} from "../controller/Forms/form_data";

router.post('/:form_category/insert', authenticate_token,insertFormData)
router.get('/fuel/audit', authenticate_token, fetchAuditLogs);

router.get('/:form_category/surveyed-data', authenticate_token, formData);
router.get('/:form_category/one-surveyed-data', authenticate_token,  oneFormData);
router.put('/:form_category/update-surveyed-data/:form_id', authenticate_token, updateData);
router.put('/:form_category/accept-update', authenticate_token,  acceptUpdate);
router.put('/:form_category/finish-update', authenticate_token,  finishFormData );


//waste water
// router.post('/wast-water/insert', authenticate_token)

export default router