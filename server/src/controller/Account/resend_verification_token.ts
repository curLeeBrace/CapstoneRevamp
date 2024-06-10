import dotenv from 'dotenv';
dotenv.config();
import CryptoJS from 'crypto-js';
import { send_email} from '../../nodemailer';
import { Request, Response, NextFunction } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import TokenSchema from '../../db_schema/TokenSchema';


const resendToken = async (req:Request, res:Response) => {
    const {email} = req.body;

    try {
        const acc = await AccountSchema.findOne({email}).exec(); //find taht acc and get the acc id
        if(!acc) return res.sendStatus(204);
        const token = CryptoJS.SHA256(crypto.randomUUID()[0].toString()).toString(CryptoJS.enc.Hex);
        const token_info = await TokenSchema.findOneAndUpdate({acc_id : acc._id},{token}).exec(); // update user token
        console.log("token_info ", token_info);
        if(!token_info) return res.sendStatus(204);
       
        //Send verification_link to Gmail
           const base_url : string = process.env.VERIFICATION_URL as string || "http://localhost:5173/verify/account/";
        
           const verification_link = base_url + acc._id + `/${token}`
           const html = `
           <div>Please click This link : 
               <a href = "${verification_link}">Click me!</a>
           to verify your account</div>`
   
           send_email({email, html})
           .then(data => {
               if(data.succsess) {
   
                   return res.sendStatus(200);
   
               }
               console.log("message after execution of trying sending an email : ", data)
               return res.status(500).send("Failed to send an E-mail Verificaiton!")
           })
           .catch(err => {
               console.log(err)
               return res.status(500).send("Failed to send an E-mail Verificaiton!")
           })
        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }





}

export {resendToken};