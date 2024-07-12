import express from "express";
import {getMobileCombustionData} from "../controller/SummaryData/mobile_combustion";
import {get_mcData} from "../controller/SummaryData/get_mcData"; 

const router = express.Router();

router.get('/mobile-combustion/:province_code/:municipality_code/:form_type', getMobileCombustionData);
router.get('/mc-surveyData/:province_code/:municipality_code/:form_type', get_mcData);
export default router