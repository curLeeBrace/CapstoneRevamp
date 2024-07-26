import express from "express";
import {getMobileCombustionData} from "../controller/SummaryData/mobile_combustion";
import {get_mcData} from "../controller/SummaryData/get_mcData"; 
import { authenticate_token } from "../controller/Token/auth_token";

const router = express.Router();

router.get('/mobile-combustion/:province_code/:municipality_code/:form_type', authenticate_token, getMobileCombustionData);
router.get('/mc-surveyData/:province_code/:municipality_code/:form_type', authenticate_token,  get_mcData);
export default router