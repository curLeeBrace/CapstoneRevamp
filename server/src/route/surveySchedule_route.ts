import express from "express";
import { authenticate_token } from "../controller/Token/auth_token";
import { getSchedule, setSchedule, removeSchedule, verifySchedule} from "../controller/SurveyScheduler/surveySchedule";
const router = express.Router();



router.get('/get-schedules/:municipality_name', authenticate_token, getSchedule)
router.post('/set-schedule', authenticate_token, setSchedule)
router.post('/remove-schedule', authenticate_token, removeSchedule)
router.get('/schedule-identifier', authenticate_token, verifySchedule);


export default router