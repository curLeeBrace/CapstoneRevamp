import FuelFormSchema from "../../db_schema/FuelFormSchema";
import {Request, Response} from 'express'

const insertFuelFormData = async (req : Request, res : Response) => {
    try {
        const insert = await FuelFormSchema.create(req.body);

        if(insert) return res.sendStatus(201)
        
        return res.sendStatus(409);


    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }


}







export {
    insertFuelFormData
}