import Mineral from "../../src/db_schema/Industrial/MineralSchema";
import Chemical from "../../src/db_schema/Industrial/ChemicalSchema";
import Metal from "../../src/db_schema/Industrial/MetalSchema";
import Electronics from "../../src/db_schema/Industrial/ElectronicsSchema";
import Others from "../../src/db_schema/Industrial/OthersSchema";

import {formulaForGettingIndstrialGHGe, IndustrialEmmisionFactor} from "./industrialAction";





// type MineralTonsData = {
//         cpp : number;
//         cpb : number;
//         lp : number;
//         gp : number;
// }










const getMineralGHGe_perOperation = async (user_type : string, query : {}, locations : any[], mineralEmissionFactors : IndustrialEmmisionFactor[], 
    industryType : "Mineral" | "Chemical" | "Metal" | "Electronics" | "Others") : Promise<number[][]> => {

    let mineralGHGe_container_perOperation : number[][] = []

        
    const IndustrialData = industryType === "Mineral" ? await Mineral.find(query)
    : industryType === "Chemical" ? await Chemical.find(query)
    : industryType === "Metal" ? await Metal.find(query)
    : industryType === "Electronics" ? await Electronics.find(query)
    : await Others.find(query)

    // const mineralEmissionFactor : IndustrialEmmisionFactor = {
    //     CO2 : 2, // this is the most imporrtant
    //     C2F6_1st : 0,
    //     C2F6_2nd : 0,
    //     C3F8 : 0,
    //     C6F14 : 0,
    //     CF4 : 0,
    //     CH4 : 0,
    //     CHF3 : 0,
    //     NF3 : 0,
    //     SF6 : 0
    // }


    // const mineralEmissionFactors : IndustrialEmmisionFactor[] = [mineralEmissionFactor, mineralEmissionFactor ,mineralEmissionFactor ,mineralEmissionFactor]

    locations.forEach((location)=>{

        const root_loc_code = user_type === "s-admin" ? location.city_code : location.brgy_code;


        // let mineralGHE_perOperation : MineralTonsData = {
        //     cpp : 0,
        //     cpb : 0,
        //     lp : 0,
        //     gp : 0,
        // }


        let GHE_perOperation : number[] = industryType === "Mineral" ? [0,0,0,0] 
        :   industryType === "Chemical" ? [0,0,0,0,0,0,0,0]
        :   industryType === "Metal" ? [0,0]
        :   industryType === "Electronics" ? [0,0,0,0]
        :   [0,0,0]



        IndustrialData.forEach((industrialData)=>{
            const {cpp, cpb, lp, gp} = industrialData.survey_data
            const mineralTons :number[] = [cpp, cpb, lp, gp];
    
            if(user_type === "s-admin"){
                if(industrialData.surveyor_info.municipality_code === root_loc_code){

                    const GHGe_perOperation = formulaForGettingIndstrialGHGe(mineralEmissionFactors, mineralTons);

                    GHE_perOperation.forEach((ghge, index)=>{

                        ghge += GHGe_perOperation[index]
                    })
                    // mineralGHE_perOperation.cpp += mineralGHGe[0];
                    // mineralGHE_perOperation.cpb += mineralGHGe[1];
                    // mineralGHE_perOperation.lp += mineralGHGe[2];
                    // mineralGHE_perOperation.gp += mineralGHGe[3];


                }
            } else {
                if(industrialData.survey_data.brgy_code === root_loc_code){
                    const GHGe_perOperation = formulaForGettingIndstrialGHGe(mineralEmissionFactors, mineralTons);
                    // mineralGHE_perOperation.cpp += mineralGHGe[0];
                    // mineralGHE_perOperation.cpb += mineralGHGe[1];
                    // mineralGHE_perOperation.lp += mineralGHGe[2];
                    // mineralGHE_perOperation.gp += mineralGHGe[3];

                    GHE_perOperation.forEach((ghge, index)=>{

                        ghge += GHGe_perOperation[index]
                    })
                }   
            }
        })




        // mineralGHGe_container_perOperation.push();


    })





    return mineralGHGe_container_perOperation



}


export default getMineralGHGe_perOperation