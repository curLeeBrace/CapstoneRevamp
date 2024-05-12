import { Request, Response, NextFunction } from "express";
import  jwt, { Secret }  from "jsonwebtoken";

//generate new accessToken when client request, to refresh it
export const refresh = async (req : Request, res : Response) => {
    
    const {refresh_token} = req.body;
    
    try {
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET as Secret, (err:any, user:any) => {
            if(err) return res.sendStatus(403);
            const access_token = jwt.sign(user.email, process.env.ACCESS_TOKEN_SECRET as Secret);
            res.json({access_token});
        })
        
    } catch (error) {
        console.log(error)
        res.sendStatus(500);        
    }
}