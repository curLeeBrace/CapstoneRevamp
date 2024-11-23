import { Request, Response } from "express";
import WasteWaterEfactorSchema = require("../../db_schema/EmmisisonFactorsSchema/WasteWaterEfactorSchema");


type WasterWaterEfactorSchemaType = {
    surveyType? : string;
    uncollected : {
        percapitaBODgeneration_perday : number;
        percapitaBODgeneration_peryear : number;
        cfi_BOD_dischargersSewer : number;
        methane_correction_factor : {
            septic_tanks : number
            openPits_latrines : {
                cat1 : number;
                cat2 : number;
                cat3 : number;
                cat4 : number;
            }
            riverDischarge : {
                cat1 : number;
                cat2 : number;
            }
        }
    };
    max_ch4Production : number;
}




const getWasteWaterEfactor = async(req : Request, res :Response) => {
    try {
        const {surveyType} = req.params;
        //This is not totally the WasteWater Emmsion.... just only the name of variable
        //Setup Default Emmision Factor
        const defaultEmmsionFactor : WasterWaterEfactorSchemaType = {
            surveyType : surveyType,
            max_ch4Production : surveyType === "residential" ?  0.60 : 0.25,
            uncollected : {
                percapitaBODgeneration_perday : 40,
                percapitaBODgeneration_peryear : Number(((40*365)/1000).toFixed(2)),
                cfi_BOD_dischargersSewer :  1.00,
                methane_correction_factor : {
                    septic_tanks : 0.5,
                    openPits_latrines : {
                        cat1 : 0.1,
                        cat2 : 0,
                        cat3 : 0.7,
                        cat4 : 0.1
                    },
                    riverDischarge : {
                        cat1 : 0,
                        cat2 : 0
                    }
                }
            }
        }
        //End of Setting up

    
    const wasteWaterEfactor = await WasteWaterEfactorSchema.findOne({surveyType}).exec();
    let response : WasterWaterEfactorSchemaType = {} as WasterWaterEfactorSchemaType;
    if(!wasteWaterEfactor){

        await WasteWaterEfactorSchema.create(defaultEmmsionFactor);

        response = {
            uncollected : {
                cfi_BOD_dischargersSewer : defaultEmmsionFactor.uncollected.cfi_BOD_dischargersSewer,
                percapitaBODgeneration_perday : defaultEmmsionFactor.uncollected.percapitaBODgeneration_perday,
                percapitaBODgeneration_peryear : defaultEmmsionFactor.uncollected.percapitaBODgeneration_peryear,
                methane_correction_factor : {
                    septic_tanks : defaultEmmsionFactor.uncollected.methane_correction_factor.septic_tanks,
                    openPits_latrines : {
                        cat1 : defaultEmmsionFactor.uncollected.methane_correction_factor.openPits_latrines.cat1,
                        cat2 : defaultEmmsionFactor.uncollected.methane_correction_factor.openPits_latrines.cat2,
                        cat3 : defaultEmmsionFactor.uncollected.methane_correction_factor.openPits_latrines.cat3,
                        cat4 : defaultEmmsionFactor.uncollected.methane_correction_factor.openPits_latrines.cat4,
                    },
                    riverDischarge : {
                        cat1 : defaultEmmsionFactor.uncollected.methane_correction_factor.riverDischarge.cat1,
                        cat2 : defaultEmmsionFactor.uncollected.methane_correction_factor.riverDischarge.cat2
                    },
                },
            },
            max_ch4Production : defaultEmmsionFactor.max_ch4Production,
              
        } as WasterWaterEfactorSchemaType


    } else {

        response = {
            uncollected : {
                cfi_BOD_dischargersSewer : wasteWaterEfactor.uncollected.cfi_BOD_dischargersSewer,
                percapitaBODgeneration_perday : wasteWaterEfactor.uncollected.percapitaBODgeneration_perday,
                percapitaBODgeneration_peryear : wasteWaterEfactor.uncollected.percapitaBODgeneration_peryear,
                methane_correction_factor : {
                    septic_tanks : wasteWaterEfactor.uncollected.methane_correction_factor.septic_tanks,
                    openPits_latrines : {
                        cat1 : wasteWaterEfactor.uncollected.methane_correction_factor.openPits_latrines.cat1,
                        cat2 : wasteWaterEfactor.uncollected.methane_correction_factor.openPits_latrines.cat2,
                        cat3 : wasteWaterEfactor.uncollected.methane_correction_factor.openPits_latrines.cat3,
                        cat4 : wasteWaterEfactor.uncollected.methane_correction_factor.openPits_latrines.cat4,
                    },
                    riverDischarge : {
                        cat1 : wasteWaterEfactor.uncollected.methane_correction_factor.riverDischarge.cat1,
                        cat2 : wasteWaterEfactor.uncollected.methane_correction_factor.riverDischarge.cat2
                    },
                },
            },
            max_ch4Production : wasteWaterEfactor.max_ch4Production,
              
        } as WasterWaterEfactorSchemaType

    }
    
    return res.status(200).send(response);


    } catch (error) {

        console.log(error)
        return res.sendStatus(500);
    }
}




const updateWasteWaterEfactor = async(req:Request, res:Response)=>{

    try {
        const {emissionFactors, surveyType} = req.body;
      

        const updateEfactors = await WasteWaterEfactorSchema.findOneAndUpdate({surveyType : surveyType}, emissionFactors).exec();

        if(!updateEfactors) {
            return res.status(204).send("Request is succsess but failed to update emmission factor")
        } else {
            return res.status(200).send("Emission factors updated successfully!");
        }

        



    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}




export {
    getWasteWaterEfactor,
    updateWasteWaterEfactor
}

