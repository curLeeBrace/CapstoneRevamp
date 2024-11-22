import getGHGe_perOperation from "./GHGE_perOperations"
import IndustrialEfactorSchema = require("../../src/db_schema/EmmisisonFactorsSchema/IndustrialEfactorSchema")
//This is the default EmmisionFactor if the system do not find any Emmsion in Database
interface IndustrialEmmisionFactor {
    CO2 : number
    CH4 : number
    CF4 : number
    C2F6_1st : number
    CHF3 : number
    C3F8 : number
    C2F6_2nd : number
    NF3 : number
    SF6 : number
    C6F14 : number
}





const mineral_eFactor : IndustrialEmmisionFactor = {
    CO2 : 2,
    CH4 : 0,
    CF4 : 0,
    C2F6_1st : 0,
    CHF3 : 0,
    C3F8 : 0,
    C2F6_2nd : 0,
    NF3 : 0,
    SF6 : 0,
    C6F14 : 0,
}


const chemical_eFactor: IndustrialEmmisionFactor = 
{
    CO2 : 3,
    CH4 : 3,
    CF4 : 0,
    C2F6_1st : 0,
    CHF3 : 0,
    C3F8 : 0,
    C2F6_2nd : 0,
    NF3 : 0,
    SF6 : 0,
    C6F14 : 0, 
}


const metal_eFactor:IndustrialEmmisionFactor = {
    CO2 : 4,
    CH4 : 4,
    CF4 : 0,
    C2F6_1st : 0,
    CHF3 : 0,
    C3F8 : 0,
    C2F6_2nd : 0,
    NF3 : 0,
    SF6 : 0,
    C6F14 : 0, 
} 

const default_electronicsEfactors : IndustrialEmmisionFactor[]  = [
    {
        CO2 : 0,
        CH4 : 0,
        CF4 : 2,
        C2F6_1st : 2,
        CHF3 : 2,
        C3F8 : 2,
        C2F6_2nd : 0,
        NF3 : 2,
        SF6 : 2,
        C6F14 : 0,  
    },
    {
        CO2 : 0,
        CH4 : 0,
        CF4 : 2,
        C2F6_1st : 0,
        CHF3 : 0,
        C3F8 : 0,
        C2F6_2nd : 0,
        NF3 : 2,
        SF6 : 2,
        C6F14 : 2,  
    },
    {
        CO2 : 0,
        CH4 : 0,
        CF4 : 2,
        C2F6_1st : 2,
        CHF3 : 0,
        C3F8 : 0,
        C2F6_2nd : 0,
        NF3 : 0,
        SF6 : 0,
        C6F14 : 0,  
    },
    {
        CO2 : 0,
        CH4 : 0,
        CF4 : 0,
        C2F6_1st : 0,
        CHF3 : 0,
        C3F8 : 0,
        C2F6_2nd : 0,
        NF3 : 0,
        SF6 : 0,
        C6F14 : 2,  
    }
]
const othersEfactor : IndustrialEmmisionFactor = {
    CO2 : 6,
    CH4 : 0,
    CF4 : 0,
    C2F6_1st : 0,
    CHF3 : 0,
    C3F8 : 0,
    C2F6_2nd : 0,
    NF3 : 0,
    SF6 : 0,
    C6F14 : 0,
}


const default_mineral_eFactors: IndustrialEmmisionFactor[] = [mineral_eFactor, mineral_eFactor, mineral_eFactor,mineral_eFactor] 
const default_chemical_eFactors : IndustrialEmmisionFactor[]= [chemical_eFactor, chemical_eFactor, chemical_eFactor,  chemical_eFactor, chemical_eFactor, chemical_eFactor, chemical_eFactor, chemical_eFactor];
const default_metal_eFactors : IndustrialEmmisionFactor[] = [metal_eFactor, metal_eFactor];
const default_othersEfactors : IndustrialEmmisionFactor[] = [othersEfactor, othersEfactor, othersEfactor]
//End of SettingUp the default Emmision Factor







const ghgeSumPerOperation = (ghgePerOperation : number[][]):number[]=> {
    let ghgeSumContainer:number[] = [];

    ghgePerOperation.forEach((ghges) => {
        let totalGHGe = 0;

        ghges.forEach(ghge =>{
            totalGHGe += ghge
        })

        ghgeSumContainer.push(totalGHGe);

    })


    return ghgeSumContainer
}

//final function
const getIndustrialOverallGHGe = async (user_type : string, query : {}, locations : any[]) : Promise<number[]> => {

    let industrialGHGeContainer:number[] = []

    //will do fetching efactors in database......... then set the default one if no one find....
    
    //check if Efactors is already in mongodb
    const mineral_eFactor = await get_dbEfactor("mineral");
    const chemical_eFactor = await get_dbEfactor("chemical");
    const metal_eFactor = await get_dbEfactor("metal");
    const electronics_eFactor = await get_dbEfactor("electronics");
    const others_eFactor = await get_dbEfactor("others");
    //////////////////////////////////////////////

    //GETTING MINERAL GHGE
    const mineralGHGe = await getGHGe_perOperation(user_type, query, locations, mineral_eFactor ? mineral_eFactor : default_mineral_eFactors, "Mineral");
    const mineralGHGeSum = ghgeSumPerOperation(mineralGHGe);



    ///GETTING CHEMICAL GHGE
    const checmicalGHGe =   await getGHGe_perOperation(user_type, query, locations, chemical_eFactor ? chemical_eFactor : default_chemical_eFactors, "Chemical");
    const chemicalGHGeSum = ghgeSumPerOperation(checmicalGHGe);



    //GETTING METAL GHGE

    const metalGHGe = await getGHGe_perOperation(user_type, query, locations, metal_eFactor ? metal_eFactor : default_metal_eFactors, "Metal");
    const metalGHGeSum = ghgeSumPerOperation(metalGHGe);



    //GETTING ELECTRONICS GHGE
       



    const electronicsGHGe = await getGHGe_perOperation(user_type, query, locations,electronics_eFactor ?electronics_eFactor : default_electronicsEfactors, "Electronics");
    const electronicsGHGeSum = ghgeSumPerOperation(electronicsGHGe);


    //GETTING OTHERS GHGE

    const othersGHGe = await getGHGe_perOperation(user_type, query, locations, others_eFactor ? others_eFactor :  default_othersEfactors, "Others");
    const othersGHGeSum = ghgeSumPerOperation(othersGHGe);

    ///GETTING THE INDUSTRIAL OVERALL GHGE
        locations.forEach((_, index)=>{
            let totalGHGe = 0;

            totalGHGe += mineralGHGeSum[index];
            totalGHGe += chemicalGHGeSum[index]
            totalGHGe += metalGHGeSum[index]
            totalGHGe += electronicsGHGeSum[index]
            totalGHGe += othersGHGeSum[index]
            
            
            industrialGHGeContainer.push(totalGHGe)
  
        })



        return industrialGHGeContainer


}






const formulaForGettingIndstrialGHGe = (emmisionFactor : IndustrialEmmisionFactor[], quantityTons : number[]) : number []=> {
    // You can see it in excel
   
    let co2e_tons = 0;      // CO2 Emissions (tons CO2)
    let ch4e_tons = 0;      // CH4 Emissions (tons CO2)
    let cf4e_tons = 0;      // CF4 Emissions (tons CO2)
    let c2f6e_tons1st = 0;  // C2F6 Emissions (tons CO2)
    let chf3e_tons = 0;     // CHF3  Emissions (tons CO2)
    let c2f6e_tons2nd = 0;  // C2F6 Emissions (tons CO2)
    let nf3e_tons = 0;      // NF3 Emissions (tons CO2)
    let sf6e_tons = 0;      // SF6 Emissions (tons CO2)
    let c6f14e_tons = 0;    // C6F14 Emissions (tons CO2)
    let total_ghgePerOperationContainer : number [] = [];     // "GHG Emissions(tons CO2e)"



    // compute total ghe per operation
    quantityTons.forEach((inputQuanyityTons : number, index)=>{

        const {CO2, CH4, CF4, C2F6_1st, CHF3, C3F8, C2F6_2nd, NF3, SF6, C6F14} = emmisionFactor[index];
        let totalGHGe = 0;
        co2e_tons  = inputQuanyityTons * CO2;
        ch4e_tons = inputQuanyityTons * CH4;
        cf4e_tons = inputQuanyityTons * CF4;
        c2f6e_tons1st = inputQuanyityTons * C2F6_1st;
        chf3e_tons = inputQuanyityTons * CHF3;
        c2f6e_tons2nd = inputQuanyityTons * C2F6_2nd;
        nf3e_tons = inputQuanyityTons * NF3;
        sf6e_tons = inputQuanyityTons * SF6;
        c6f14e_tons = inputQuanyityTons * C6F14;


        totalGHGe = co2e_tons + ch4e_tons + cf4e_tons + c2f6e_tons1st + chf3e_tons + c2f6e_tons2nd + nf3e_tons + sf6e_tons + c6f14e_tons
        total_ghgePerOperationContainer.push(totalGHGe);

    })

    return total_ghgePerOperationContainer

}

const get_dbEfactor = async(industry_type:string):Promise<IndustrialEmmisionFactor[]|undefined> => {

    const db_Efactors = await IndustrialEfactorSchema.findOne({industry_type}).exec();
    
    if(!db_Efactors) return undefined

    return db_Efactors.e_factor;


}


export {
    getIndustrialOverallGHGe,
    formulaForGettingIndstrialGHGe,
    IndustrialEmmisionFactor,
    default_mineral_eFactors,
    default_chemical_eFactors,
    default_metal_eFactors,
    default_othersEfactors,
    default_electronicsEfactors,
    get_dbEfactor
}



