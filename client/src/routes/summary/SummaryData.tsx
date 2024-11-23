
import BarChart from "../../Components/Dashboard/BarChart"
import {TruckIcon} from "@heroicons/react/24/solid";

import {useEffect, useState } from "react";
import {AddressReturnDataType} from "../../custom-hooks/useFilterAddrress";
import {Typography} from "@material-tailwind/react";
// import SimpleCard from "../../Components/Dashboard/SimpleCard";

import { TabsDefault} from "../../Components/Tabs";
// import { Button } from '@material-tailwind/react';
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import SurveyData from "../SurveyData";
import FilterComponent from "../../Components/FilterComponent";
import useUserInfo from "../../custom-hooks/useUserType";
import Skeleton from "../../Components/Skeleton";
import useSelectAllData from "../../custom-hooks/useSelectAllData";
import { useParams } from "react-router-dom";

const SummaryData = () => {
    const userInfo = useUserInfo();
    const axiosPrivate = useAxiosPrivate();
    //filter
    const [formType, setFormType] = useState<"residential" | "commercial">("residential");
    const [municipality, setMunicipality] = useState<AddressReturnDataType>();
    const [brgy, setBrgy] = useState<AddressReturnDataType>();
    // const [survey_category, setSurveyCategory] = useState<string>("mobile-combustion");    
    const [yearState, setYearState] = useState<string>();
    const [isLoading, set_isLoading] = useState<boolean>(false);
    const selectAllData = useSelectAllData;

    //mobile-combustion
    // const [mobileCombustionData, setMobileCombustionData] = useState<any>();
    const [v_typeSeries, set_vTypeSeries] = useState<any[]>();
    const [v_ageSeries, set_vAgeSeries] = useState<any[]>();
    const [vehicle_ghge_rate, setVehicleGHGeRate] = useState<any[]>();
    // const [expected_ghgThisYear, set_expected_ghgThisYear] = useState<number>();
    // const [isPredicting, set_isPredicting] = useState<boolean>(false);

    //waster-water
    const [popultionUsingTheSystem, setPopultionUsingTheSystem] = useState<any[]>();

    // const [totalGHGe, setTotalGHGe] = useState<number>(0);

    const  {survey_category} = useParams()

    const wasteWaterColors = [
        '#1E90FF', 
        '#3CB371', 
        '#FFA500',
        '#FF6347', 
        '#6A5ACD', 
        '#00CED1', 
        '#7CFC00',
    ];
  

    useEffect(() => {
        console.log("Selected Municipality:", municipality);
    }, [municipality]);
    


    useEffect(()=> {

        const barColor = "#006400";
        if(formType){
                
            const selectAll = selectAllData(municipality?.address_code, brgy?.address_code);
            set_isLoading(true)
            axiosPrivate.get(`/summary-data/${survey_category}`, {params : {
                user_type : userInfo.user_type,
                province_code : userInfo.province_code,
                municipality_code : municipality?.address_code,
                brgy_code : brgy?.address_code,
                form_type : formType,
                selectAll,
                selectedYear : yearState

            }})
            .then(res => {
                if(survey_category === "mobile-combustion"){
                    const {vehicle} = res.data;
                    console.log("Summary Data : ", res.data)
                    set_isLoading(false)
                    // setMobileCombustionData(res.data)
    
                    set_vTypeSeries([{  
                        name: 'count',
                        data : vehicle.vehicleTypes.map((v_type:any, index:any) => {
                            return {
                                x : v_type,
                                y : vehicle.counts_ofVehicleTypes[index],
                                fillColor: barColor
                            }
                        }),
                      
                    }])
    
                    setVehicleGHGeRate([{
                        name: 'ghge',
                        data : vehicle.vehicleTypes.map((v_type:any, index:any) => {
                            return {
                                x : v_type,
                                y : vehicle.vehicle_ghge_rate[index].toFixed(2),
                                fillColor: barColor
                            }
                        })
                    }])
    
                    set_vAgeSeries(
    
                        vehicle.vehicleTypes.map((v_type:any, o_index:number)=>{
                            return {
                                name : v_type,
                                data : vehicle.vehicleAges.map((v_age:any, index:number) =>{
                                        // console.log(v_age);
                                        return {
                                            x : v_age.toString() +" year(s)",
                                            y : vehicle.counts_ofVehicleAge[index].ageCount_perVehicle[o_index].counts
                                        }
                                })
                              
                            }
                    }),
                    
                    )

                } else if (survey_category === "waste-water"){
                    const wasteWaterSummary : any[] = res.data;


                    setPopultionUsingTheSystem([
                        {
                            name : "Septinc Tanks",
                            data : wasteWaterSummary.map(summary => {
                                return {
                                    x : summary.location,
                                    y : summary.septic_tanks,
                                    fillColor: wasteWaterColors[0],
                                }
                            })
                        },
                        {
                            name : "Category1 - Open Pits Latrines",
                            data : wasteWaterSummary.map(summary => {
                                return {
                                    x : summary.location,
                                    y : summary.openPits_latrines.cat1,
                                }
                            }),
                            color : wasteWaterColors[1]
                        },
                        {
                            name : "Category2 - Open Pits Latrines",
                            data : wasteWaterSummary.map(summary => {
                                return {
                                    x : summary.location,
                                    y : summary.openPits_latrines.cat2,
                                    
                                }
                            }),
                            color : wasteWaterColors[2]
                        },
                        {
                            name : "Category3 - Open Pits Latrines",
                            data : wasteWaterSummary.map(summary => {
                                return {
                                    x : summary.location,
                                    y : summary.openPits_latrines.cat3,
                                }
                            }),
                            color : wasteWaterColors[3]
                        },
                        {
                            name : "Category4 - Open Pits Latrines",
                            data : wasteWaterSummary.map(summary => {
                                return {
                                    x : summary.location,
                                    y : summary.openPits_latrines.cat4,
                                }
                            }),
                            color : wasteWaterColors[4]
                        },
                        {
                            name : "Category1 - River Discharge",
                            data : wasteWaterSummary.map(summary => {
                                return {
                                    x : summary.location,
                                    y : summary.riverDischarge.cat1,
                                }
                            }),
                            color: wasteWaterColors[5]
                        },
                        {
                            name : "Category2 - River Discharge",
                            data : wasteWaterSummary.map(summary => {
                                return {
                                    x : summary.location,
                                    y : summary.riverDischarge.cat2,
                                }
                            }),
                            color: wasteWaterColors[6]
                        },
                    ])
                    
                    console.log("Waste Water : ", res.data)



                }

            })
            .catch(err => {
                console.log(err)
            })
            .finally(()=>set_isLoading(false))
        }


        // set_expected_ghgThisYear(undefined);

    },[formType, municipality?.address_code, brgy?.address_code, yearState, survey_category])

    


    // const getExpected_ghgThisYear = () => {
        
    //     set_isPredicting(true);
    //     axiosPrivate.get(`/forecast/e-mobile/${municipality?.address_code}/${formType}`)
    //     .then(res => {

    //         if(res.status == 200){
    //             let totalExpetedGHG_thisYear = 0;
    //             const result:{
    //                 co2e : number,
    //                 ch4e : number,
    //                 n2oe : number,
    //                 ghge : number
    //             }[]= res.data;
                
    
    
    //             result.forEach(res => {
    //                 totalExpetedGHG_thisYear += res.ghge;
    //             })
    //             totalExpetedGHG_thisYear+=mobileCombustionData.emmission.tb_ghge
    
    //             set_expected_ghgThisYear(totalExpetedGHG_thisYear);
              
    //         } else {
    //             alert("Insuficient Data can't forecast!!");
    //         }



    //     })
    //     .catch(err => console.log(err))
    //     .finally(()=>set_isPredicting(false))


    // }


    return (
        <div className="">
            <div className="flex flex-col w-full px-20 gap-5 mt-5">
                {/* TITLE */}
                <div className="flex self-center -mt-1 -mb-5">
                    <Typography className="font-bold text-white text-2xl text-center mb-4 bg-darkgreen py-2 px-10 rounded-lg" >{`${survey_category === "mobile-combustion" ? "Mobile Combustion" : "Waste Water"}`}</Typography>
                </div>
          
                    
                <div className="flex gap-3 flex-wrap ">
                    {/* <div className="w-full 2xl:w-52">
                        <Select  value={survey_category} label="GHGe Category" onChange={(value)=>setSurveyCategory(value as string)}>
                            <Option value="mobile-combustion">Mobile Combustion</Option>
                            <Option value="waste-water">Waste Water</Option>
                        </Select>

                    </div> */}

                    <div className="w-full text-nowrap 2xl:w-4/5 border-green-400 border-2 rounded-lg py-2 px-2">
                        <FilterComponent
                        
                            municipalityState={
                                {
                                    state : municipality,
                                    setState : setMunicipality
                                }
                                
                            }
                            formTypeState={
                                {
                                    state : formType,
                                    setState : setFormType
                                }
                            }
                            brgyState={
                                {
                                    state : brgy,
                                    setState : setBrgy
                                }
                            }
                        

                            yearState={
                                {
                                    state : yearState,
                                    setState : setYearState
                                }
                            }
                            
                            
                        
                        />
                    </div>

                </div>
                    
                
                {
                    !isLoading?
                        
                        <div className="flex h-auto flex-col gap-3">

                                
                                <div className="w-full flex flex-col gap-2 flex-wrap lg:flex-nowrap">
{/*                                     
                                    <div className="h-24 w-full">
                                        <SimpleCard body={`${totalGHGe.toFixed(2)}`} header="Total GHGe" icon={<GlobeAsiaAustraliaIcon className="h-full w-full"/>} isLoading = {isLoading}/>
                                    </div> */}
                                    {/* <div className="h-40 w-full lg:w-1/2">
                                        <SimpleCard body={
                                            expected_ghgThisYear ? expected_ghgThisYear.toFixed(5)
                                            :<Button onClick={()=>getExpected_ghgThisYear()} loading = {isPredicting}>{isPredicting ? "This may take a few minutes" : "Click me to predict"}</Button>
                                            
                                        } header="Expected GHGe this year" icon={<GlobeAsiaAustraliaIcon className="h-full w-full"/>} isLoading = {isLoading}/>
                                    </div>   */}
                               
                                
                               
                                    <TabsDefault data={[
                                    {
                                        label : 'Survey Data',
                                        value : 's-data',
                                        tabPanelChild : 
                                        <SurveyData form_type={formType} 
                                            muni_code={
                                                userInfo.user_type === "s-admin" 
                                                ? municipality ? municipality.address_code : undefined 
                                                : userInfo.user_type === "lgu_admin"
                                                ? municipality ? municipality.address_code : userInfo.municipality_code 
                                                : userInfo.user_type === "lu_admin"
                                                ? municipality ? municipality.address_code : userInfo.municipality_name
                                                : undefined
                                            } 
                                            prov_code={    
                                                userInfo.province_code

                                            } 

                                            brgy_code={brgy?.address_code} 
                                            // selectAll = {selectAll} 
                                            survey_category={survey_category} // this is a manual, but is supose to be automatic when it comes in passing the value
                                            selectedYear = {yearState}
                                            // totalGHGeSetState={setTotalGHGe}
                                        />

                                        
                                    },
                                    {
                                        label : 'Graph',
                                        value : 'm-graph',
                                        tabPanelChild : 
                                            <div className="flex flex-col w-full gap-3 h-full">
                                                
                                                {
                                                    survey_category === "mobile-combustion" ?
                                                    <>
                                                        <div className="h-full shrink-0">
                                                            <BarChart chart_icon={<TruckIcon className="w-6 h-6"/>} chart_label={`Vehicle Type (${formType})`}  
                                                            chart_meaning={`Overall surveyed vehicles in
                                                            ${userInfo.user_type === "s-admin"
                                                                ? municipality?.address_name || "Laguna Province" 
                                                                : userInfo.user_type === "lgu_admin"
                                                                ? `${brgy?.address_name || userInfo.municipality_name}` 
                                                                : userInfo.user_type === "lu_admin"
                                                                ? `${userInfo.municipality_name}` 
                                                                : "Selected Area"
                                                            }.`}
                                                            series={v_typeSeries} isLoading = {isLoading}/>
                                                        </div>

                                                        <div className="h-full shrink-0">

                                                        <BarChart chart_icon={<TruckIcon className="h-6 w-6"/>} chart_label={`Vehicle Emission Rate (${formType})`}
                                                          chart_meaning={`Total Emission rate per vehicle in
                                                            ${userInfo.user_type === "s-admin"
                                                                ? municipality?.address_name || "Laguna Province" 
                                                                : userInfo.user_type === "lgu_admin"
                                                                ? `${brgy?.address_name || userInfo.municipality_name}` 
                                                                : userInfo.user_type === "lu_admin"
                                                                ? "Laguna University"
                                                                : "Selected Area"
                                                            }.`}
                                                        series={vehicle_ghge_rate} isLoading = {isLoading}/>
                                                        </div>

                                                        <div className="h-full shrink-0">

                                                            <BarChart chart_icon={<TruckIcon className="h-6 w-6"/>} chart_label={`Vehicle Age (${formType})`} 
                                                            chart_meaning={`Total counts of diffirent vehicle age in
                                                                ${userInfo.user_type === "s-admin"
                                                                    ? municipality?.address_name || "Laguna Province" 
                                                                    : userInfo.user_type === "lgu_admin"
                                                                    ? `${brgy?.address_name || userInfo.municipality_name}` 
                                                                    : userInfo.user_type === "lu_admin"
                                                                    ? "Laguna University"
                                                                    : "Selected Area"
                                                                }.`}
                                                            series={v_ageSeries} isLoading = {isLoading}/>
                                                        </div>
                                                    </>
                                                    : 
                                                    
                                                    <BarChart chart_icon={<TruckIcon className="w-6 h-6"/>} chart_label={`Waste Water (${formType}) Population Using The Sytem`} 
                                                     chart_meaning={`Count Of People Using The Sytem in
                                                        ${userInfo.user_type === "s-admin" 
                                                            ? municipality?.address_name || "Laguna Province" 
                                                            : userInfo.user_type === "lgu_admin"
                                                            ? `${brgy?.address_name || userInfo.municipality_name}` 
                                                            : userInfo.user_type === "lu_admin"
                                                            ? "Laguna University"
                                                            : "Selected Area"
                                                        }.`} 
                                                     series={popultionUsingTheSystem} isLoading = {isLoading} />
                                                }
                                    
                                            </div>
                
                                    }
                                    ]} />
                                    
                                </div>


           
                              
                               

                          

                            </div> :
                            <div className="flex justify-center w-full">
                                    <Skeleton/>
                                    {/* <SimpleCard body={"No available data yet"} header="Please select some option first to filter the data" icon={<ExclamationTriangleIcon className="h-full w-full"/>} isLoading = {isLoading}/> */}
                            </div>
                }
            </div>
        </div>
    )
}

export default SummaryData