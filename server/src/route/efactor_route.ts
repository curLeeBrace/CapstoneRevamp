import express from "express";
const router = express.Router();

import { authenticate_token } from "../controller/Token/auth_token";
import { getMobileCombustionEmmisionFactor, updateMobileCombustionEmmisionFactor } from "../controller/EmmisionFactor/mobileCombustionEfactor";

//mobilecobustion efactor actions
router.get('/mobile-combustion/get-efactor/:fuel_type', authenticate_token, getMobileCombustionEmmisionFactor);
router.put('/mobile-combustion/update-efactor', authenticate_token, updateMobileCombustionEmmisionFactor);





export default router