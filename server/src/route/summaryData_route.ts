import express from "express";
import {getMobileCombustionData} from "../controller/SummaryData/mobile_combustion"

const router = express.Router();

router.get('/mobile-combustion/:province_code/:municipality_code/:form_type', getMobileCombustionData);


export default router