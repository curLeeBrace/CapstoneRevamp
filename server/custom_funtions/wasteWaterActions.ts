import WasteWaterFormSchema from '../src/db_schema/WasteWaterFormShema'
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
    







const getWasteWaterGHGeSum = async (user_type:string , query : {}, locations : any[]) : Promise<number[]>  =>{

    let wasteWaterGHGes : number[]= [];
    const wasteWaterFormDatas = await WasteWaterFormSchema.find(query);

    locations.forEach((location)=> {
        const root_loc_code = user_type === "s-admin" ? location.city_code : location.brgy_code;
        let wasteWaterGHGe = 0;

        wasteWaterFormDatas.forEach((wasteWaterFormData)=>{
            const {septic_tanks, openPits_latrines, riverDischarge}  = wasteWaterFormData.survey_data
            const surveyType = wasteWaterFormData.survey_data.form_type;


            if(user_type === "s-admin"){
                if(wasteWaterFormData.surveyor_info.municipality_code === root_loc_code){
                    wasteWaterGHGe += prepateWasteWaterGHGe({septic_tanks, openPits_latrines, riverDischarge}, surveyType)

                }
            }else {
                if(wasteWaterFormData.survey_data.brgy_code === root_loc_code){
                    wasteWaterGHGe += prepateWasteWaterGHGe({septic_tanks, openPits_latrines, riverDischarge}, surveyType)
                }   
            }
        })

        wasteWaterGHGes.push(wasteWaterGHGe);


    })


    return wasteWaterGHGes

}



export const getWasteWaterData_perSurvey = async (user_type:string , query : {}) : Promise<WasteWaterDataPerSurvey[]> => {

    let wasteWaterDataPerSurvey : WasteWaterDataPerSurvey [] = []
    const wasteWaterFormDatas = await WasteWaterFormSchema.find(query);

    wasteWaterDataPerSurvey = wasteWaterFormDatas.map((dt : any) => {

        const {openPits_latrines, riverDischarge, septic_tanks, form_type} = dt.survey_data
        const wasteWaterGHGe = prepateWasteWaterGHGe({septic_tanks, openPits_latrines, riverDischarge}, form_type)
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
    })


    return wasteWaterDataPerSurvey


}


























const prepateWasteWaterGHGe = (populations : PopulationUsingTheSystems, surveyType : string) : number =>{

    const estimatedTOW = getEstimatedTOW(populations) // getEStimatedTOW
    const chr4Created = getCH4EmmitedTones(estimatedTOW, surveyType) // getCH4Created

    const {openPits_latrines, riverDischarge, septic_tanks} = chr4Created;

    const sumOfWasteWaterGHGe = septic_tanks + openPits_latrines.cat1 + openPits_latrines.cat2 + openPits_latrines.cat3 + openPits_latrines.cat4 + riverDischarge.cat1 + riverDischarge.cat2
    return sumOfWasteWaterGHGe
    

}






const getEstimatedTOW = (populations : PopulationUsingTheSystems) : PopulationUsingTheSystems => {
    const BOD_generation_per_year = 14.60;
    const cfi_BOD_dischargersSewer = 1.00;


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




const getCH4EmmitedTones = (estimatedTOW : PopulationUsingTheSystems, surveyType : string) : PopulationUsingTheSystems => {

    const emmisionFactor : PopulationUsingTheSystems  = surveyType === "residential" ? {
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























