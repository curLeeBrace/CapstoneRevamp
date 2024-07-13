import dotenv from "dotenv";
dotenv.config();

import { Request, Response, NextFunction } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import TokenSchema from "../../db_schema/TokenSchema";
import CryptoJS from "crypto-js";
import { send_email } from "../../nodemailer";
import crypto from "crypto";
import fs from "fs";
import path from 'path'
import {auditLogType, saveAuditLog} from "../AuditLog/audit_log";
import {authorize, uploadFile} from "../../middleware/g_driveUpload";

interface Acc_Data {
  email: string;
  f_name: string;
  m_name: string;
  l_name: string;
  pass: string;
  date: Date;

  address: string;

  lgu_municipality: string;

  img_name: string;
  img_id : string;
  user_type: string;
}

//controller to create an account
export const register_acc = async (req: Request, res: Response) => {
  const {
    email,
    user_type,
    f_name,
    m_name,
    l_name,
    address,
    date,
    img_name,
    img_id,
    lgu_municipality,
  } = req.body as Acc_Data;

  console.log(req.file);

  //Generate DefaultPassword
  const default_pass = crypto.randomBytes(3).toString("hex");
  ///====Ecnrypt_Pass==
  const secret_key: string = process.env.SECRET_KEY as string;
  const encrypt_pass = CryptoJS.AES.encrypt(default_pass, secret_key);

  const acc_data: Acc_Data = {
    email,
    f_name,
    m_name: m_name ? m_name: "",
    l_name,
    address: JSON.parse(address),
    pass: encrypt_pass.toString(),
    date,
    img_name,
    img_id,
    lgu_municipality: JSON.parse(lgu_municipality),
    user_type, //"0-user | 1-admin | 2-super_admin"
  };

  // const token = CryptoJS.SHA256(crypto.randomUUID()[0].toString()).toString(
  //   CryptoJS.enc.Hex
  // );
  const token = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  console.log(token);
  
  try {
    let register;
    // Create Account and Token to MongooDB

    register = await AccountSchema.create(acc_data);
    await TokenSchema.create({ acc_id: register?._id, token: token });
    const tok = await TokenSchema.findOneAndUpdate(
      { acc_id: register?._id },
      { token: token }
    ).exec();

    if (!tok) {
      await TokenSchema.create({ acc_id: register?._id, token: token });
    }

    //Send verification_link to Gmail
    const base_url: string = process.env.VERIFICATION_URL as string;

    const verification_link = base_url + register?._id + `/${token}`;
    const html = `
        <div>Please click This link : 
            <a href = "${verification_link}">Click me!</a>
            <span> your password is ${default_pass} </>
        to verify your account</div>`;

    send_email({ email, html })
      .then(async (data) => {
        if (data.succsess) {
          //save auditLog after creating an account
          const municipality = JSON.parse(lgu_municipality);
          const log:auditLogType = {
            lgu_municipality: municipality,
            action : `Created ${user_type} account in ${municipality.municipality_name}`,
            dateTime : date,
            user_type : user_type,
            name : f_name + " " + l_name,
          }

          const isSaved = await saveAuditLog(log);

          if(isSaved)  return res.status(201).send("New Account Registered!");

          return res.status(400).send("Bad Request!");
         
        }
        console.log(
          "message after execution of trying sending an email : ",
          data
        );
        return res.status(500).send("Failed to send an E-mail Verificaiton!");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send("Failed to send an E-mail Verificaiton!");
      });

    //------LOGS------
    // console.log("user token ", accesToken)
    // console.log("account type ", req.params);
    // console.log("acc_scope ", acc_scope)
    // console.log("token id ", result_ofCreating._id);
    // console.log(token.split('.')[1])
  } catch (error) {
    console.log(error, "create account!");
    return res.status(500).send("Server Error! in register_acc");
  }
};






//==Middleware==//
//check email if exisiting // validation when crreating an account
export const createAcc_Validation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, img_name, user_type} = req.body as Acc_Data;
  try {
    const acc_info = await AccountSchema.findOne({ email: email }).exec();
    const filePath = path.join(__dirname, `../../../public/img/user_img/${req.body.user_type}/${req.body.img_name}`);


    if (acc_info) {
      if (acc_info.email === email) {
        
        if (fs.existsSync(filePath)) {
          console.log('File path exists');
          if (acc_info.img_name !== img_name) {

            fs.unlink(filePath, (err) => {
              if (err) throw err;
              console.log("File Deleted!");
            });

          }

        }

        return res.status(400).send("Email already in used!");
      }
    }

    //upload image to gdrive

    const folderID = user_type === "lgu_admin" ? ["1qKT1sE8qdqUKZoZL-E-DHLa15J4izl3i"] : ["1Sbwt8lJlev1f_fnoEXcOGNQgNaKG4_yK"]


    const auth = await authorize();

    if(auth){
      // const filePath = req.file?.path;
      const fileName = req.file?.originalname;
      const mimeType = req.file?.mimetype;
      const img_id = await uploadFile(auth, filePath, fileName, mimeType, folderID, res);  // this will return img_id
      req.body['img_id'] = img_id;
    } else {
      console.log("asd")
    }




    next();

   
  } catch (error) {
    return res.status(500).send("Server error in create account validation");
  }
};