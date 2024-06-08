import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import {get_emission} from "../Dashboard/overview_data"



const getMobileCombustionData = async (req:Request, res:Response) => {
    const {province_code, municipality_code, form_type} = req.params;
   
    try {   
        let emmission  = {
            tb_co2e : 0,
            tb_ch4e : 0,
            tb_n2oe : 0,
            tb_ghge : 0,
        }

        let counts_ofVehicleTypes:number[] = [];
        let counts_ofVehicleAge: number[] = [];
        const vehicleTypes = form_type === "residential" ? ['Car','SUV','Motorcycle'] : form_type === "commercial" ? ['Jeep','Tricycle','Bus','Van','Taxi','Truck'] : ['Car','SUV','Motorcycle','Jeep','Tricycle','Bus','Van','Taxi','Truck'];
        
        const mobile_combustionForm = await FuelFormSchema.find({
            $and: [
                    {'surveyor_info.province_code': province_code},
                    {'surveyor_info.municipality_code' : municipality_code},
                    form_type === "both" ? {} : {'survey_data.form_type' : form_type}
                ]   
        })

        
        mobile_combustionForm.forEach(data => {
            if(data.surveyor_info.municipality_code === municipality_code)  {
                //compute the municipality emmisions
                const single_form_emmmsion = get_emission(data.emission_factors, data.survey_data.liters_consumption);
                const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion

                emmission.tb_co2e += co2e;
                emmission.tb_ch4e += ch4e;
                emmission.tb_n2oe += n2oe;
                emmission.tb_ghge += ghge;
            }


            
        })

        const vehicleAges = mobile_combustionForm.map(mbc_data => mbc_data.survey_data.vehicle_age);
        const uniqueVehicleAges = Array.from(new Set(vehicleAges));





        vehicleTypes.forEach(vehicle => {
            let count = 0;
            mobile_combustionForm.forEach(formData => {
                if(formData.survey_data.vehicle_type === vehicle){
                    count++;

                }
            })


            counts_ofVehicleTypes.push(count);
        })

        uniqueVehicleAges.forEach(age => {
            let age_count = 0;
            mobile_combustionForm.forEach(formData => {
                if(formData.survey_data.vehicle_age === age){
                    age_count++;

                }
            })

            counts_ofVehicleAge.push(age_count);
        })




        return res.status(200).json({
            emmission, vehicle : {
                vehicleTypes, 
                counts_ofVehicleTypes,
                vehicleAges : uniqueVehicleAges,
                counts_ofVehicleAge,
            }});

    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }


}

export {getMobileCombustionData};
