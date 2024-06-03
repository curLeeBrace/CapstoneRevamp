import express from "express";
import { overview_data } from "../controller/Dashboard/overview_data";
const router = express.Router();

router.get('/overview-data/:province_code/:user_type/:municipality_code', overview_data);


export default router