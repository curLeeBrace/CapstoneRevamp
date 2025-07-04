import { Request, Response } from "express";
import StationaryEfactorSchema from "../../db_schema/EmmisisonFactorsSchema/StationaryEfactorSchema";
import { DEFAULT_STATIONARY_EMMISION_FACTOR } from "../../../custom_funtions/stationary";


const getStationarEfactor = async(req:Request, res:Response) => {
    
    try {
        const year = new Date().getFullYear().toString()
        const {category, fuelType} = req.query;


        const nested_keys = `${category}.${fuelType}`;

        const find_efactors = await StationaryEfactorSchema.findOne({year}, {
            [nested_keys+".co2"] : 1, 
            [nested_keys+".ch4"] : 1,
            [nested_keys+".n2o"] : 1,
            _id : 0
        });
       


        let efactors = nested_keys.split(".").reduce((acc:any, key)=> acc && acc[key], DEFAULT_STATIONARY_EMMISION_FACTOR);


        if(find_efactors !== null) {
            efactors = nested_keys.split(".").reduce((acc:any, key)=> acc && acc[key], find_efactors);
        } else {
            await StationaryEfactorSchema.create({[nested_keys] : efactors, year})
        }


        // console.log("DB_Efactors : ", find_efactors);
        // console.log("Efactors : ", efactors);
        return res.status(200).send({e_factors : efactors});

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    
}


 
const updateStationarEfactor = async(req:Request, res:Response) => {

    try {
        
        const {category, fuelType, e_factor} = req.body
        const nested_keys = `${category}.${fuelType}`;
        const year = new Date().getFullYear().toString()
        const update_efactor = await StationaryEfactorSchema.findOneAndUpdate({year}, {[nested_keys] : e_factor}).exec();

       
        if(!update_efactor) {
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
    getStationarEfactor,
    updateStationarEfactor
}