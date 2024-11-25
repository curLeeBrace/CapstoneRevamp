import { Request, Response } from "express";
import StationaryEfactorSchema from "../../db_schema/EmmisisonFactorsSchema/StationaryEfactorSchema";
import { DEFAULT_STATIONARY_EMMISION_FACTOR } from "../../../custom_funtions/stationary";


const getStationarEfactor = async(req:Request, res:Response) => {
    
    try {
        const {category, fuelType} = req.query;


        const nested_keys = `${category}.${fuelType}`;

        const find_efactors = await StationaryEfactorSchema.findOne({}, {
            [nested_keys+".co2"] : 1, 
            [nested_keys+".ch4"] : 1,
            [nested_keys+".n2o"] : 1,
            _id : 0
        });
       


        let efactors = nested_keys.split(".").reduce((acc:any, key)=> acc && acc[key], DEFAULT_STATIONARY_EMMISION_FACTOR);


        if(find_efactors !== null) {
            efactors = nested_keys.split(".").reduce((acc:any, key)=> acc && acc[key], find_efactors);
        } else {
            await StationaryEfactorSchema.create({[nested_keys] : efactors})
        }


        // console.log("DB_Efactors : ", find_efactors);
        // console.log("Efactors : ", efactors);
        return res.status(200).send({e_factors : efactors});

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    
}



export {
    getStationarEfactor
}