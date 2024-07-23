import express from "express";
import { overview_data } from "../controller/Dashboard/overview_data";
import { get_surveyor_info } from "../controller/Dashboard/get_surveyor_info";

const router = express.Router();

router.get('/get-surveyor-info/:municipality_code/:get_all', get_surveyor_info);
router.get('/overview-data/:province_code/:user_type/:municipality_code', overview_data);



export default router