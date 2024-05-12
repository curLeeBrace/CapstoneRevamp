import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import { send_email } from '../../nodemailer';
import crypto from "crypto";
import CryptoJS from 'crypto-js';



export const recoverAccount = async(req : Request, res : Response) => {
    try {

        const {email} = req.body 
        const db_email = await AccountSchema.findOne({email : email}).exec(); // check if email will find
        const secret_key : string = process.env.SECRET_KEY as string;
        if(db_email){
            //Generate DefaultPassword
            const default_pass = crypto.randomBytes(3).toString('hex');
            ///====Ecnrypt_Pass==
            const secret_key : string = process.env.SECRET_KEY as string;
            const encrypt_pass = CryptoJS.AES.encrypt(default_pass, secret_key);
             

            const html = `<div>Your new default pass is <b>${default_pass}</b> you can change it later if you want</div>`

                send_email({email, html})
                .then(async(data)  => {
                    if(data.succsess){
                        await AccountSchema.findOneAndUpdate({email}, {pass: encrypt_pass.toString()}).exec()
                        return res.status(200).send("We give you a default password in your E-mail");
                    } else {
                        return res.status(200).send("Failed to Send Email");
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send("Server Error Cannot process the request");
                })

        } else {

            return res.status(404).send("Email not found!")
        }

    } catch (error) {
        console.log(error)
    }
}