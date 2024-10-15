import express from "express";
import {getMobileCombustionData} from "../controller/SummaryData/mobile_combustion";
import {getSurveyData} from "../controller/SummaryData/getSurveyData"; 
import { authenticate_token } from "../controller/Token/auth_token";

import getWasteWaterSummary from "../controller/SummaryData/wasteWater";
import getIndustrialSummary from "../controller/SummaryData/industrial"
import getAgricultureSummary from "../controller/SummaryData/agriculture";


const router = express.Router();

router.get('/mobile-combustion', authenticate_token, getMobileCombustionData);
router.get('/waste-water', authenticate_token, getWasteWaterSummary);
router.get('/industrial', authenticate_token, getIndustrialSummary);
router.get('/agriculture', authenticate_token, getAgricultureSummary);

router.get('/dashboard/:form_category', authenticate_token,  getSurveyData);
export default router