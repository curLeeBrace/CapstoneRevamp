import { Request, Response } from 'express';
import StationarySchema from '../../db_schema/StationarySchema';
import {getGHGe_perSurvey} from "../../../custom_funtions/stationary";

const stationaryRawData = async (req : Request, res : Response) => {
    try {
        
        const {form_type, municipality_name, brgy_name, brgy_code, municipality_code, user_type, year} = req.query;

        let query = {}
        let response = undefined;
        if(user_type === "s-admin") {

            if(!municipality_name){
                query = 
                    {
                        "survey_data.form_type" : form_type,
                        dateTime_created : {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                        },
                    }
            } else {
                query = {
                        "survey_data.form_type" : form_type,
                        // "surveyor_info.municipality_name" : municipality_name,
                        "surveyor_info.municipality_code" : municipality_code,
                        dateTime_created : {
                            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                            $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                        },
                    }
            }
        

        } else if (user_type === "lu_admin") {
            query = {
                "survey_data.form_type": form_type,
                "surveyor_info.municipality_name": "Laguna University",
                "surveyor_info.municipality_code": "043426",
                "survey_data.brgy_name": "Laguna University",
                dateTime_created: {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${year}-12-30T23:59:59.000Z`),
                },
            };


        } else {

            if(!brgy_name){
                query = {
                    "survey_data.form_type" : form_type,
                    "surveyor_info.municipality_code" : municipality_code,
                    dateTime_created : {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                    },
                }
            } else {
                query = {
                    "survey_data.form_type" : form_type,
                    // "surveyor_info.municipality_name" : municipality_name,
                    "surveyor_info.municipality_code" : municipality_code,
                    "survey_data.brgy_code" : brgy_code,
                    // "survey_data.brgy_name" : brgy_name,
                    dateTime_created : {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-30T23:59:59.000Z`)
                    },
                }
            }

        }

        response = await prepareStationaryResponseData(query);

        return res.status(200).send(response);





    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
}










const prepareStationaryResponseData = async (query : {}) => {

    let reponseContainer : {}[] = []

    const stationaryData = await StationarySchema.find(query).exec();


    reponseContainer = stationaryData.map((data)=>{
        const form_id = data._id;
        const {
            form_type,
            cooking,
            generator,
            lighting,
            brgy_name,
        } = data.survey_data;

        const {
            email,
            municipality_name,
        } = data.surveyor_info
        const ghge = getGHGe_perSurvey({cooking, generator, lighting})
        const date_Time = data.dateTime_created;

        return {   
            form_id,
            email,
            municipality_name,
            brgy_name,
            form_type,
            cooking,
            generator,
            lighting,
            ghge,
            date_Time,
        }
    })



return reponseContainer;

}



export default stationaryRawData;