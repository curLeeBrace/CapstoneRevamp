//  // This is mobile combustion function
import AgricultureSchema from ".././src/db_schema/AgricultureSchema"





type AgricultureDataTypes = {
    crops : {
        rdsi : number;
        rdsr : number;
        rwsi : number;
        rwsr : number;
        crop_residues : number;
        dol_limestone : number;
    },

    live_stock : {
        buffalo : number
        cattle : number
        goat : number
        horse : number
        poultry : number
        swine : number
        non_dairyCattle : number
    }
}


 const getAgricultureGHGe = async (user_type:string , query : {}, locations : any[]) : Promise<number[]> => {
    const ghge_container : number[] = [];

    const form_data = await AgricultureSchema.find(query);
  

    locations.forEach((loc : any, index) => {

        const root_loc_code = user_type === "s-admin" ? loc.city_code : loc.brgy_code;

        
        let temp_ghge = 0;


        // iterate the form data
        form_data.forEach(data => {

            // check use type
            if(user_type === "s-admin"){
                //check if root_loc_code === data.surveyor_info.municipality_code
                if(data.surveyor_info.municipality_code === root_loc_code)  {
                    //compute the municipality emmisions
                    // const ghge = agricultureGHGeComputation();
        
    
                   
                    // temp_ghge += ghge;
                }

            } else {

                if(data.survey_data.brgy_code === root_loc_code)  {
                    //compute the municipality emmisions
                    // const ghge = agricultureGHGeComputation();
    
                    // temp_ghge += ghge;
                }
            }

        })



        
        ghge_container.push(temp_ghge)

    });




    return ghge_container


 }



 const agricultureTotalGHGe = (surveyData : AgricultureDataTypes) => {


















    const ghge_perAttribue = (qty : number, emmisionFactors : {co2 : number, ch4 : number, n2o : number}) : number => {
        const {ch4, co2, n2o} = emmisionFactors

        
        const  co2e = (qty * co2) / 1000;
        const  ch4e =  (qty * ch4) / 1000;
        const  n2oe =  (qty * n2o) / 1000;

        const ghge = (co2e * 1) + (ch4e * 28) + (n2oe * 265)

        return ghge
       
    }

 }