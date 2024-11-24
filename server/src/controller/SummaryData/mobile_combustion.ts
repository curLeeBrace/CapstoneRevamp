import { Request, Response } from 'express';
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import {get_MobileCombustionEmission} from "../Dashboard/overview_data"





export type RequestQueryTypes = {
    user_type : string;
    selectAll : string;
    province_code : string;
    form_type : string;
    municipality_code : string;
    brgy_code : string
    selectedYear? : string
    brgy_name?: string; 
    municipality_name: string,


}





const prepareQuery = (requestQuery : RequestQueryTypes) : {} => {
     // date Filter from beginning of the year to the last
        // =>> dateTime_created : {
        //     $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        //     $lte: new Date(`${year}-12-30T23:59:59.000Z`)
        // },

        const {
            user_type,
            selectAll,
            province_code,
            form_type,
            municipality_code,
            brgy_code,
            municipality_name,
            selectedYear
        } = requestQuery

        const getYearNow = new Date().getFullYear();
        const year  = selectedYear === undefined ? getYearNow : selectedYear

        let query : {} = {};
        if(user_type === "s-admin"){

            if(selectAll === "true"){
                query = {
                    $and: [
                        {'surveyor_info.province_code': province_code},
                        {'survey_data.form_type' : form_type},
                    ]   
                };

            } else if (selectAll === "false"){
                query = {
                    $and: [
                        {'surveyor_info.province_code': province_code},
                        {'survey_data.form_type' : form_type},
                        {'surveyor_info.municipality_code' : municipality_code}
                    ]   
                };

            }

        } else if (user_type === "lu_admin") {
            // Custom condition for lu_admin user_type
            query = {
                $and: [
                    { 'surveyor_info.province_code': province_code },
                    { 'survey_data.form_type': form_type },
                    { 'surveyor_info.municipality_name': "Laguna University" },
                ],
            };
        }
        else if(user_type === "lgu_admin"){
            
            if(selectAll === "true"){
                query = {
                    $and: [
                        {'surveyor_info.province_code': province_code},
                        {'survey_data.form_type' : form_type},
                        {'surveyor_info.municipality_code' : municipality_code}
                    ]   
                };

            } else if (selectAll === "false"){
                query = {
                    $and: [
                        {'surveyor_info.province_code': province_code},
                        {'survey_data.form_type' : form_type},
                        {'surveyor_info.municipality_code' : municipality_code},
                        {'survey_data.brgy_code' : brgy_code}
                    ]   
                };
            }
        }



        query = {...query,
            $or : [{"survey_data.status" : "0"}, {"survey_data.status" : "2"}],
            dateTime_created : {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lte: new Date(`${year}-12-30T23:59:59.000Z`)
            },
        }



        return query
}


const getMobileCombustionData = async (req:Request, res:Response) => {
    const {province_code, municipality_code, form_type, brgy_code, selectAll, user_type} = req.query;
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


       

        const preparedQuery = prepareQuery(req.query as RequestQueryTypes);
        
        const vehicleTypes = form_type === "residential" || "commercial" ? 
            [ "Motorcycle",
            "Tricycle",
            "Sedan",
            "Hatchback",
            "Coupe",
            "Sports Utility Vehicle (SUV)",
            "Multi-Purpose Vehicle (MPV)",
            "Asian Utility Vehicle (AUV)",
            "Crossover",
            "Pick-Up Truck",
            "Bus",
            "Boat (bangka)"] :
            [ "Motorcycle",
                "Tricycle",
                "Sedan",
                "Hatchback",
                "Coupe",
                "Sports Utility Vehicle (SUV)",
                "Multi-Purpose Vehicle (MPV)",
                "Asian Utility Vehicle (AUV)",
                "Crossover",
                "Pick-Up Truck",
                "Bus",
                "Boat (bangka)"];

        const mobile_combustionForm = await FuelFormSchema.find(preparedQuery).exec();


        // console.log("mobile_combustionForm : ", mobile_combustionForm);


    
        
        mobile_combustionForm.forEach(async(data) => {
            if (user_type === "s-admin") {
                if (selectAll === "true") {
                    const single_form_emmmsion = await get_MobileCombustionEmission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                    const { co2e, ch4e, n2oe, ghge } = single_form_emmmsion;
                    emmission.tb_co2e += co2e;
                    emmission.tb_ch4e += ch4e;
                    emmission.tb_n2oe += n2oe;
                    emmission.tb_ghge += ghge;
                } else if (selectAll === "false" && data.surveyor_info.municipality_code === municipality_code) {
                    const single_form_emmmsion = await get_MobileCombustionEmission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                    const { co2e, ch4e, n2oe, ghge } = single_form_emmmsion;
                    emmission.tb_co2e += co2e;
                    emmission.tb_ch4e += ch4e;
                    emmission.tb_n2oe += n2oe;
                    emmission.tb_ghge += ghge;
                }
            } else if (user_type === "lgu_admin") {
                if (selectAll === "true") {
                    const single_form_emmmsion = await get_MobileCombustionEmission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                    const { co2e, ch4e, n2oe, ghge } = single_form_emmmsion;
                    emmission.tb_co2e += co2e;
                    emmission.tb_ch4e += ch4e;
                    emmission.tb_n2oe += n2oe;
                    emmission.tb_ghge += ghge;
                } else if (selectAll === "false" && data.survey_data.brgy_code === brgy_code) {
                    const single_form_emmmsion = await get_MobileCombustionEmission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                    const { co2e, ch4e, n2oe, ghge } = single_form_emmmsion;
                    emmission.tb_co2e += co2e;
                    emmission.tb_ch4e += ch4e;
                    emmission.tb_n2oe += n2oe;
                    emmission.tb_ghge += ghge;
                }
            } else if (user_type === "lu_admin" && data.surveyor_info.municipality_name === "Laguna University") {
                const single_form_emmmsion = await get_MobileCombustionEmission(data.survey_data.fuel_type as string, data.survey_data.liters_consumption);
                const { co2e, ch4e, n2oe, ghge } = single_form_emmmsion;
                emmission.tb_co2e += co2e;
                emmission.tb_ch4e += ch4e;
                emmission.tb_n2oe += n2oe;
                emmission.tb_ghge += ghge;
            }
        });

        const vehicleAges = mobile_combustionForm.map(mbc_data => mbc_data.survey_data.vehicle_age);
        const uniqueVehicleAges = Array.from(new Set(vehicleAges)).sort();
        




        for (const vehicle of vehicleTypes) {
            let count = 0;
            let vehicle_emission = 0;
        
            for (const formData of mobile_combustionForm) {
                if (formData.survey_data.vehicle_type === vehicle) {
                    count++;
                    const single_form_emission = await get_MobileCombustionEmission(
                        formData.survey_data.fuel_type as string,
                        formData.survey_data.liters_consumption
                    );
                    const { ghge } = single_form_emission;
                    vehicle_emission += ghge;
                }
            }
        
            vehicle_ghge_rate.push(vehicle_emission);
            counts_ofVehicleTypes.push(count);
        }
        




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

export {getMobileCombustionData, prepareQuery};
