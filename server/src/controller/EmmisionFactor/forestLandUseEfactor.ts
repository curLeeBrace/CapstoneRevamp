import { Request, Response } from "express"; 
import FALU_EfactorSchema from "../../db_schema/EmmisisonFactorsSchema/FALU_EfactorSchema";


const DEFAULT_FALU_EFATOR = {
    wood : {
        fuelwood_co2 : 1.80,
        charcoal_co2 : 0,
        construction_co2 : 1.80,
        novelties_co2 : 0,
    },
    forestland : {
        ufA_co2 : 0,
        uaG_co2 : 0,
        laBA_co2 : 0,
    }

}



const getforestLandUseEfactor = async(req : Request, res:Response) => {

    try {
        const {falu_type} = req.params
        let key = falu_type === "falu-wood" ? "wood" : "forestland";
        const db_faluEfactor = await FALU_EfactorSchema.findOne({}, {[key] :1, _id : 0}).lean();
        let response_efactors = {};


        if(db_faluEfactor){
            if(falu_type === "falu-wood") {
                const {charcoal_co2, construction_co2, fuelwood_co2, novelties_co2} = db_faluEfactor.wood
                response_efactors = {
                    charcoal_co2, 
                    construction_co2, 
                    fuelwood_co2, 
                    novelties_co2
                }
            } else {
                const {laBA_co2, uaG_co2, ufA_co2} = db_faluEfactor.forestland
                response_efactors = {
                    laBA_co2,
                    uaG_co2,
                    ufA_co2
                }
            }

        } else {
            if(falu_type === "falu-wood") {
                response_efactors = DEFAULT_FALU_EFATOR.wood
                await FALU_EfactorSchema.create({wood :  DEFAULT_FALU_EFATOR.wood});
            } else {
                response_efactors = DEFAULT_FALU_EFATOR.forestland
                await FALU_EfactorSchema.create({forestland : DEFAULT_FALU_EFATOR.forestland});
            }
        }


        return res.status(200).send({efactor : response_efactors});




    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}


const updatedforestLandUseEfactor = async(req:Request, res:Response) => {

   
    try {
        
        const {falu_type, e_factor} = req.body
        let key = falu_type === "falu-wood" ? "wood" : "forestland";
        console.log("KEY : ", key);
        const update_efactor = await FALU_EfactorSchema.findOneAndUpdate({}, {[key] : e_factor}).exec();
        console.log("update_efactor : ", update_efactor)
       
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

export  {
    getforestLandUseEfactor,
    updatedforestLandUseEfactor
}