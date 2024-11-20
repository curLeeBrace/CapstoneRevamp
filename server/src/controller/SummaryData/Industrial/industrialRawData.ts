import { Request, Response } from 'express';
import MineralSchema  from '../../../db_schema/Industrial/MineralSchema';
import ChemicalSchema from "../../../db_schema/Industrial/ChemicalSchema";
import MetalSchema from '../../../db_schema/Industrial/MetalSchema';
import ElectronicsSchema from '../../../db_schema/Industrial/ElectronicsSchema';
import OthersSchema from '../../../db_schema/Industrial/OthersSchema';

import {
    IndustrialEmmisionFactor,
    formulaForGettingIndstrialGHGe,
    chemical_eFactors,
    electronicsEfactors,
    metal_eFactors,
    mineral_eFactors,
    othersEfactors
} from "../../../../custom_funtions/Industrial/industrialAction"


type RequestQueryTypes = {
    user_type : "s-admin" | "lgu_admin" | "lu_admin"
    municipality_code : string;
    prov_code : string;
    year : string;
}




const getIndustrialRawSummary = async (req : Request, res : Response) => {

    const {municipality_code, user_type, prov_code, year} = req.query as RequestQueryTypes
    const {industrial_type}  = req.params;

    try {

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
        let response = undefined
        
        if(industrial_type === "mineral"){
            const mineralData = await MineralSchema.find(query).exec();
            if(mineralData.length <= 0) return res.sendStatus(204);

            response = mineralData.map((data) => {
                const {cpp, cpb, lp, gp, brgy_name} = data.survey_data
                const {email, municipality_name} = data.surveyor_info
                const totalGHGe = getGHGe_perRow(mineral_eFactors, [cpp, cpb, lp, gp])
                return {
                    form_id : data._id,
                    email,
                    municipality_name,
                    brgy_name,
                    cpp, 
                    cpb, 
                    lp, 
                    gp,
                    totalGHGe
                }
            })
        } else if(industrial_type === "chemical"){
            const chemicalData = await ChemicalSchema.find(query).exec();
            if(chemicalData.length <= 0) return res.sendStatus(204);

            response = chemicalData.map((data:any) => {
                const {
                    ap,
                    sap,
                    pcbp_EDVCM,
                    pcbp_M,
                    pcbp_EO,
                    pcbp_CB,
                    pcbp_E,
                    pcbp_A,
                    brgy_name
                } = data.survey_data
                const {email, municipality_name} = data.surveyor_info
                const totalGHGe = getGHGe_perRow(chemical_eFactors, [
                    ap,
                    sap,
                    pcbp_EDVCM,
                    pcbp_M,
                    pcbp_EO,
                    pcbp_CB,
                    pcbp_E,
                    pcbp_A,
                ])

                return {
                    form_id : data._id,
                    email,
                    municipality_name,
                    brgy_name,
                    ap,
                    sap,
                    pcbp_EDVCM,
                    pcbp_M,
                    pcbp_EO,
                    pcbp_CB,
                    pcbp_E,
                    pcbp_A,
                    totalGHGe
                }




            })
        } else if (industrial_type === "metal"){
            const metalData = await MetalSchema.find(query).exec();
            if(metalData.length <= 0) return res.sendStatus(204);
             
                response = metalData.map((data:any)=>{
                    const {email, municipality_name} = data.surveyor_info
                    const {ispif, ispnif,brgy_name} = data.survey_data
                    const totalGHGe = getGHGe_perRow(metal_eFactors, [ispif, ispnif])

                    return {
                        form_id : data._id,
                        email,
                        municipality_name,
                        brgy_name,
                        ispif,
                        ispnif,
                        totalGHGe
                    }
            })

        } else if (industrial_type === "electronics"){
            const electronicsData = await ElectronicsSchema.find(query).exec();
            if(electronicsData.length <= 0) return res.sendStatus(204);

            response = electronicsData.map((data:any)=>{
                const {email, municipality_name} = data.surveyor_info
                const {
                    ics,
                    tft_FPD,
                    photovoltaics,
                    htf,
                    brgy_name
                } = data.survey_data

                const totalGHGe = getGHGe_perRow(electronicsEfactors, [
                    ics,
                    tft_FPD,
                    photovoltaics,
                    htf,
                
                ])

                return {
                    form_id : data._id,
                    email,
                    municipality_name,
                    brgy_name,
                    ics,
                    tft_FPD,
                    photovoltaics,
                    htf,
                    totalGHGe
                }
            })

        } else if (industrial_type === "others"){
            const othersData = await OthersSchema.find(query).exec();
            if(othersData.length <= 0) return res.sendStatus(204);

            response = othersData.map((data:any)=>{
                const {email, municipality_name} = data.surveyor_info
                const  {
                    ppi,
                    fbi,
                    other,
                    brgy_name
                } = data.survey_data

                const totalGHGe = getGHGe_perRow(othersEfactors, [
                    ppi,
                    fbi,
                    other,
                
                ])
                
                return {
                    form_id : data._id,
                    email,
                    municipality_name,
                    brgy_name,
                    ppi,
                    fbi,
                    other,
                    totalGHGe
                }
            })
        }   

        return res.status(200).send(response)

  
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }

}








const getGHGe_perRow = (emmisionFactor :IndustrialEmmisionFactor[], quantityTons:number[]):number => {

    let totalGHGe = 0;
    const ghge_container_perOperation = formulaForGettingIndstrialGHGe(emmisionFactor, quantityTons);


    ghge_container_perOperation.map((ghge) => {
        totalGHGe += ghge
    })

    return totalGHGe

}


export {
    getIndustrialRawSummary
}