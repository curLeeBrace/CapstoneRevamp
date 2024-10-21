import { Request, Response } from 'express';
import AgricultureCropsSchema from "../../../db_schema/Agriculture/AgricultureCrops";
import AgricultureLiveStocksSchema from "../../../db_schema/Agriculture/AgricultureLiveStock";
import getAvailableLocations from '../../../../custom_funtions/getAvailableLocations';


type RequestQueryTypes = {
    user_type : "s-admin" | "lgu_admin"
    agricultureType : "crops" | "livestocks" ;
    municipality_code : string;
    prov_code : string;
    year : string;
}



const getAgricultureSummary = async (req:Request, res:Response) => {

    const {agricultureType, municipality_code, user_type, prov_code, year} = req.query as RequestQueryTypes

    const query = user_type === "s-admin" ? 
    {
        "surveyor_info.province_code" : prov_code,
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

    let agricultureData : any[] = [];

    if(agricultureType === "crops") {
        agricultureData = await AgricultureCropsSchema.find(query).exec();


    } else {
        agricultureData = await AgricultureLiveStocksSchema.find(query).exec();
    }

    if(agricultureData.length <= 0) return res.sendStatus(204);


    ////////////////////////////////////////////////////////////////
    const parent_code = user_type === "s-admin" ? prov_code : municipality_code
    const locations = getAvailableLocations(parent_code, user_type);

    // let filter_AggricultureData : {
    //     brgy_name : string
    //     municipality_name    : string
    // }[] = agricultureData.map((data)=>{

    //     return {
    //         brgy_name : data.survey_data.brgy_name,
    //         municipality_name : data.surveyor_info.municipality_name,
    //     }
    // }) 

    /////////////////////////////////////////////////////////////////////////////////////////
    
    let filter_locations : any[] = []
    let responseContainer:any[] = []




    if(user_type === "s-admin") {


        // const surveyData_LocName = filter_AggricultureData.map((industry_data)=> industry_data.municipality_name)
        /////////////////JUST FILTERING THE OUTPUT OF LOCATIONS///////////////////////////////////////
        filter_locations = locations.map((loc) => {
            return {
                loc_code : loc.city_code,
                loc_name : loc.city_name
            }
        })

        ////////////////////////////////////////////////////////////////////////////
        if(agricultureType === "crops"){
            
            filter_locations.map((loc)=>{
                const {loc_name} = loc;
                let responseTempCointainer = {
                    location : loc_name,
                    rdsi : 0,
                    rdsr : 0,
                    rwsi : 0,
                    rwsr : 0,
                    crop_residues : 0,
                    dol_limestone : 0,
                }
    
                agricultureData.map((data)=>{
                    const {survey_data, surveyor_info} = data;
                  
                    const {municipality_name} = surveyor_info;
    
                    if(loc_name === municipality_name){
    
                            const {
                                rdsi,
                                rdsr,
                                rwsi,
                                rwsr,
                                crop_residues,
                                dol_limestone,
                            } = survey_data.crops
    
                            responseTempCointainer.rdsi += rdsi;
                            responseTempCointainer.rdsr += rdsr;
                            responseTempCointainer.rwsi += rwsi;
                            responseTempCointainer.rwsr += rwsr;
                            responseTempCointainer.crop_residues += crop_residues;
                            responseTempCointainer.dol_limestone += dol_limestone;
    
                    }
    
                })
    
                responseContainer.push(responseTempCointainer);
            })
        } else {
            filter_locations.map((loc)=>{
                const {loc_name} = loc;
                let responseTempCointainer = {
                    location : loc_name,
                    buffalo : 0,
                    cattle : 0,
                    goat : 0,
                    horse : 0,
                    poultry : 0,
                    swine : 0,
                    non_dairyCattle : 0,
                }
    
                agricultureData.map((data)=>{
                    const {survey_data, surveyor_info} = data;
                  
                    const {municipality_name} = surveyor_info;
    
                    if(loc_name === municipality_name){
    
                            const {
                                buffalo,
                                cattle,
                                goat,
                                horse,
                                poultry,
                                swine,
                                non_dairyCattle,
                            } = survey_data.live_stock
    
                            responseTempCointainer.buffalo += buffalo;
                            responseTempCointainer.cattle += cattle;
                            responseTempCointainer.goat += goat;
                            responseTempCointainer.horse += horse;
                            responseTempCointainer.poultry += poultry;
                            responseTempCointainer.swine += swine;
                            responseTempCointainer.non_dairyCattle += non_dairyCattle;
                    }
    
                })
    
                responseContainer.push(responseTempCointainer);
            })
        }   






    } else {
        // const surveyData_LocName = filter_AggricultureData.map((industry_data)=> industry_data.brgy_name)
        filter_locations = locations.map((loc) => {
            return {
                loc_code : loc.brgy_code,
                loc_name : loc.brgy_name
            }
        })



        if(agricultureType === "crops"){
            
            filter_locations.map((loc)=>{
                const {loc_name} = loc;
                let responseTempCointainer = {
                    location : loc_name,
                    rdsi : 0,
                    rdsr : 0,
                    rwsi : 0,
                    rwsr : 0,
                    crop_residues : 0,
                    dol_limestone : 0,
                }
    
                agricultureData.map((data)=>{
                    const {survey_data} = data;
                  
                    const {brgy_name} = survey_data;
    
                    if(loc_name === brgy_name){
    
                            const {
                                rdsi,
                                rdsr,
                                rwsi,
                                rwsr,
                                crop_residues,
                                dol_limestone,
                            } = survey_data.crops
    
                            responseTempCointainer.rdsi += rdsi;
                            responseTempCointainer.rdsr += rdsr;
                            responseTempCointainer.rwsi += rwsi;
                            responseTempCointainer.rwsr += rwsr;
                            responseTempCointainer.crop_residues += crop_residues;
                            responseTempCointainer.dol_limestone += dol_limestone;
    
                    }
    
                })
    
                responseContainer.push(responseTempCointainer);
            })
        } else {
            filter_locations.map((loc)=>{
                const {loc_name} = loc;
                let responseTempCointainer = {
                    location : loc_name,
                    buffalo : 0,
                    cattle : 0,
                    goat : 0,
                    horse : 0,
                    poultry : 0,
                    swine : 0,
                    non_dairyCattle : 0,
                }
    
                agricultureData.map((data)=>{
                    const {survey_data} = data;
                  
                    const {brgy_name} = survey_data;
    
                    if(loc_name === brgy_name){
    
                            const {
                                buffalo,
                                cattle,
                                goat,
                                horse,
                                poultry,
                                swine,
                                non_dairyCattle,
                            } = survey_data.live_stock
    
                            responseTempCointainer.buffalo += buffalo;
                            responseTempCointainer.cattle += cattle;
                            responseTempCointainer.goat += goat;
                            responseTempCointainer.horse += horse;
                            responseTempCointainer.poultry += poultry;
                            responseTempCointainer.swine += swine;
                            responseTempCointainer.non_dairyCattle += non_dairyCattle;
                    }
    
                })
    
                responseContainer.push(responseTempCointainer);
            })
        }   


    }



    
    return res.status(200).send(responseContainer)



}


export default getAgricultureSummary

