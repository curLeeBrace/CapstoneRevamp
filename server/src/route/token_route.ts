import express from "express";
import {refresh} from "../controller/Token/refresh_token"
import {authenticate_token} from "../controller/Token/auth_token"
const route = express.Router();

route.post('/refresh', refresh);
route.post('/auth', authenticate_token);

export default route;