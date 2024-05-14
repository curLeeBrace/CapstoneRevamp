import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import TokenSchema from '../../db_schema/TokenSchema';
import CryptoJS from 'crypto-js';
import { send_email} from '../../nodemailer';
import crypto from "crypto";




interface Acc_Data {
    email : string;
    f_name : string;
    m_name : string;
    l_name : string;
    pass : string;
    date : Date;

    address :string;

    lgu_municipality :string;

    img_name : string;
    user_type : string;
}


//controller to create an account
export const register_acc = async (req:Request, res:Response) => {
    const {email, user_type, f_name,
        m_name,
        l_name,
        address,
        date,
        img_name,
        lgu_municipality,
    } = req.body as Acc_Data

    console.log(req.body)
  
  

    //Generate DefaultPassword
    const default_pass = crypto.randomBytes(3).toString('hex');
    ///====Ecnrypt_Pass==
    const secret_key : string = process.env.SECRET_KEY as string;
    const encrypt_pass = CryptoJS.AES.encrypt(default_pass, secret_key);



    const acc_data : Acc_Data = {
        email,
        f_name,
        m_name,
        l_name,
        address : JSON.parse(address),
	    pass : encrypt_pass.toString(),
        date,
        img_name,
        lgu_municipality : JSON.parse(lgu_municipality),
	    user_type, //"0-user | 1-admin | 2-super_admin"

    } 

    const token = CryptoJS.SHA256(crypto.randomUUID()[0].toString()).toString(CryptoJS.enc.Hex);
    
    
    try {

        let register;
        // Create Account and Token to MongooDB

        register = await AccountSchema.create(acc_data);
        await TokenSchema.create({acc_id : register?._id, token : token})
        const tok =  await TokenSchema.findOneAndUpdate({acc_id : register?._id},{token : token}).exec();

        if(!tok){
            await TokenSchema.create({acc_id : register?._id, token : token})
        }
        
     
        
      

        

        
        //Send verification_link to Gmail
        const base_url : string = process.env.VERIFICATION_URL as string;

        const verification_link = base_url + register?._id + `/${token}`
        const html = `
        <div>Please click This link : 
            <a href = "${verification_link}">Click me!</a>
            <span> your password is ${default_pass} </>
        to verify your account</div>`

        send_email({email, html})
        .then(data => {
            if(data.succsess) {

                return res.status(201).send("Sucessfully register!");

            }
            console.log("message after execution of trying sending an email : ", data)
            return res.status(500).send("Failed to send an E-mail Verificaiton!")
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send("Failed to send an E-mail Verificaiton!")
        })

        //------LOGS------
        // console.log("user token ", accesToken)
        // console.log("account type ", req.params);
        // console.log("acc_scope ", acc_scope)
        // console.log("token id ", result_ofCreating._id);
        // console.log(token.split('.')[1])
        
        
    } catch (error) {

        console.log(error)
    }

}





























//==Middleware==//

// //check email if exisiting // validation when crreating an account
// export const createAcc_Validation = async (req:Request, res:Response, next:NextFunction) => {
 
//     const {email, acc_scope, admin_type, new_email} = req.body as Acc_Data
//     const {registration_type} = req.params;
//     const {location_scope_code} = acc_scope;
 
   
//         const acc_info = await AccountSchema.findOne({
//             $and : [
//                 {email : registration_type === "create"? email : new_email},
//                 {$and : [{admin_type}, {"acc_scope.location_scope_code" : location_scope_code}]},
//             ]
//         }).exec();



    
//         console.log("Acc Info : ", acc_info)
//         if(acc_info){
//             if(acc_info.email === email){
//                 return res.status(200).send("Email already in used!");
//             } else {
//                 return res.status(200).send("Only 2 accounts are valid per municipality!  1 for 'inputter' and 1 for 'checker'");
//             }
//         }
    
//     next();

// }