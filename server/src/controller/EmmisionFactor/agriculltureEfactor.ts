import { Request, Response } from "express";
import AgricultureEfactorSchema from "../../db_schema/EmmisisonFactorsSchema/AgricultureEfactorShema";
import { DEFAULT_AGRICULTURE_CROPS_EFACTORS, DEFAULT_AGRICULTURE_LIVESTOCKS_EFACTORS } from "../../../custom_funtions/agriculture";



const getAgricultureEfactor = async (req : Request, res : Response) => {
    try {
     

        const {agriculture_type} = req.params;

        const db_agricultureEfactors = await AgricultureEfactorSchema.findOne({agriculture_type}).exec();

        if(!db_agricultureEfactors){

            if(agriculture_type === "crops"){
                await AgricultureEfactorSchema.create({agriculture_type, e_factors : DEFAULT_AGRICULTURE_CROPS_EFACTORS});
                return res.send({agriculture_type, efactors : DEFAULT_AGRICULTURE_CROPS_EFACTORS})
            } else {
                await AgricultureEfactorSchema.create({agriculture_type, e_factors : DEFAULT_AGRICULTURE_LIVESTOCKS_EFACTORS});
                return res.send({agriculture_type, efactors : DEFAULT_AGRICULTURE_LIVESTOCKS_EFACTORS})
            }

        } else {
            return res.send({agriculture_type, efactors : db_agricultureEfactors.e_factors});
        }



    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}



const updateAgricultureEfactor = async (req : Request, res : Response) => {

    try {
        const {agriculture_type, e_factors} = req.body;
        const updateEfactors = await AgricultureEfactorSchema.findOneAndUpdate({agriculture_type, e_factors : e_factors}).exec();

        if(!updateEfactors) {
            return res.status(204).send("Request is succsess but failed to update emmission factor")
        } else {
            return res.status(200).send("Emission factors updated successfully!");
        }
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}




export {
    getAgricultureEfactor,
    updateAgricultureEfactor
}