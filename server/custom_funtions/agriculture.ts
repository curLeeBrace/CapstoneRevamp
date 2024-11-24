//  // This is mobile combustion function
import Crops from ".././src/db_schema/Agriculture/AgricultureCrops";
import LiveStocks from ".././src/db_schema/Agriculture/AgricultureLiveStock"
import AgricultureEfactorShema = require("../src/db_schema/EmmisisonFactorsSchema/AgricultureEfactorShema");




type EmmisionFactorTypes = {
    co2 : number, 
    ch4 : number, 
    n2o : number
}


type CropsDataTypes = {
        rdsi : number;
        rdsr : number;
        rwsi : number;
        rwsr : number;
        crop_residues : number;
        dol_limestone : number;
}


type LiveStocksDataTypes = {
        buffalo : number
        cattle : number
        goat : number
        horse : number
        poultry : number
        swine : number
        non_dairyCattle : number
}


const DEFAULT_AGRICULTURE_CROPS_EFACTORS : EmmisionFactorTypes[] = [
     // Crop Residues (tonnes of dry weight) 
     {
        co2 : 0,
        ch4 : 0,
        n2o : 0.19
    },
    // Rice (Dry Season, Irrigated) 

    {
        co2 : 0,
        ch4 : 120,
        n2o : 0
    },
    // Rice (Dry Season, Rainfed) 
    {
        co2 : 0,
        ch4 : 52,
        n2o : 0
    },
    // Rice (Wet Season, Irrigated) 
    {
        co2 : 0,
        ch4 : 326,
        n2o : 0
    },
    // Rice (Wet Season, Rainfed) 
    {
        co2 : 0,
        ch4 : 139,
        n2o : 0
    },
    // Other Crop Type 
    {
        co2 : 0,
        ch4 : 0,
        n2o : 3.14
    },
]






const DEFAULT_AGRICULTURE_LIVESTOCKS_EFACTORS : EmmisionFactorTypes[] =  [
    // Buffalo 
    {
        co2 : 0,
        ch4 : 57,
        n2o : 1.25
    },
    // Cattle 
    {
        co2 : 0,
        ch4 : 48,
        n2o : 1.47
    },
    // Goat 
    {
        co2 : 0,
        ch4 : 5.22,
        n2o : 0.35
    },
    // Horse 
    {
        co2 : 0,
        ch4 : 20.19,
        n2o : 0
    },
    // Poultry 
    {
        co2 : 0,
        ch4 : 0.02,
        n2o : 0.03
    },
    // Swine 
    {
        co2 : 0,
        ch4 : 8,
        n2o : 0.76
    },
    // Other 
    {
        co2 : 0, // emision for others, this is custom,, this is not final, will make a change soon
        ch4 : 0,
        n2o : 0
    },
    
]




 const getAgricultureGHGe = async (user_type:string , query : {}, locations : any[], agricultureType : "crops" | "liveStocks") : Promise<{
    ghge : number
    loc_name : string;
 }[]> => {
    const ghge_container : {
        ghge : number
        loc_name : string;
    }[] = [];

    const form_data = agricultureType === "crops" ? await Crops.find(query) : await LiveStocks.find(query)
    
    locations.forEach(async(location : any, index) => {

        const loc_name = user_type === "s-admin" ? location.city_name : location.brgy_name;

        const root_loc_code = user_type === "s-admin" ? location.city_code : location.brgy_code;

        
        let temp_ghge = 0;

        await Promise.all(
        // iterate the form data
            form_data.map( async (data : any) => {

                let agricultureQtyData :  CropsDataTypes | LiveStocksDataTypes = {} as CropsDataTypes | LiveStocksDataTypes;



                //prepare arguments
                if(agricultureType === "crops") {
                    const {
                        rdsi,
                        rdsr,
                        rwsi,
                        rwsr,
                        crop_residues,
                        dol_limestone,
                    } = data.survey_data.crops 


                    agricultureQtyData = {
                        rdsi,
                        rdsr,
                        rwsi,
                        rwsr,
                        crop_residues,
                        dol_limestone,
                    } as CropsDataTypes

                    
                } else {


                    const {
                        buffalo,
                        cattle,
                        goat,
                        horse,
                        poultry,
                        swine,
                        non_dairyCattle,
                    } = data.survey_data.live_stock

                    agricultureQtyData = {
                        buffalo,
                        cattle,
                        goat,
                        horse,
                        poultry,
                        swine,
                        non_dairyCattle,
                    } as LiveStocksDataTypes

                }





                //compute ghge
                // check use type
                if(user_type === "s-admin"){
                    //check if root_loc_code === data.surveyor_info.municipality_code
                    if(data.surveyor_info.municipality_code === root_loc_code)  {
                    
                        

                        const ghge = await agricultureTotalGHGe(agricultureQtyData, agricultureType);

                        temp_ghge += ghge;

                    }
                } else {

                    if(data.survey_data.brgy_code === root_loc_code)  {
                        const ghge = await agricultureTotalGHGe(agricultureQtyData, agricultureType);

                        temp_ghge += ghge;
                    }
                }

            })
    )



        
        ghge_container.push({
            ghge : temp_ghge,
            loc_name
        })

    });




    return ghge_container


 }






 const agricultureTotalGHGe = async(surveyQtyData : CropsDataTypes | LiveStocksDataTypes, agricultureType : "crops" | "liveStocks") : Promise<number> => {



    let totalghge = 0;
    let emmisionFactors : EmmisionFactorTypes [] = []
    
    const db_agricultureEfactors = await AgricultureEfactorShema.findOne({agriculture_type : agricultureType}).exec();



    if(agricultureType === "crops") {
        if(db_agricultureEfactors) {
            emmisionFactors = db_agricultureEfactors.e_factors;
        } else {

            emmisionFactors = DEFAULT_AGRICULTURE_CROPS_EFACTORS
        }


        const {rdsi, rdsr, rwsi, rwsr, crop_residues, dol_limestone} = surveyQtyData as  CropsDataTypes
        const qtys : number[] = [
            rdsi,
            rdsr,
            rwsi,
            rwsr,
            crop_residues,
            dol_limestone,
        ]


        // emmisionFactors
        totalghge = getGHGe_perAttribue(qtys, emmisionFactors);




    }else {
        
        if(db_agricultureEfactors) {
            emmisionFactors = db_agricultureEfactors.e_factors;
        } else {

            emmisionFactors = DEFAULT_AGRICULTURE_LIVESTOCKS_EFACTORS
        }

        const {
            buffalo,
            cattle,
            goat,
            horse,
            poultry,
            swine,
            non_dairyCattle,
        } = surveyQtyData as LiveStocksDataTypes

        const qtys : number[] = [buffalo, cattle, goat, horse, poultry, swine, non_dairyCattle]

        totalghge = getGHGe_perAttribue(qtys, emmisionFactors);
    }
   
 
    return totalghge

 }



 const getGHGe_perAttribue = (qty : number[], emmisionFactors : EmmisionFactorTypes[]) : number => {
        
    let totalGHGe = 0;

    emmisionFactors.forEach((eFactor, index) => {
        const {ch4, co2, n2o} = eFactor;
        const  co2e = (qty[index] * co2) / 1000;
        const  ch4e =  (qty[index] * ch4) / 1000;
        const  n2oe =  (qty[index] * n2o) / 1000;

        const ghge = (co2e * 1) + (ch4e * 28) + (n2oe * 265)
        totalGHGe += ghge
    })



    return totalGHGe
   
}



export default getAgricultureGHGe

export {
    agricultureTotalGHGe,
    DEFAULT_AGRICULTURE_CROPS_EFACTORS,
    DEFAULT_AGRICULTURE_LIVESTOCKS_EFACTORS
}