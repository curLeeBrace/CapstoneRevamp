import express from "express";
const router = express.Router();

import { authenticate_token } from "../controller/Token/auth_token";
import { getMobileCombustionEmmisionFactor, updateMobileCombustionEmmisionFactor } from "../controller/EmmisionFactor/mobileCombustionEfactor";
import { getIndustrialEfactor, updateIndustrialEfactor} from "../controller/EmmisionFactor/industrialEfactor";
import { getWasteWaterEfactor, updateWasteWaterEfactor} from "../controller/EmmisionFactor/wasteWaterEfactor";

//mobilecobustion efactor actions
router.get('/mobile-combustion/get-efactor/:fuel_type', authenticate_token, getMobileCombustionEmmisionFactor);
router.put('/mobile-combustion/update-efactor', authenticate_token, updateMobileCombustionEmmisionFactor);

//wastewater efactor actions
router.get('/waste-water/get-efactor/:surveyType', authenticate_token, getWasteWaterEfactor);
router.put('/waste-water/update-efactor', authenticate_token, updateWasteWaterEfactor);

//industrial efactor actions
router.get('/industrial/get-efactor/:industry_type', authenticate_token, getIndustrialEfactor);
router.put('/industrial/update-efactor',authenticate_token,updateIndustrialEfactor);





export default router