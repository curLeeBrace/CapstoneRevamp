import { Request, Response, NextFunction } from "express";
import  Jwt, { Secret }  from "jsonwebtoken";



// it is miiddle-ware
export const authenticate_token = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const auth_header = req.headers.authorization
        console.log("auth_header : ", auth_header)
        const token = auth_header && auth_header.split(' ')[1]
        const secret_key:Secret = process.env.ACCESS_TOKEN_SECRET as Secret;

        if(token == null) return res.sendStatus(401);

        Jwt.verify(token, secret_key , (err, user) => {
            if(err) return res.sendStatus(403)
            req.body.user = user;
            next();
            // res.sendStatus(200);
            
        })
        


    } catch (error) {
        console.log(error);
    }    
}