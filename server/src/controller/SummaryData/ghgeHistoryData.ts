import {Request, Response} from "express"
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from "../../db_schema/WasteWaterFormShema";
import StationarySchema from "../../db_schema/StationarySchema";

//industrial
import ChemicalSchema from "../../db_schema/Industrial/ChemicalSchema";
import ElectronicsSchema from "../../db_schema/Industrial/ElectronicsSchema";
import MetalSchema from "../../db_schema/Industrial/MetalSchema";
import MineralSchema from "../../db_schema/Industrial/MineralSchema";
import OthersSchema from "../../db_schema/Industrial/OthersSchema";

//agriculture
import AgricultureCrops from "../../db_schema/Agriculture/AgricultureCrops";
import AgricultureLiveStock from "../../db_schema/Agriculture/AgricultureLiveStock";

//forest and land use
import ForestLandSchema from "../../db_schema/ForestryAndLandUSe/ForestLandSchema";
import WoodSchema from "../../db_schema/ForestryAndLandUSe/WoodSchema";






//GHGE Computation
import { get_MobileCombustionEmission } from "../Dashboard/overview_data"; // Mobile Combustion
import { prepareWasteWaterGHGe_perSurvey, PopulationUsingTheSystems, WasteWaterEfatorType} from "../../../custom_funtions/wasteWaterActions"; //Waste Water
import { getGHGe_perSurvey } from "../../../custom_funtions/stationary"; //Stationary
import { formulaForGettingIndstrialGHGe } from "../../../custom_funtions/Industrial/industrialAction"; // industrial
import { agricultureTotalGHGe } from "../../../custom_funtions/agriculture"; // agriculture
import { getGHGePerSurvey } from "../../../custom_funtions/forestryLanUse";
//efactors (optional)
import WasteWaterEfactorSchema from "../../db_schema/EmmisisonFactorsSchema/WasteWaterEfactorSchema";
import { 
    get_dbEfactor,
    default_mineral_eFactors,
    default_chemical_eFactors,
    default_metal_eFactors,
    default_othersEfactors,
    default_electronicsEfactors,
 } from "../../../custom_funtions/Industrial/industrialAction";

 import { getForestLandUseEfactor } from "../../../custom_funtions/forestryLanUse";





const getGHGeHistoricalData = async(req :  Request, res : Response) => {
    try {
        const {municipality_name, user_type} = req.query;

        let yearNow = Number(new Date().getFullYear().toString());
        let yearsContainer = []
            for (let index = yearNow - 10; index <= yearNow; index++) {
                    
                yearsContainer.push(index.toString())
            }
                



        const query = user_type === "s-admin" ? {} : {"surveyor_info.municipality_name" : municipality_name}

        const mobile_combusitonData = await FuelFormSchema.find(query).exec();
        const waste_waterData = await WasteWaterFormShema.find(query).exec();
        const stationaryData = await StationarySchema.find(query).exec();

        //industrial
        const mineralData = await MineralSchema.find(query).exec();
        const chemicalData = await ChemicalSchema.find(query).exec();
        const metalData  = await MetalSchema.find(query).exec();
        const electronicsData = await ElectronicsSchema.find(query).exec();
        const othersData = await OthersSchema.find(query).exec();

        //agriculture
        const crops = await AgricultureCrops.find(query).exec();
        const livestocks = await AgricultureLiveStock.find(query).exec(); 

        //forest and land use

        const forestland = await ForestLandSchema.find(query).exec(); 
        const wood = await WoodSchema.find(query).exec(); 
            
        
        type HistoricalGHGeTypes = {
            year : string,
            ghge : number
        }

        // let mb_ghge : HistoricalGHGeTypes[] = [];
        // let wasteWater_ghge : HistoricalGHGeTypes[] = []
        // let stationary_ghge  : HistoricalGHGeTypes[] = []
        // let industrial_ghge : HistoricalGHGeTypes[] = []
        // let agriculture_ghge : HistoricalGHGeTypes[] = []
        // let falu_ghge : HistoricalGHGeTypes[]  = []

        let total_ghge : HistoricalGHGeTypes[] = []


        await Promise.all(

            yearsContainer.map(async(year)=>{
                //GHGE Variables
                let mb_tempGHGe = 0
                let wasteWater_tempGHGe = 0
                let stationary_tempGHGe = 0
                let industrial_tempGHGe = 0
                let agriculture_tempGHGe = 0
                let falu_tempGHGe = 0






                //industrial-efactor
                //check if Efactors is already in mongodb
                const mineral_eFactor = await get_dbEfactor("mineral", year);
                const chemical_eFactor = await get_dbEfactor("chemical", year);
                const metal_eFactor = await get_dbEfactor("metal", year);
                const electronics_eFactor = await get_dbEfactor("electronics", year);
                const others_eFactor = await get_dbEfactor("others", year);
                //////////////////////////////////////////////


                //forest and land use efactor
                const falu_forestland_efactor = await getForestLandUseEfactor("falu-forestland", year);
                const falu_wood_efactor = await getForestLandUseEfactor("falu-wood", year);
    
    
    
                await Promise.all(
                    //===================Mobile Combustion GHGE per year===================
                    mobile_combusitonData.map(async(mb_data) => {
                        const {liters_consumption, fuel_type} = mb_data.survey_data
                        const db_year = new Date(mb_data.dateTime_created).getFullYear().toString();
    
                        if(year === db_year && mb_data){
                            const db_mb_ghge = await get_MobileCombustionEmission(fuel_type as string, liters_consumption, db_year)
                            mb_tempGHGe += db_mb_ghge.ghge
                        }
                    })
               
                    //======================Waste Water GHGE per year=============================
                    
                )
                await Promise.all(
                    waste_waterData.map(async(w_wData) => {
                        
                        const {form_type, septic_tanks,openPits_latrines,riverDischarge,} = w_wData.survey_data
    
                        const db_year = new Date(w_wData.dateTime_created).getFullYear().toString();
                        if(year  === db_year && w_wData){
                            const waste_wateEfactorData : WasteWaterEfatorType|null = await WasteWaterEfactorSchema.findOne({surveyType : form_type, db_year}).exec() as WasteWaterEfatorType|null;
                            const wasteWaterGHGe = await prepareWasteWaterGHGe_perSurvey({
                                openPits_latrines, riverDischarge, septic_tanks
                            } as PopulationUsingTheSystems, form_type, waste_wateEfactorData)
        
                            wasteWater_tempGHGe += wasteWaterGHGe

                        }
    
                    })
                )
    
    
                //======================Stationary GHGE per year=============================
                await Promise.all(
                    stationaryData.map(async(s_data) => {
    
                        const {form_type, cooking, generator, lighting} = s_data.survey_data
                        const db_year = new Date(s_data.dateTime_created).getFullYear().toString();
                        if(year  === db_year && s_data){
                            const stationaryGHGe = await getGHGe_perSurvey({cooking, generator, lighting}, db_year)
                            stationary_tempGHGe += stationaryGHGe

                        }
                    })
                )


                //=========================Inudstrial GHGE per year====================
             
                    mineralData.map((data)=>{
                        const db_year = new Date(data.dateTime_created).getFullYear().toString();

                        if(year  === db_year && data){
                            const {cpp, cpb, lp, gp} = data.survey_data as any

                            const ghgePerOperation =  formulaForGettingIndstrialGHGe(mineral_eFactor ? mineral_eFactor : default_mineral_eFactors, 
                                [
                                    cpp,
                                    cpb,
                                    lp,
                                    gp,
                                ])

                            ghgePerOperation.forEach(ghge => {
                                industrial_tempGHGe += ghge
                            })
                        }

                    })


                    chemicalData.map((data) => {
                        const db_year = new Date(data.dateTime_created).getFullYear().toString();

                        if(year  === db_year && data){
                            const {
                                ap,
                                sap,
                                pcbp_M,
                                pcbp_E,
                                pcbp_EDVCM,
                                pcbp_EO,
                                pcbp_A,
                                pcbp_CB,
                            } = data.survey_data as any

                            const ghgePerOperation =  formulaForGettingIndstrialGHGe(chemical_eFactor ? chemical_eFactor : default_chemical_eFactors, 
                                [ap,
                                sap,
                                pcbp_M,
                                pcbp_E,
                                pcbp_EDVCM,
                                pcbp_EO,
                                pcbp_A,
                                pcbp_CB,
                            ])

                            ghgePerOperation.forEach(ghge => {
                                industrial_tempGHGe += ghge
                            })
                        }

                    })

                    metalData.map(data => {
                        const db_year = new Date(data.dateTime_created).getFullYear().toString();
                        const {ispif, ispnif} = data.survey_data as any
                        if(year  === db_year && data){
                            const ghgePerOperation =  formulaForGettingIndstrialGHGe(metal_eFactor ? metal_eFactor : default_metal_eFactors, [ispif, ispnif])
                            ghgePerOperation.forEach(ghge => {
                                industrial_tempGHGe += ghge
                            })
                        }

                    })


                    electronicsData.map(data => {
                        const db_year = new Date(data.dateTime_created).getFullYear().toString();
                        const {ics, tft_FPD, photovoltaics, htf} = data.survey_data as any
                        if(year  === db_year && data){
                            const ghgePerOperation =  formulaForGettingIndstrialGHGe(electronics_eFactor ? electronics_eFactor: default_electronicsEfactors, [ics, tft_FPD, photovoltaics, htf])
                            ghgePerOperation.forEach(ghge => {
                                industrial_tempGHGe += ghge
                            })
                        }
                    })


                    othersData.map(data => {
                        const db_year = new Date(data.dateTime_created).getFullYear().toString();
                        const {ppi, fbi, other} = data.survey_data as any
                        if(year  === db_year && data){
                            const ghgePerOperation =  formulaForGettingIndstrialGHGe(others_eFactor ? others_eFactor: default_othersEfactors, [ppi, fbi, other])
                            ghgePerOperation.forEach(ghge => {
                                industrial_tempGHGe += ghge
                            })
                        }

                    })




                    //==============================Agriculture GHGe per Year===============================
                    await Promise.all(
                        crops.map(async(data) => {
                            const db_year = new Date(data.dateTime_created).getFullYear().toString();
                            if(year  === db_year && data){
                                const {
                                    rdsi,
                                    rdsr,
                                    rwsi,
                                    rwsr,
                                    crop_residues,
                                    dol_limestone,
                                } = data.survey_data.crops 
            
            
                                const agricultureQtyData = {
                                    rdsi,
                                    rdsr,
                                    rwsi,
                                    rwsr,
                                    crop_residues,
                                    dol_limestone,
                                }


                                const cropsGHGe = await agricultureTotalGHGe(agricultureQtyData, "crops", year);

                                agriculture_tempGHGe += cropsGHGe
                            }
                        })
                    )


                    await Promise.all(
                        livestocks.map(async (data) => {
                            const db_year = new Date(data.dateTime_created).getFullYear().toString();
                            if(year  === db_year && data){
                                const {
                                    buffalo,
                                    cattle,
                                    goat,
                                    horse,
                                    poultry,
                                    swine,
                                    non_dairyCattle,
                                } = data.survey_data.live_stock

                                const agricultureQtyData = {
                                    buffalo,
                                    cattle,
                                    goat,
                                    horse,
                                    poultry,
                                    swine,
                                    non_dairyCattle,
                                }

                                const livestocksGHGe = await agricultureTotalGHGe(agricultureQtyData, "liveStocks", year);

                                agriculture_tempGHGe += livestocksGHGe
                            }
                        })
                    )



                    //=============================Forest and Land use GHGe Per year
                    
                        forestland.map((data) => {
                            const db_year = new Date(data.dateTime_created).getFullYear().toString();
                            if(year  === db_year && data){
                                const {ufA, uaG, laBA} = data.survey_data;
                                const forestland_ghge =  getGHGePerSurvey(falu_forestland_efactor, {ufA, uaG, laBA})
                                falu_tempGHGe += forestland_ghge
                            }
                        })
                    

                    
                        wood.map((data) => {
                            const db_year = new Date(data.dateTime_created).getFullYear().toString();
                            if(year  === db_year && data){
                                const {fuelwood, charcoal, construction, novelties} = data.survey_data;
                                const wood_ghge =  getGHGePerSurvey(falu_wood_efactor, {fuelwood, charcoal, construction, novelties})
                                falu_tempGHGe += wood_ghge
                            }
                        })
                    
                    

                    total_ghge.push({
                        ghge : mb_tempGHGe + wasteWater_tempGHGe + stationary_tempGHGe + industrial_tempGHGe + agriculture_tempGHGe + falu_tempGHGe,
                        year,
                    })

                    // mb_ghge.push({ghge : mb_tempGHGe, year : year})// mobile combustion ghge
                    // wasteWater_ghge.push({ghge : wasteWater_tempGHGe, year : year})//Waste Water ghge
                    // stationary_ghge.push({ghge : stationary_tempGHGe, year:year})//Stationary GHGe
                    // industrial_ghge.push({ghge : industrial_tempGHGe, year})//Industrial
                    // falu_ghge.push({ghge : falu_tempGHGe, year})

                })
        )






    return res.send(total_ghge.sort((a:any, b:any) => a.year - b.year))




        



        
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}














export {
    getGHGeHistoricalData  
}