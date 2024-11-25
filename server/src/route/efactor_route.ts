import express from "express";
const router = express.Router();

import { authenticate_token } from "../controller/Token/auth_token";
import { getMobileCombustionEmmisionFactor, updateMobileCombustionEmmisionFactor } from "../controller/EmmisionFactor/mobileCombustionEfactor";
import { getIndustrialEfactor, updateIndustrialEfactor} from "../controller/EmmisionFactor/industrialEfactor";
import { getWasteWaterEfactor, updateWasteWaterEfactor} from "../controller/EmmisionFactor/wasteWaterEfactor";
import { getAgricultureEfactor, updateAgricultureEfactor} from "../controller/EmmisionFactor/agriculltureEfactor";
import { getStationarEfactor, updateStationarEfactor} from "../controller/EmmisionFactor/stationaryEfactor";

    //mobilecobustion efactor actions
    router.get('/mobile-combustion/get-efactor/:fuel_type', authenticate_token, getMobileCombustionEmmisionFactor);
    router.put('/mobile-combustion/update-efactor', authenticate_token, updateMobileCombustionEmmisionFactor);

    //wastewater efactor actions
    router.get('/waste-water/get-efactor/:surveyType', authenticate_token, getWasteWaterEfactor);
    router.put('/waste-water/update-efactor', authenticate_token, updateWasteWaterEfactor);

    //industrial efactor actions
    router.get('/industrial/get-efactor/:industry_type', authenticate_token, getIndustrialEfactor);
    router.put('/industrial/update-efactor',authenticate_token,updateIndustrialEfactor);


    //agriculture efactor actions
    router.get('/agriculture/get-efactor/:agriculture_type', authenticate_token, getAgricultureEfactor);
    router.put('/agriculture/update-efactor', authenticate_token, updateAgricultureEfactor );

    //stationary efactor actions
    router.get('/stationary/get-efactor', authenticate_token, getStationarEfactor);
    router.put('/stationary/update-efactor', authenticate_token, updateStationarEfactor);






export default router