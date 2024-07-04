import express from "express";
import { e_mobileForecasting } from "../controller/Forcasting/e_mobileForecasting";
const router = express.Router();


router.get('/e-mobile/:municipality_code/:form_type', e_mobileForecasting);


export default router