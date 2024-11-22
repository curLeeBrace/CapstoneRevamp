import { Request, Response } from "express";
import IndustrialEfactorSchema from "../../db_schema/EmmisisonFactorsSchema/IndustrialEfactorSchema";
import { default_mineral_eFactors, default_chemical_eFactors, default_metal_eFactors, default_electronicsEfactors, default_othersEfactors} from "../../../custom_funtions/Industrial/industrialAction"; 





const getIndustrialEfactor = async(req : Request, res : Response) => {

    const {industry_type} = req.params;

    try {
        
        const industrial_efactor = await IndustrialEfactorSchema.findOne({industry_type}).exec();

        if(!industrial_efactor) {
            if(industry_type == "mineral"){
                await IndustrialEfactorSchema.create({industry_type, e_factor : default_mineral_eFactors});
                return res.send(default_mineral_eFactors);
            } else if (industry_type == "chemical"){
                await IndustrialEfactorSchema.create({industry_type, e_factor : default_chemical_eFactors});
                return res.send(default_chemical_eFactors);
            } else if(industry_type == "metal"){
                await IndustrialEfactorSchema.create({industry_type, e_factor : default_metal_eFactors});
                return res.send(default_metal_eFactors);
            } else if(industry_type == "electronics"){
                await IndustrialEfactorSchema.create({industry_type, e_factor : default_electronicsEfactors});
                return res.send(default_electronicsEfactors);
            } else {
                await IndustrialEfactorSchema.create({industry_type, e_factor : default_othersEfactors});
                return res.send(default_othersEfactors)
            }

        } else {
            return res.send(industrial_efactor.e_factor);
        }

    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }



}


const updateIndustrialEfactor = async(req:Request, res:Response) => {
    
    const {emissionFactors, industry_type} = req.body


    try {
        const efactor = await IndustrialEfactorSchema.findOneAndUpdate({industry_type, e_factor : emissionFactors});

        if(!efactor){
            return res.status(204).send("Request is succsess but failed to update emmission factor")
        } else {

            return res.status(200).send("Emission factors updated successfully!");
        }



    } catch (error) {

        console.log(error)
        return res.sendStatus(500);

    }










}



export {
    getIndustrialEfactor,
    updateIndustrialEfactor
}