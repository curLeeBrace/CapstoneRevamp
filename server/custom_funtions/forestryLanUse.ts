import {DEFAULT_FALU_EFACTOR} from "../src/controller/EmmisionFactor/forestLandUseEfactor"
import FALU_EfactorSchema from "../src/db_schema/EmmisisonFactorsSchema/FALU_EfactorSchema"
import WoodSchema from "../src/db_schema/ForestryAndLandUSe/WoodSchema"
import ForestLandSchema from "../src/db_schema/ForestryAndLandUSe/ForestLandSchema"

const getForestLandUseEfactor = async(falu_type: "falu-wood" | "falu-forestland"):Promise<{}> => {
      //SETUP EFACTOR
      let key = falu_type === "falu-wood" ? "wood" : "forestland";
      const db_faluEfactor = await FALU_EfactorSchema.findOne({}, {[key] :1, _id : 0}).lean();
  
      let efactor = {}
      if(db_faluEfactor){
          if(falu_type === "falu-wood") {
              const {charcoal_co2, construction_co2, fuelwood_co2, novelties_co2} = db_faluEfactor.wood
              efactor = {
                  charcoal_co2, 
                  construction_co2, 
                  fuelwood_co2, 
                  novelties_co2
              }
          } else {
              const {laBA_co2, uaG_co2, ufA_co2} = db_faluEfactor.forestland
              efactor = {
                  laBA_co2,
                  uaG_co2,
                  ufA_co2
              }
          }
  
      } else {
          if(falu_type === "falu-wood") {
              efactor = DEFAULT_FALU_EFACTOR.wood
              await FALU_EfactorSchema.create({wood :  DEFAULT_FALU_EFACTOR.wood});
          } else {
              efactor = DEFAULT_FALU_EFACTOR.forestland
              await FALU_EfactorSchema.create({forestland : DEFAULT_FALU_EFACTOR.forestland});
          }
      }


      return efactor
  
      // console.log("E_FACTOR : ", efactor)
      ///////////////////////////////////////////////////////////////////////////////////////////
}
const getFALU_GHGe = async(user_type : string, query:{}, locations:any[], falu_type:"falu-wood"|"falu-forestland"):Promise<{
    loc_name : string,
    ghge : number
}[]> => {

    let falu_ghgeContainer:{
        loc_name : string,
        ghge : number
    }[] = []

    //GET FALLU survey from data
    const dbFALU_data = falu_type === "falu-wood" ? await WoodSchema.find(query).exec() : await ForestLandSchema.find(query);
    const efactor = await getForestLandUseEfactor(falu_type);
    
  


    locations.map((location)=>{
        
        const loc_name = user_type === "s-admin" ? location.city_name : location.brgy_name;
        const root_loc_code = user_type === "s-admin" ? location.city_code : location.brgy_code;
        let temp_ghge = 0;



            dbFALU_data.map( (data:any) => {

                //Check user_type
                if(user_type === "s-admin") {
                    //can use this logic on survey raw data where every single row of data is with computed ghge;
                    const {survey_data} = data
                    if(data.surveyor_info.municipality_code === root_loc_code)  {
                        
                        if(falu_type === "falu-wood"){
                            const {fuelwood, charcoal, construction, novelties} = survey_data;
                            const wood_ghge =  getGHGePerSurvey(efactor, {fuelwood, charcoal, construction, novelties})
                            temp_ghge += wood_ghge
                            
                        } else {    
                            const {ufA, uaG, laBA} = survey_data;
                            const forestLandGHge =  getGHGePerSurvey(efactor, {ufA, uaG, laBA});
                            temp_ghge += forestLandGHge
                        }
                        

                    }
                } else {
                    if(data.survey_data.brgy_code === root_loc_code)  {
                        const {survey_data} = data
                        if(falu_type === "falu-wood"){
                            const {fuelwood, charcoal, construction, novelties} = survey_data;
                            const wood_ghge =  getGHGePerSurvey(efactor, {fuelwood, charcoal, construction, novelties})
                            temp_ghge += wood_ghge
                            
                        } else {    
                            const {ufA, uaG, laBA} = survey_data;
                            const forestLandGHge =  getGHGePerSurvey(efactor, {ufA, uaG, laBA});
                            temp_ghge += forestLandGHge
                        }
                    }
                }
            })
    

        falu_ghgeContainer.push({
            loc_name : loc_name,
            ghge : temp_ghge
        })
        


    })



    return falu_ghgeContainer

} 


const getGHGePerSurvey = (efactor : any, falu_qty : any):number => {

    let total_ghge = 0;

    Object.keys(efactor).forEach(key => {
        total_ghge += efactor[key] * falu_qty[key.split("_")[0]]
    })

    // console.log("GHGE per survvey : ", total_ghge)


    return total_ghge

}


export {
    getFALU_GHGe,
    getGHGePerSurvey,
    getForestLandUseEfactor
}