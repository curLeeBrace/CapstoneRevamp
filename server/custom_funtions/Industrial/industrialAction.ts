


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




//final function
const getIndustrialOverallGHGe = (user_type : string, query : string, locations : any[]) => {



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




export {
    formulaForGettingIndstrialGHGe,
    IndustrialEmmisionFactor
}



