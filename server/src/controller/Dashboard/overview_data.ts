import { Request, Response, NextFunction } from "express";
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import municipality_json from "../../../ph-json/city.json";
import AccountSchema from "../../db_schema/AccountSchema";
interface Municipality {
    city_code : String;
    city_name : String;
    province_code : String;
}
type Emission = {
    co2e : number;
    ch4e : number;
    n2oe : number;
    ghge : number;
}
type TableData = {
    municipalites : String;
    emision : Emission;
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
        


        if(user_type === "s-admin"){
            const accounts = await AccountSchema.find({'lgu_municipality.province_code' : province_code});
            const lgu_admin = accounts.filter(acc => acc.user_type === "lgu_admin");
            const surveyor = accounts.filter(acc => acc.user_type === "surveyor");
            const table_data =  await get_table_data(province_code);
            
      

            let today_ghge = 0;
            table_data.forEach(tb_data => {
                    today_ghge += tb_data.emision.ghge;
            })
    
            const response : DashBoardData = {
                    total_LGU_admins : lgu_admin.length,
                    total_surveryor : surveyor.length,
                    table_data,
                    today_ghge,
            }
    
    
            return res.status(200).json(response);


        } else {

        }
        
        




    } catch (error) {
        console.error(error)
        return res.sendStatus(500);
    }


 }






 const get_table_data = async (province_code : string) : Promise<TableData[]> => {

    const table_data : TableData[] = [];
    const municipalities : Municipality[] = municipality_json.filter((municipality) => municipality.province_code === province_code); // get all municipalities depends on province code
    

    // Set the start of today to 00:00:00.000
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    // Set the end of today to 23:59:59.999
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const form_data = await FuelFormSchema.find({
        $and: [
            {'surveyor_info.province_code': province_code},
            {dateTime_created: {
                $gte : start,
                $lte : end
            }}
        ]
    }); // find all fuel form data today in that province_code or province_name


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
                const single_form_emmmsion = get_emission(data.emission_factors, data.survey_data.liters_consumption);
                const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion

                tb_co2e += co2e;
                tb_ch4e += ch4e;
                tb_n2oe += n2oe;
                tb_ghge += ghge;

            }
        })
        
        table_data.push({
            municipalites : municipality.city_name,
            emision : {
                co2e : tb_co2e,
                ch4e : tb_ch4e,
                n2oe : tb_n2oe,
                ghge : tb_ghge,
            }
        })

    });


    return table_data


 }




 const get_emission = (emission_factors : any, liters_consumption: number) : Emission  => {

     /*
        ==========================================
            -------Conversion-Factor-----
            co2 = 1
            ch4 = 28
            n20 = 265

         ==========================================
    */

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










export {overview_data}






