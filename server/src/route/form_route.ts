import express from "express";
const router = express.Router();
import {authenticate_token} from "../controller/Token/auth_token";
import {insertFuelFormData} from "../controller/Forms/fuel"

router.post('/fuel/insert', authenticate_token,insertFuelFormData)



export default router