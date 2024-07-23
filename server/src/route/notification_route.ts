import express from "express";
import { getMobileCombustionNotification } from "../controller/Dashboard/getNotification";
const router = express.Router();

router.get('/get-mobile-combustion/req-update-notification', getMobileCombustionNotification);


export default router