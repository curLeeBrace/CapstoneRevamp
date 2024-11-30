import { Request, Response } from "express";
import MobileCombustionEfactorSchema from "../../db_schema/EmmisisonFactorsSchema/MobileCombustionEfactorSchema";


const getMobileCombustionEmmisionFactor = async(req : Request, res : Response) =>{

    const {fuel_type} = req.params

    try {
        const year = new Date().getFullYear().toString()
        const mb_efactor = await MobileCombustionEfactorSchema.findOne({fuel_type, year}).exec();

        if(!mb_efactor) return res.send(
            fuel_type === "diesel" ? {
                co2 : 2.66,
                ch4 : 4.0e-4,
                n2o : 2.18e-5,
            } : {
                co2 : 2.07,
                ch4 : 3.2e-4,
                n2o : 1.9e-4,
            }
        );

        const {co2, ch4, n2o} = mb_efactor;
        return res.send({
            co2,
            ch4,
            n2o,
        })


    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}




const updateMobileCombustionEmmisionFactor = async(req : Request, res : Response) =>{
    const {fuel_type, co2, ch4, n2o} = req.body;

    try {
        const year = new Date().getFullYear().toString()
        const mb_efactor =  await MobileCombustionEfactorSchema.findOneAndUpdate({fuel_type, year}, {
            co2,
            ch4,
            n2o,
        }).exec();

        if(!mb_efactor) {
            await MobileCombustionEfactorSchema.create({
                fuel_type, co2, ch4, n2o, year
            })
        }
        return res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }   

   


}



export {
    getMobileCombustionEmmisionFactor,
    updateMobileCombustionEmmisionFactor
}
