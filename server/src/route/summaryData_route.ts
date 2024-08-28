import express from "express";
import {getMobileCombustionData} from "../controller/SummaryData/mobile_combustion";
import {getSurveyData} from "../controller/SummaryData/getSurveyData"; 
import { authenticate_token } from "../controller/Token/auth_token";

const router = express.Router();

router.get('/mobile-combustion', authenticate_token, getMobileCombustionData);
router.get('/dashboard/:form_category', authenticate_token,  getSurveyData);
export default router