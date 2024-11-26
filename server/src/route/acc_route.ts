import express from "express";
import {register_acc, createAcc_Validation} from "../controller/Account/create_acc";
import { verify_acc } from "../controller/Account/verify_acc";
import {recoverAccount} from "../controller/Account/recover_acc"
import {authenticate_account} from "../controller/Account/authenticate_acc";
import { changePass } from "../controller/Account/change_pass";
import { authenticate_token } from "../controller/Token/auth_token";

import {get_allAcc} from '../controller/Account/get_allAcc';
 

import upload from '../middleware/handle_upload';
import { delete_Acc } from './../controller/Account/delete_acc';
import { fetchAuditLogs } from './../controller/AuditLog/get_logs';


const router = express.Router();

router.post('/register', upload.single("img"), createAcc_Validation, register_acc)
router.post('/verify', verify_acc)
router.post('/change-pass',authenticate_token, changePass);
router.post('/login', authenticate_account);
router.post('/recover', recoverAccount);

router.get('/get-all/',authenticate_token, get_allAcc);
router.delete('/delete/:accountId', authenticate_token, delete_Acc );
router.get('/audit-logs', authenticate_token,  fetchAuditLogs);



export default router