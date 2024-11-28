import { Request, Response } from 'express';
import WoodSchema from '../../../db_schema/ForestryAndLandUSe/WoodSchema';
import ForestLandSchema from '../../../db_schema/ForestryAndLandUSe/ForestLandSchema';
import { getGHGePerSurvey, getForestLandUseEfactor} from '../../../../custom_funtions/forestryLanUse';

type RequestQueryTypes = {
    user_type : "s-admin" | "lgu_admin" | "lu_admin"
    municipality_code : string;
    prov_code : string;
    year : string;
}
const getFALU_RawData = async(req : Request, res : Response) => {
    try {
        
    const {municipality_code, user_type, prov_code, year} = req.query as RequestQueryTypes
    const {falu_type}  = req.params;
    let response = null;
    const query = user_type === "s-admin" ? 
        {
            "surveyor_info.province_code" : prov_code,
            dateTime_created : {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lte: new Date(`${year}-12-30T23:59:59.000Z`)
            },
    
        } 
        : user_type === "lu_admin" ?
        {
            "surveyor_info.municipality_name" : 'Laguna University',
            dateTime_created : {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lte: new Date(`${year}-12-30T23:59:59.000Z`)
            },
        }
        :
        {
            "surveyor_info.municipality_code" : municipality_code,
            dateTime_created : {
                $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                $lte: new Date(`${year}-12-30T23:59:59.000Z`)
            },
    
        }

        
        const efactor = await getForestLandUseEfactor(falu_type as "falu-wood" | "falu-forestland");



        if(falu_type === "falu-wood"){
            const falu_woodData = await WoodSchema.find(query).exec();
            response = falu_woodData.map((data)=>{
                const {email, municipality_name} = data.surveyor_info
                const {fuelwood, charcoal, construction, novelties, brgy_name} = data.survey_data;
                const wood_ghge =  getGHGePerSurvey(efactor, {fuelwood, charcoal, construction, novelties})

                return {
                    form_id : data._id,
                    email,
                    municipality_name,
                    brgy_name,
                    fuelwood,
                    charcoal,
                    construction,
                    novelties,
                    totalGHGe : wood_ghge

                }
            })


        } else {
            const falu_forestlandData = await ForestLandSchema.find(query).exec();
            response = falu_forestlandData.map((data)=>{
                const {email, municipality_name} = data.surveyor_info
                const {ufA, uaG, laBA, brgy_name} = data.survey_data;
                const forestLandGHge =  getGHGePerSurvey(efactor, {ufA, uaG, laBA});
                
                return{
                    form_id : data._id,
                    email,
                    municipality_name,
                    brgy_name,
                    ufA,
                    uaG,
                    laBA,
                    totalGHGe : forestLandGHge

                }
            })



        }


        return res.status(200).send(response)

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}


export default getFALU_RawData
