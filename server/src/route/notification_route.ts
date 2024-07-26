import express from "express";
import { getMobileCombustionNotification } from "../controller/Dashboard/getNotification";
import { authenticate_token } from "../controller/Token/auth_token";
const router = express.Router();

router.get('/get-mobile-combustion/req-update-notification',authenticate_token, getMobileCombustionNotification);


export default router