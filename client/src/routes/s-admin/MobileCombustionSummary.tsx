
import BarChart from "../../Components/Dashboard/BarChart"
import {GlobeAsiaAustraliaIcon, TruckIcon, ExclamationTriangleIcon} from "@heroicons/react/24/solid";

import {useEffect, useState } from "react";
import {AddressReturnDataType} from "../../custom-hooks/useFilterAddrress";
import { Typography} from "@material-tailwind/react";
import SimpleCard from "../../Components/Dashboard/SimpleCard";

import { TabsDefault} from "../../Components/Tabs";
import { Button } from '@material-tailwind/react';
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import MC_SurveyData from "../MC_SurveyData";
import FilterComponent from "../../Components/FilterComponent";
import useUserInfo from "../../custom-hooks/useUserType";

const MobileCombustionSummary = () => {
    const user_info = useUserInfo();
    const axiosPrivate = useAxiosPrivate();
    const [formType, setFormType] = useState<"residential" | "commercial">();
    const [municipality, setMunicipality] = useState<AddressReturnDataType>();
    const [brgy, setBrgy] = useState<AddressReturnDataType>();
    const [selectAll, setSelectAll] = useState(false);
    const [yearState, setYearState] = useState<string>();

    const [mobileCombustionData, setMobileCombustionData] = useState<any>();
    const [isLoading, set_isLoading] = useState<boolean>(false);
    const [v_typeSeries, set_vTypeSeries] = useState<any[]>();
    const [v_ageSeries, set_vAgeSeries] = useState<any[]>();
    const [vehicle_ghge_rate, setVehicleGHGeRate] = useState<any[]>();
 

    // const [user, setUser] = useState({
    //     type : "",
    //     municipality_code: "",
    //     province_code :"",
    //     municipality_name : "",
    // });
   

    const [expected_ghgThisYear, set_expected_ghgThisYear] = useState<number>();
    const [isPredicting, set_isPredicting] = useState<boolean>(false);


    // let muni_code = user.type === "lgu_admin" ? user.municipality_code : municipality ? municipality.address_code : undefined
    // let prov_code = user.type === "lgu_admin" ? user.province_code : municipality ? municipality.parent_code : undefined

    // useEffect(()=>{
    //     const user_info = Cookies.get("user_info");
    //     if (user_info) {
    //         const { municipality_code, user_type, municipality_name, province_code } = JSON.parse(user_info as string);
    //         if (user_type === "lgu_admin") {
    //           setUser({
    //             municipality_code,
    //             municipality_name,
    //             province_code,
    //             type: user_type,
    //           });
    //         }
    //       }
    // },[])
  




    useEffect(()=> {

        
        const barColor = "#006400";
        if(formType && municipality){
    

            set_isLoading(true)
            axiosPrivate.get('/summary-data/mobile-combustion', {params : {
                user_type : user_info.user_type,
                province_code : user_info.province_code,
                municipality_code : municipality.address_code,
                brgy_code : brgy?.address_code,
                form_type : formType,
                selectAll : selectAll,
                selectedYear : yearState


            }})
            .then(res => {
                const {vehicle} = res.data;
                console.log("Summary Data : ", res.data)
                set_isLoading(false)
                setMobileCombustionData(res.data)

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




            })
            .catch(err => {
                console.log(err)
            })
            .finally(()=>set_isLoading(false))
        }


        set_expected_ghgThisYear(undefined);

    },[formType,municipality, selectAll, brgy, yearState])




    const getExpected_ghgThisYear = () => {
        
        set_isPredicting(true);
        axiosPrivate.get(`/forecast/e-mobile/${municipality?.address_code}/${formType}`)
        .then(res => {

            if(res.status == 200){
                let totalExpetedGHG_thisYear = 0;
                const result:{
                    co2e : number,
                    ch4e : number,
                    n2oe : number,
                    ghge : number
                }[]= res.data;
                
    
    
                result.forEach(res => {
                    totalExpetedGHG_thisYear += res.ghge;
                })
                totalExpetedGHG_thisYear+=mobileCombustionData.emmission.tb_ghge
    
                set_expected_ghgThisYear(totalExpetedGHG_thisYear);
              
            } else {
                alert("Insuficient Data can't forecast!!");
            }



        })
        .catch(err => console.log(err))
        .finally(()=>set_isPredicting(false))


    }


    return (
        <div className="">
            <div className="flex flex-col w-full px-20 gap-5">
                {/* TITLE */}
                <div className="text-center mt-3">
                    <Typography className="font-bold text-2xl text-gray-800" >Summary Data of Mobile Combustion</Typography>
                </div>
          
                    
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
                        selectAllState={
                            {
                                setState : setSelectAll,
                                state : selectAll
                            }
                        }

                        yearState={
                            {
                                state : yearState,
                                setState : setYearState
                            }
                        }
                    
                    />
                
                {
                    mobileCombustionData?
                        
                        <div className="flex h-auto flex-col gap-3">

                                
                                <div className="w-full flex gap-5 flex-wrap lg:flex-nowrap">
                                    
                                    <div className="h-40 w-full lg:w-1/2">
                                        <SimpleCard body={`${mobileCombustionData.emmission.tb_ghge.toFixed(2)}`} header="Total GHGe" icon={<GlobeAsiaAustraliaIcon className="h-full w-full"/>} isLoading = {isLoading}/>
                                    </div>
                                    <div className="h-40 w-full lg:w-1/2">
                                        <SimpleCard body={
                                            expected_ghgThisYear ? expected_ghgThisYear.toFixed(5)
                                            :<Button onClick={()=>getExpected_ghgThisYear()} loading = {isPredicting}>{isPredicting ? "This may take a few minutes" : "Click me to predict"}</Button>
                                            
                                        } header="Expected GHGe this year" icon={<GlobeAsiaAustraliaIcon className="h-full w-full"/>} isLoading = {isLoading}/>
                                    </div>  
                                </div>
                                
                               
                                    <TabsDefault data={[
                                    {
                                        label : 'Survey Data',
                                        value : 's-data',
                                        tabPanelChild : <MC_SurveyData form_type={formType} muni_code={municipality?.address_code} prov_code={user_info.province_code} brgy_code={brgy?.address_code} selectAll = {selectAll} selectedYear = {yearState}/>

                                    
                                        
                                    },
                                    {
                                        label : 'Graph',
                                        value : 'm-graph',
                                        tabPanelChild : 
                                            <div className="flex flex-col w-full gap-3 h-auto">
                                            
                                                <BarChart chart_icon={<TruckIcon className="w-6 h-6"/>} chart_label="Vehicle Type" chart_meaning="Overall surveyed vehicles." series={v_typeSeries} isLoading = {isLoading}/>
                                                <BarChart chart_icon={<TruckIcon className="h-6 w-6"/>} chart_label="Vehicle Emission Rate" chart_meaning="Total Emission rate per vehicle." series={vehicle_ghge_rate} isLoading = {isLoading}/>
                                                <BarChart chart_icon={<TruckIcon className="h-6 w-6"/>} chart_label="Vehicle Age" chart_meaning="Total counts of diffirent vehicle age." series={v_ageSeries} isLoading = {isLoading}/>
                                    
                                            </div>
                
                                    }
                                    ]} />


           
                              
                               

                          

                            </div> :
                            <div className="flex justify-center w-full">
                                <div className="basis-1/2">
                                    <SimpleCard body={"No available data yet"} header="Please select some option first to filter the data" icon={<ExclamationTriangleIcon className="h-full w-full"/>} isLoading = {isLoading}/>

                                </div>
                            </div>
                }
            </div>
        </div>
    )
}

export default MobileCombustionSummary