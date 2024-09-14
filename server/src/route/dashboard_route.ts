import express from "express";
import { overview_data } from "../controller/Dashboard/overview_data";
import { get_surveyor_info } from "../controller/Dashboard/get_surveyor_info";
import { authenticate_token } from "../controller/Token/auth_token";

const router = express.Router();

router.get('/get-surveyor-info/:municipality_code/:user_type', authenticate_token,  get_surveyor_info);
router.get('/overview-data/:province_code/:user_type/:municipality_code',authenticate_token, overview_data);



export default router