import nodemailer from "nodemailer";
import {config} from "dotenv";
config();

export interface Verification_Args {
    email : string;
    html : string;

}

export const send_email = async ({email, html} : Verification_Args) => {
    try {
        // let poolConfig = "smtps://username:password@smtp.example.com/?pool=true";
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port : 465,
            secure : true,
            auth : {
                user : process.env.EMAIL,
                pass : process.env.PASS,
            },
            tls : {
                rejectUnauthorized : true
            }
        });

        //send email
        let info = await transporter.sendMail({
            from : process.env.EMAIL,
            to : email, // the one, who will send verificaiton link 
            subject : "Account Verification",
            text : "Welcome",
            html : `
            <div>${html}</div>
            `
        })
        console.log("Sending Data : ", info.response);
        return {succsess : true, message : "verification link, sucessfully sent!"}
        

       

    } catch (error) {
        console.log(error)
        return {succsess : false, message : "verification link, failed to sent!"}
    }
}


