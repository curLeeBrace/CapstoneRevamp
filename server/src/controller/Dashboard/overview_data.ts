import { Request, Response, NextFunction } from "express";
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import municipality_json from "../../../ph-json/city.json";
import AccountSchema from "../../db_schema/AccountSchema";
interface Municipality {
    city_code : String;
    city_name : String;
    province_code : String;
}
export type Emission = {
    co2e : number;
    ch4e : number;
    n2oe : number;
    ghge : number;
}

type TableData = {
    municipality : String;
    municipality_code : String;
    emission : Emission;
}


type DashBoardData = {
    total_surveryor : number;
    total_LGU_admins : number;
    today_ghge : number;
    table_data : TableData[]

 }
 

 const overview_data = async (req : Request, res : Response) => {
    const {province_code, user_type, municipality_code} = req.params;
    try {
        

          
            const accounts = user_type === "s-admin" ? await AccountSchema.find({'lgu_municipality.province_code' : province_code}) : await AccountSchema.find({'lgu_municipality.province_code' : province_code, 'lgu_municipality.municipality_code' : municipality_code});
            let today_ghge = 0;

            const lgu_admin = accounts.filter(acc => acc.user_type === "lgu_admin");
            const surveyor = accounts.filter(acc => acc.user_type === "surveyor");
            const mobileComstion_data =  await get_mobileComstion_data(province_code, {'surveyor_info.province_code': province_code});

            mobileComstion_data.forEach(mb_data => {
                    if(user_type === "s-admin"){
                        today_ghge += mb_data.emission.ghge;

                    } else {
                        if(municipality_code === mb_data.municipality_code){
                            today_ghge += mb_data.emission.ghge;
                        }
                    }
            })
    
            const response : DashBoardData = {
                    total_LGU_admins : lgu_admin.length,
                    total_surveryor : surveyor.length,
                    table_data: mobileComstion_data,
                    today_ghge,
            }
    
    
            return res.status(200).json(response);


      
        
        




    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }


 }






 const get_mobileComstion_data = async (province_code : string, query : {}) : Promise<TableData[]> => {

    const table_data : TableData[] = [];
    const municipalities : Municipality[] = municipality_json.filter((municipality) => municipality.province_code === province_code); // get all municipalities depends on province code
    

    // // Set the start of today to 00:00:00.000
    // const start = new Date();
    // start.setHours(0, 0, 0, 0);
    // // Set the end of today to 23:59:59.999
    // const end = new Date();
    // end.setHours(23, 59, 59, 999);


    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // const form_data = await FuelFormSchema.find({
    //     $and: [
    //         {'surveyor_info.province_code': province_code},
    //         {dateTime_created: {
    //             $gte : startOfMonth,
    //             $lte : endOfMonth
    //         }}
    //     ]
    // }); // find all fuel form data today in that province_code or province_name

    const form_data = await FuelFormSchema.find(query);
    // console.log("query : ", query)

    //iterate municipalities
    municipalities.forEach((municipality, index) => {
        const municipality_code = municipality.city_code;
        let tb_co2e = 0;
        let tb_ch4e = 0;
        let tb_n2oe = 0;
        let tb_ghge = 0;


        form_data.forEach(data => {

            if(data.surveyor_info.municipality_code === municipality_code)  {
                //compute the municipality emmisions
                const single_form_emmmsion = get_emission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion

                tb_co2e += co2e;
                tb_ch4e += ch4e;
                tb_n2oe += n2oe;
                tb_ghge += ghge;

            }
        })
        
        table_data.push({
            municipality : municipality.city_name,
            municipality_code : municipality_code,
            emission : {
                co2e : tb_co2e,
                ch4e : tb_ch4e,
                n2oe : tb_n2oe,
                ghge : tb_ghge,
            }
        })

    });


    return table_data


 }




 const get_emission = (fuel_type : string,  liters_consumption: number) : Emission  => {

     /*
        ==========================================
            -------Conversion-Factor-----
            co2 = 1
            ch4 = 28
            n20 = 265

         ==========================================
    */

    const emission_factors = fuel_type === "diesel" ? {
        co2 : 2.66,
        ch4 : 4.0e-4,
        n2o : 2.18e-5,
    } : {
        co2 : 2.07,
        ch4 : 3.2e-4,
        n2o : 1.9e-4,
    }


    const  co2e = (liters_consumption * emission_factors.co2) / 1000;
    const  ch4e =  (liters_consumption * emission_factors.ch4) / 1000;
    const  n2oe =  (liters_consumption * emission_factors.n2o) / 1000;

    const emission : Emission = {
        co2e,
        ch4e,
        n2oe, 
        ghge : (co2e * 1) + (ch4e * 28) + (n2oe * 265)     
    }

    return emission

 }










export {overview_data, get_emission}






