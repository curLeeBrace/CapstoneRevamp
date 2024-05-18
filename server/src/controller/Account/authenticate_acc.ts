import { Request, Response, NextFunction } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import  jwt, { Secret }  from "jsonwebtoken";
import CryptoJS from "crypto-js";

interface AuthBody {
    email : string;
    encrypt_pass : string;
}


// interface Respo {
//     access_token : string;
//     refresh_token : string;
//     email : string;
//     acc_type : string;
//     verified : boolean;
//     scope_code : string;
//     scope_name : string;
//     name : string;
//     admin_type? : "input" | "checker";

   
// }



export const authenticate_account = async (req : Request, res : Response) => {
    const {email, encrypt_pass} : AuthBody = req.body as AuthBody;
    
    try {
        
        const auth_acc = await AccountSchema.findOne({email}).exec();

        // console.log("Account Data : ", auth_acc)

        //First Find Email if request email is existing in database
        if(auth_acc){
            const {email, user_type, verified, lgu_municipality, f_name, img_name, m_name, l_name} = auth_acc;
            // const {location_scope_code, location_scope_name} = acc_scope;
      
            const encrypted_db_pass = auth_acc.pass;
             ///====Decrypt_Pass==
            const secret_key : string = process.env.SECRET_KEY as string;
            const decrypt_pass = CryptoJS.AES.decrypt(encrypt_pass.toString(), secret_key)
            const decrypt_db_pass = CryptoJS.AES.decrypt(encrypted_db_pass.toString(), secret_key)
            
            //==Password_Log===
            // console.log("decrypt_pass : ", decrypt_pass.toString(CryptoJS.enc.Utf8));
            // console.log("decrypt_db_pass : ", decrypt_db_pass.toString(CryptoJS.enc.Utf8));


            if(decrypt_pass.toString(CryptoJS.enc.Utf8) === decrypt_db_pass.toString(CryptoJS.enc.Utf8)) {
                
                const access_token = jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET as Secret);
                const refresh_token = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET as Secret);
                       
                        const respo = {
                            email,
                            hash_pass: encrypted_db_pass,
                            municipality_code : lgu_municipality.municipality_code,
                            municipality_name : lgu_municipality.municipality_name,
                            province_code : lgu_municipality.province_code,
                            access_token,
                            refresh_token,
                            verified,
                            user_type,
                            username : f_name,
                            img_name,
                            full_name : `${f_name} ${m_name && m_name[0]} ${l_name}`
                        }
            
            
                        return res.status(200).json(respo)
            } else {
                
                return res.sendStatus(401);
            }

        } 

        return res.sendStatus(404);


    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
    


}


