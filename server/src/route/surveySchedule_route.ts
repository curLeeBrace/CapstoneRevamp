import express from "express";
import { authenticate_token } from "../controller/Token/auth_token";
import { getSchedule, setSchedule} from "../controller/SurveyScheduler/surveySchedule";
const router = express.Router();



router.get('/get-schedules/:municipality_name', authenticate_token, getSchedule)
router.post('/set-schedule', authenticate_token, setSchedule)


export default router