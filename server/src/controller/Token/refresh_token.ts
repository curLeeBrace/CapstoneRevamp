import { Request, Response, NextFunction } from "express";
import  jwt, { Secret }  from "jsonwebtoken";

//generate new accessToken when client request, to refresh it
export const refresh = async (req : Request, res : Response) => {
    
    const {refresh_token} = req.body;
    console.log("REFRESH TOKEN : ", refresh_token)
    try {
        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET as Secret, (err:any, user:any) => {
            if(err) return res.sendStatus(403);
            console.log("USER EMAIL : ", user.email)
            const access_token = jwt.sign(user.email, process.env.ACCESS_TOKEN_SECRET as Secret);
            return res.status(200).send({access_token});
        })
        
    } catch (error) {
        console.log("REFRESH TOPKEN ERROR!", error)
        return res.status(500).send("REFRESH TOPKEN ERROR!");        
    }
}