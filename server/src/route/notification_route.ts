import express from "express";
import { getNotification } from "../controller/Dashboard/getNotification";
import { authenticate_token } from "../controller/Token/auth_token";
const router = express.Router();

router.get('/get-notification',authenticate_token, getNotification);


export default router