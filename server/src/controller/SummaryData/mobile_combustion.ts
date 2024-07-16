import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import {get_emission} from "../Dashboard/overview_data"



const getMobileCombustionData = async (req:Request, res:Response) => {
    const {province_code, municipality_code, form_type} = req.params;
    const year = new Date().getFullYear();





    try {   
        let emmission  = {
            tb_co2e : 0,
            tb_ch4e : 0,
            tb_n2oe : 0,
            tb_ghge : 0,
        }

        let counts_ofVehicleTypes:number[] = [];
        let vehicle_ghge_rate : number[] = [];

        let counts_ofVehicleAge: {
            age_totalCount : number,
            ageCount_perVehicle : {
                counts : number,
                v_type : string
                
            }[];
        }[] = [];



        const vehicleTypes = form_type === "residential" ? ['Car','SUV','Motorcycle'] : form_type === "commercial" ? ['Jeep','Tricycle','Bus','Van','Taxi','Truck'] : ['Car','SUV','Motorcycle','Jeep','Tricycle','Bus','Van','Taxi','Truck'];
        const mobile_combustionForm = await FuelFormSchema.find({
            $and: [
                    {'surveyor_info.province_code': province_code},
                    {'surveyor_info.municipality_code' : municipality_code},
                    { dateTime_created : {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                        },
                    },
                    form_type === "both" ? {} : {'survey_data.form_type' : form_type},
                    
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
        const uniqueVehicleAges = Array.from(new Set(vehicleAges)).sort();





        vehicleTypes.forEach(vehicle => {
            let count = 0;
            let vehicle_emssion = 0;
            mobile_combustionForm.forEach(formData => {
                if(formData.survey_data.vehicle_type === vehicle){
                    count++;
                    const single_form_emmmsion = get_emission(formData.emission_factors, formData.survey_data.liters_consumption);
                    const {co2e, ch4e, n2oe, ghge} = single_form_emmmsion
                    vehicle_emssion += ghge;

                }
            })

            vehicle_ghge_rate.push(vehicle_emssion)
            counts_ofVehicleTypes.push(count);
        })




        uniqueVehicleAges.forEach(age => {
            let age_totalCount = 0;
            let ageCount_perVehicle : {
                counts : number,
                v_type : string
            }[] = []

            mobile_combustionForm.forEach(formData => {
                const v_age = formData.survey_data.vehicle_age;
                if(v_age === age){
                    age_totalCount++;
                }

            })


            vehicleTypes.forEach(v_type => {
             
                let tempCount = 0;
                let temp_vType = "";

                mobile_combustionForm.forEach(formData => {
                    const f_vType = formData.survey_data.vehicle_type;
                    const f_vAge = formData.survey_data.vehicle_age;
                    if(f_vType === v_type && age === f_vAge){
                        tempCount++;
                        temp_vType = f_vType
                    }
                })
                
                ageCount_perVehicle.push({
                    counts : tempCount,
                    v_type : v_type,
                });
                


            })





            counts_ofVehicleAge.push({
                age_totalCount,
                ageCount_perVehicle
            });
        })




        return res.status(200).json({
            emmission, vehicle : {
                vehicle_ghge_rate,
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
