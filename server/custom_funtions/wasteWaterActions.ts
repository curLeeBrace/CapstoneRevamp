import WasteWaterFormSchema from '../src/db_schema/WasteWaterFormShema'
import WasteWaterEfactorSchema from '../src/db_schema/EmmisisonFactorsSchema/WasteWaterEfactorSchema';
/* 
    WASTE WATER VARIABLES AND FORMULA

    ==============VARIABLES=========================

    uncollected : {
        Per capita BOD generation (per year) =  14.60 
        Correction factor for industrial BOD dischargers in sewers =  1.00
    }


    (optional)
    collected : {
        Per capita BOD generation (per year) =  14.60 
        Correction factor for industrial BOD dischargers in sewers =  1.25
    }

    Population using the system = Population 
    Estimated TOW residential = kgBOD/year
    Emission Factor = kgCH4/kgBOD
    CH4 created = kgCH4
    CH4 recovered = kgCH4
    % CH4 recovered = %
    CH4 emitted = kgCH4
    GWP CH4 = GWP
    CH4 emitted (in kg CO2e) = kgCO2e
    CH4 emitted (in tonnes of CO2e) = tCO2e





    ======================================FORMULA===========================================

    Estimated TOW residential = ( Population * Per capita BOD generation (per year) * Correction factor for industrial BOD dischargers in sewers)

    CH4 created = (Estimated TOW producing CH4 * Emission Factor)
    CH4 emitted = just remove decimal point of CH4 created if CH4 recovered is forever blank
    CH4 emitted (in kg CO2e) = (CH4 emitted * GWP CH4)
    CH4 emitted (in tonnes of CO2e) = (CH4 emitted (in kg CO2e) / 1000)


*/



export interface PopulationUsingTheSystems {
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


interface WasteWaterDataPerSurvey{
    populationUsingTheSystems : PopulationUsingTheSystems;
    wasteWaterGHGe : number;
    surveyor : string;
    dateTime: Date
}



type WasteWaterEfatorType = {
    surveyType : string;
    uncollected : {
        percapitaBODgeneration_perday : number;
        percapitaBODgeneration_peryear : number;
        cfi_BOD_dischargersSewer : number;
        methane_correction_factor : PopulationUsingTheSystems // but this is a mehtane factor
    }
    max_ch4Production : number;
}
    






const getWasteWaterGHGeSum = async (user_type:string , query : {}, locations : any[]) : Promise<{
    ghge:number,
    loc_name : string
}[]>  =>{

    let wasteWaterGHGes : {
        ghge:number,
        loc_name : string
    }[]= [];
    const wasteWaterFormDatas = await WasteWaterFormSchema.find(query);
    
    // const sort_locations = locations.sort((a: { city_name: string, brgy_name: string }, b: { city_name: string, brgy_name: string }) => {
    //     return user_type === "s-admin" 
    //         ? a.city_name.localeCompare(b.city_name) 
    //         : a.brgy_name.localeCompare(b.brgy_name);
    // });


    // console.log("SORT LOcATIONS : ",)
    


        locations.map(async(location)=> {
            const root_loc_code = user_type === "s-admin" ? location.city_code : location.brgy_code;
            const loc_name = user_type === "s-admin" ? location.city_name : location.brgy_name;
            let wasteWaterGHGe = 0;

            await Promise.all(
                wasteWaterFormDatas.map(async(wasteWaterFormData)=>{
                    const {septic_tanks, openPits_latrines, riverDischarge, form_type}  = wasteWaterFormData.survey_data
                    const surveyType = wasteWaterFormData.survey_data.form_type;
                    const waste_wateEfactorData : WasteWaterEfatorType|null = await WasteWaterEfactorSchema.findOne({surveyType : form_type}).exec() as WasteWaterEfatorType|null;

                    
                    if(user_type === "s-admin"){
                        if(wasteWaterFormData.surveyor_info.municipality_code === root_loc_code){
                            const temp_ghge = await prepateWasteWaterGHGe({septic_tanks, openPits_latrines, riverDischarge}, surveyType, waste_wateEfactorData)
                            wasteWaterGHGe += temp_ghge

                        }
                    }else {
                        if(wasteWaterFormData.survey_data.brgy_code === root_loc_code){
                            const temp_ghge = await prepateWasteWaterGHGe({septic_tanks, openPits_latrines, riverDischarge}, surveyType, waste_wateEfactorData)
                            wasteWaterGHGe += temp_ghge
                        }   
                    }
                })
            )
            wasteWaterGHGes.push({
                ghge : wasteWaterGHGe,
                loc_name
            });


        })
    


    return wasteWaterGHGes

}



export const getWasteWaterData_perSurvey = async (user_type:string , query : {}) : Promise<WasteWaterDataPerSurvey[]> => {

    let wasteWaterDataPerSurvey : WasteWaterDataPerSurvey [] = []
    const wasteWaterFormDatas = await WasteWaterFormSchema.find(query);
    
    

    wasteWaterDataPerSurvey = await Promise.all(wasteWaterFormDatas.map(async (dt : any) => {

        const {openPits_latrines, riverDischarge, septic_tanks, form_type} = dt.survey_data
        const waste_wateEfactorData : WasteWaterEfatorType|null = await WasteWaterEfactorSchema.findOne({surveyType : form_type}).exec() as WasteWaterEfatorType|null;
        console.log("waste_wateEfactorData : ", waste_wateEfactorData);


        const wasteWaterGHGe = await prepateWasteWaterGHGe({septic_tanks, openPits_latrines, riverDischarge}, form_type, waste_wateEfactorData)
        const {email, municipality_name} = dt.surveyor_info 
        return {
            form_id : dt._id,
            email,
            municipality_name,
            brgy_name : dt.survey_data.brgy_name as string,
            
            populationUsingTheSystems : {
                openPits_latrines,
                riverDischarge,
                septic_tanks
            },
            wasteWaterGHGe,
            dateTime : dt.dateTime_created,
            surveyor : dt.surveyor_info.full_name
            
        }
    }))


    return wasteWaterDataPerSurvey


}







const prepateWasteWaterGHGe = async (populations : PopulationUsingTheSystems, surveyType : string, wasteWater_eFactor : WasteWaterEfatorType|null) : Promise<number> =>{


    
    const estimatedTOW = await getEstimatedTOW(populations, wasteWater_eFactor) // getEStimatedTOW
    const chr4Created = await getCH4EmmitedTones(estimatedTOW, surveyType, wasteWater_eFactor) // getCH4Created

    const {openPits_latrines, riverDischarge, septic_tanks} = chr4Created;

    const sumOfWasteWaterGHGe = septic_tanks + openPits_latrines.cat1 + openPits_latrines.cat2 + openPits_latrines.cat3 + openPits_latrines.cat4 + riverDischarge.cat1 + riverDischarge.cat2
    return sumOfWasteWaterGHGe
    
}






const getEstimatedTOW = async (populations : PopulationUsingTheSystems, wasteWater_eFactor : WasteWaterEfatorType | null) : Promise<PopulationUsingTheSystems> => {

    //This is Static value
    let BOD_generation_per_year = 14.60; // will auto compute
    let cfi_BOD_dischargersSewer = 1.00; // will be customizable

    //This Value is from Database if wasteWater_eFactor is not = to undefined
    if(wasteWater_eFactor !== null) {
        const {percapitaBODgeneration_perday} = wasteWater_eFactor.uncollected
        BOD_generation_per_year =  (percapitaBODgeneration_perday * 365)/1000;
        cfi_BOD_dischargersSewer = wasteWater_eFactor.uncollected.cfi_BOD_dischargersSewer
    }
    


    //computeSingleEstimatedTOW 
    const computeSingleEstimatedTOW = (user_qty:number) : number => (user_qty * BOD_generation_per_year * cfi_BOD_dischargersSewer)
    const {openPits_latrines, riverDischarge, septic_tanks} = populations



    
    const estimatedTOW : PopulationUsingTheSystems = {
            septic_tanks : computeSingleEstimatedTOW(septic_tanks),
            openPits_latrines :{
                cat1 : computeSingleEstimatedTOW(openPits_latrines.cat1),
                cat2 : computeSingleEstimatedTOW(openPits_latrines.cat2),
                cat3 : computeSingleEstimatedTOW(openPits_latrines.cat3),
                cat4 : computeSingleEstimatedTOW(openPits_latrines.cat4),

            },
            riverDischarge: {
                cat1 : computeSingleEstimatedTOW(riverDischarge.cat1),
                cat2 : computeSingleEstimatedTOW(riverDischarge.cat2),
            }
    }
        



    
    return estimatedTOW

}




const getCH4EmmitedTones = async (estimatedTOW : PopulationUsingTheSystems, surveyType : string, wasteWater_eFactor : WasteWaterEfatorType|null) : Promise<PopulationUsingTheSystems> => {
    

    //SETUP DEFAULT EMMISION FACTOR
    let emmisionFactor : PopulationUsingTheSystems  = surveyType === "residential" ? {
        septic_tanks : 0.30,
        openPits_latrines : {
            cat1 : 0.06,
            cat2 : 0.00,
            cat3 : 0.42,
            cat4 : 0.06
        },
        riverDischarge : {
            cat1 : 0.00,
            cat2 : 0.00
        }


    } : {
        septic_tanks : 0.13,
        openPits_latrines : {
            cat1 : 0.03,
            cat2 : 0.00,
            cat3 : 0.18,
            cat4 : 0.03
        },
        riverDischarge : {
            cat1 : 0.00,
            cat2 : 0.00
        }
    }
    /////////////////////////////////////
    //Get the methane factor to database, then compute the tatoal emmsion factor for every category...
    const computeEFactor = (max_ch4Production:number, methane_correction_factor :number) => {return max_ch4Production * methane_correction_factor}
    if(wasteWater_eFactor !== null){

        const {methane_correction_factor} = wasteWater_eFactor.uncollected;
        const {max_ch4Production} = wasteWater_eFactor

        emmisionFactor = {
            septic_tanks : computeEFactor(max_ch4Production, methane_correction_factor.septic_tanks),
            openPits_latrines : {
                cat1 : computeEFactor(max_ch4Production, methane_correction_factor.openPits_latrines.cat1),
                cat2 : computeEFactor(max_ch4Production, methane_correction_factor.openPits_latrines.cat1),
                cat3 : computeEFactor(max_ch4Production, methane_correction_factor.openPits_latrines.cat3),
                cat4 : computeEFactor(max_ch4Production, methane_correction_factor.openPits_latrines.cat4),
            },
            riverDischarge : {
                cat1 : computeEFactor(max_ch4Production, methane_correction_factor.riverDischarge.cat1),
                cat2 : computeEFactor(max_ch4Production, methane_correction_factor.riverDischarge.cat2),
            }
        }

    }






    //computation or formula form CH4Created
    const computeCH4_emitedTones = (emmisionFactor : number, estimatedTOW : number) : number => {
        const chr4Emmited = (estimatedTOW * emmisionFactor); // compute CH4 emitted
        const gwpCh4 = 28;
        const chr4EmmitedKg = chr4Emmited * gwpCh4; // compute CH4 emitted (in kg CO2e)
        const ch4EmmitedTones = chr4EmmitedKg / 1000; // compute CH4 emitted (in tonnes of CO2e)

        return ch4EmmitedTones;

    }


    const chr4Created : PopulationUsingTheSystems = {
        septic_tanks : computeCH4_emitedTones(emmisionFactor.septic_tanks, estimatedTOW.septic_tanks),
        openPits_latrines : {
            cat1 : computeCH4_emitedTones(emmisionFactor.openPits_latrines.cat1, estimatedTOW.openPits_latrines.cat1),
            cat2 : computeCH4_emitedTones(emmisionFactor.openPits_latrines.cat2, estimatedTOW.openPits_latrines.cat2),
            cat3 : computeCH4_emitedTones(emmisionFactor.openPits_latrines.cat3, estimatedTOW.openPits_latrines.cat3),
            cat4 : computeCH4_emitedTones(emmisionFactor.openPits_latrines.cat4, estimatedTOW.openPits_latrines.cat4),
        },
        riverDischarge : {
            cat1 : computeCH4_emitedTones(emmisionFactor.riverDischarge.cat1, estimatedTOW.riverDischarge.cat1),
            cat2 : computeCH4_emitedTones(emmisionFactor.riverDischarge.cat2, estimatedTOW.riverDischarge.cat2),
        }
    }



    return chr4Created


}




export default getWasteWaterGHGeSum





