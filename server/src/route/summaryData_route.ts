import express from "express";
import {getMobileCombustionData} from "../controller/SummaryData/mobile_combustion";
import {getSurveyData} from "../controller/SummaryData/getSurveyData"; 
import { authenticate_token } from "../controller/Token/auth_token";

import getWasteWaterSummary from "../controller/SummaryData/wasteWater";
import getIndustrialSummary from "../controller/SummaryData/Industrial/industrial"
import {getIndustrialRawSummary} from "../controller/SummaryData/Industrial/industrialRawData"
import getAgricultureSummary from "../controller/SummaryData/Agriculture/agriculture";

import agricultureRawData from "../controller/SummaryData/Agriculture/agricultureRawData"
import stationaryRawData from "../controller/SummaryData/stationaryRawData";

const router = express.Router();

router.get('/mobile-combustion', authenticate_token, getMobileCombustionData);
router.get('/waste-water', authenticate_token, getWasteWaterSummary);

router.get('/industrial', authenticate_token, getIndustrialSummary);
router.get('/industrial/:industrial_type', authenticate_token, getIndustrialRawSummary);


router.get('/agriculture', authenticate_token, getAgricultureSummary);
router.get('/agriculture/raw-data', authenticate_token, agricultureRawData);

router.get('/stationary/raw-data', authenticate_token, stationaryRawData);


router.get('/dashboard/:form_category', authenticate_token,  getSurveyData);
export default router