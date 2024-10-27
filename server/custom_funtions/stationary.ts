import StationarySchema from "../src/db_schema/StationarySchema";


type StationaryDataTypes = {
    cooking : {
        charcoal : number;
        diesel : number;
        kerosene : number;
        propane : number;
        wood : number;
    };
    generator : {
        motor_gasoline : number;
        kerosene : number;
        diesel : number;
        residual_fuelOil : number;
    };
    lighting : {
        kerosene : number;
    };
}


const STATIONARY_EMMISION_FACTOR = {
    cooking : {
        charcoal : {
            co2 : 3.30E+00,
            ch4 : 5.90E-03,
            n2o : 2.95E-05,
        },
        diesel : {
            co2 : 2.66E+00,
            ch4 : 4.00E-04,
            n2o : 2.18E-05,
        },
        kerosene:{
            co2 : 2.52E+00,
            ch4 : 3.50E-04,
            n2o : 2.10E-05,
        },
        propane :{  
            co2 : 2.98E-03,
            ch4 : 2.37E-07,
            n2o : 4.73E-09,
        },
        wood : {
            co2 : 1.75E+00,
            ch4 : 4.68E-03,
            n2o : 6.24E-05,     
        },


    },

    generator : {
        motor_gasoline : {
            co2 : 2.27E+00,
            ch4 : 3.28E-04,
            n2o : 1.97E-05,
        },
        
        kerosene : {
            co2 : 2.52E+00,
            ch4 : 3.50E-04,
            n2o : 2.10E-05,
        },
        diesel : {
            co2 : 2.66E+00,
            ch4 : 4.00E-04,
            n2o : 2.18E-05,
        },
        residual_fuelOil : {
            co2 : 2.94E+00,
            ch4 : 3.80E-04,
            n2o : 2.28E-05,
        }
    },
    lighting :{
        kerosene : {
            co2 : 2.52E+00,
            ch4 : 3.50E-04,
            n2o : 2.10E-05,
        }, 
    }
}

const getStationaryGHGe = async (user_type : string, query : {}, locations : any[]):Promise<number[]> => {
    const ghge_container : number[] = [];

    const stationary_data = await StationarySchema.find(query);

    locations.forEach((loc : any, index) => {
        const root_loc_code = user_type === "s-admin" ? loc.city_code : loc.brgy_code;
        let temp_ghge = 0;

        stationary_data.forEach((data) => {
            const  {cooking, generator, lighting} = data.survey_data;
            if(user_type === "s-admin"){
                if(data.surveyor_info.municipality_code === root_loc_code)  {

                    temp_ghge = getGHGe_perSurvey({
                        cooking : {
                            charcoal : cooking.charcoal,
                            diesel : cooking.diesel,
                            kerosene : cooking.kerosene,
                            propane : cooking.propane,
                            wood : cooking.propane,
                        },
                        generator : {
                            diesel : generator.diesel,
                            kerosene : generator.kerosene,
                            motor_gasoline : generator.motor_gasoline,
                            residual_fuelOil : generator.residual_fuelOil,
                        },
                        lighting : {
                            kerosene : lighting.kerosene
                        }
                    })    
                }
            } else {
                if(data.survey_data.brgy_code === root_loc_code){

                    temp_ghge = getGHGe_perSurvey({
                        cooking : {
                            charcoal : cooking.charcoal,
                            diesel : cooking.diesel,
                            kerosene : cooking.kerosene,
                            propane : cooking.propane,
                            wood : cooking.propane,
                        },
                        generator : {
                            diesel : generator.diesel,
                            kerosene : generator.kerosene,
                            motor_gasoline : generator.motor_gasoline,
                            residual_fuelOil : generator.residual_fuelOil,
                        },
                        lighting : {
                            kerosene : lighting.kerosene
                        }
                    }) 
                }
            }
           


        })
        ghge_container.push(temp_ghge)

    })



    return ghge_container




}




const getGHGe_perSurvey = (stationary_quantity : StationaryDataTypes) : number => {
    let total_ghge = 0;

    const {cooking, generator, lighting} = stationary_quantity

    const getEmmision = (e_factor : {co2:number, ch4:number, n2o : number}, quantity : number) : number => {
        
        const  co2e = (quantity * e_factor.co2) / 1000;
        const  ch4e =  (quantity * e_factor.ch4) / 1000;
        const  n2oe =  (quantity * e_factor.n2o) / 1000;

        const ghge = (co2e * 1) + (ch4e * 28) + (n2oe * 265) 

        return ghge
    }


    const stationary_ghge : StationaryDataTypes = {
        cooking : {
            charcoal : getEmmision(STATIONARY_EMMISION_FACTOR.cooking.charcoal, cooking.charcoal),
            diesel : getEmmision(STATIONARY_EMMISION_FACTOR.cooking.diesel, cooking.diesel),
            kerosene : getEmmision(STATIONARY_EMMISION_FACTOR.cooking.kerosene, cooking.kerosene),
            propane : getEmmision(STATIONARY_EMMISION_FACTOR.cooking.propane, cooking.propane),
            wood : getEmmision(STATIONARY_EMMISION_FACTOR.cooking.wood, cooking.wood),
        },
        generator : {
            diesel : getEmmision(STATIONARY_EMMISION_FACTOR.generator.diesel, generator.diesel),
            kerosene : getEmmision(STATIONARY_EMMISION_FACTOR.generator.kerosene, generator.kerosene),
            motor_gasoline : getEmmision(STATIONARY_EMMISION_FACTOR.generator.motor_gasoline, generator.motor_gasoline),
            residual_fuelOil : getEmmision(STATIONARY_EMMISION_FACTOR.generator.residual_fuelOil, generator.residual_fuelOil),
        },
        lighting : {
            kerosene : getEmmision(STATIONARY_EMMISION_FACTOR.lighting.kerosene, lighting.kerosene),
        }
    }
    

    // const {charcoal, diesel,  kerosene, propane, wood} = stationary_ghge.cooking;
    // const {diesel, kerosene, motor_gasoline, residual_fuelOil} = stationary_ghge.generator;
    

    total_ghge = stationary_ghge.cooking.charcoal + stationary_ghge.cooking.diesel + stationary_ghge.cooking.kerosene + stationary_ghge.cooking.propane + stationary_ghge.cooking.wood +
                stationary_ghge.generator.diesel + stationary_ghge.generator.kerosene + stationary_ghge.generator.motor_gasoline + stationary_ghge.generator.residual_fuelOil +
                stationary_ghge.lighting.kerosene;




    return total_ghge
}





export {
    getStationaryGHGe,
    getGHGe_perSurvey
}




