import dotenv from "dotenv";
dotenv.config();

import { NextFunction, Request, Response } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import TokenSchema from "../../db_schema/TokenSchema";
import CryptoJS from "crypto-js";
import { send_email } from "../../nodemailer";
import crypto from "crypto";
import { auditLogType, saveAuditLog } from "../AuditLog/audit_log";
import path from "path";
import fs from "fs";

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
  user_type: string;
}

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
    lgu_municipality,
  } = req.body as Acc_Data;

  // Generate DefaultPassword
  const default_pass = crypto.randomBytes(3).toString("hex");
  // Encrypt Password
  const secret_key: string = process.env.SECRET_KEY as string;
  const encrypt_pass = CryptoJS.AES.encrypt(default_pass, secret_key).toString();

  const acc_data: Acc_Data = {
    email,
    f_name,
    m_name,
    l_name,
    address: JSON.parse(address),
    pass: encrypt_pass,
    date,
    img_name,
    lgu_municipality: JSON.parse(lgu_municipality),
    user_type, // "0-user | 1-admin | 2-super_admin"
  };

  const token = CryptoJS.SHA256(crypto.randomUUID()).toString(CryptoJS.enc.Hex);

  try {
    // Create Account and Token in MongoDB
    const register = await AccountSchema.create(acc_data);
    await TokenSchema.create({ acc_id: register._id, token });

    const base_url: string = process.env.VERIFICATION_URL as string;
    const verification_link = `${base_url}${register._id}/${token}`;
    const html = `
      <div>Please click this link: 
        <a href="${verification_link}">Click me!</a>
        <span>Your password is ${default_pass}</span>
      to verify your account</div>`;

    send_email({ email, html })
      .then(async (data) => {
        if (data.succsess) {
          // Save audit log after creating an account
          const municipality = JSON.parse(lgu_municipality);
          const log: auditLogType = {
            lgu_municipality: municipality,
            action: `Created ${user_type} account in ${municipality.municipality_name}`,
            dateTime: date,
            user_type,
            name: `${f_name} ${l_name}`,
          };

          const isSaved = await saveAuditLog(log);

          if (isSaved) {
            return res.status(201).send("New Account Registered!");
          } else {
            return res.status(400).send("Failed to save audit log!");
          }
        } else {
          console.error("Failed to send verification email:", data);
          return res.status(500).send("Failed to send email verification!");
        }
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        return res.status(500).send("Failed to send email verification!");
      });
  } catch (error) {
    console.error("Error registering account:", error);
    return res.status(500).send("Server error during registration!");
  }
};

// Middleware to check if email already exists and validate account creation
export const createAcc_Validation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, img_name, user_type } = req.body as Acc_Data;
  try {
    const acc_info = await AccountSchema.findOne({ email }).exec();
    const filePath = path.join(__dirname, '..', '..', 'client', 'public', 'img', 'user_img', user_type, img_name);

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
        return res.status(400).send("Email already in use!");
      }
    }

    next();
  } catch (error) {
    console.error("Error during account validation:", error);
    return res.status(500).send("Server error during account validation!");
  }
};
