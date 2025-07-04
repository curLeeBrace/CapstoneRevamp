import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType";
import YearMenu from "../../../Components/YearMenu";
import { Radio, Typography } from "@material-tailwind/react";
import BarChart, {BarSeriesTypes} from "../../../Components/Dashboard/BarChart";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { TabsDefault } from "../../../Components/Tabs";
import AgricultureRawData from "./AgricultureRawData";
import Skeleton from "../../../Components/Skeleton";
const AgricultureSummary = () => {
    const axiosPrivate = useAxiosPrivate();
    const [agricultureType, setAgricultureType] = useState<string>("crops");
    const {user_type, municipality_code, province_code} = useUserInfo()
    const [year, setYear] = useState<string>();
    const [agricultureSeries, setAgricultureSeries] = useState<BarSeriesTypes[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const user_info = useUserInfo()


    useEffect(()=>{


        axiosPrivate.get('/summary-data/agriculture',{
            params : {
                user_type,
                agricultureType : agricultureType,
                municipality_code,
                prov_code : province_code,
                year : year ? year : new Date().getFullYear()
            }
        })
        .then((res) => {

            const agricultureData = res.data;
            if(agricultureType === "crops"){

                setAgricultureSeries([
                    {  
                        name : "Dry Season, Irrigated (Has)",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.rdsi
                            }
                        }),
                        
                    },
                    {  
                        name : "Dry Season, Rainfed (Has)",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.rdsr
                            }
                        }),
                        
                    },
                    {  
                        name : "Wet Season, Irrigated (Has)",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.rwsi
                            }
                        }),
                        
                    },
                    {  
                        name : "Wet Season, Rainfed (Has)",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.rwsr
                            }
                        }),
                        
                    },
                    {  
                        name : "Crops Residue (Tons)",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.crop_residues
                            }
                        }),
                        
                    },
                    {  
                        name : "Dolomite and/or Limestone Consumption (Kg)",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.dol_limestone
                            }
                        }),
                        
                    },
                ])



            } else {
                setAgricultureSeries([
                    {  
                        name : "Buffalo",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.buffalo
                            }
                        }),
                        
                    },
                    {  
                        name : "Dairy Cattle",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.cattle
                            }
                        }),
                        
                    },
                    {  
                        name : "Goat",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.goat
                            }
                        }),
                        
                    },

                    {  
                        name : "Horse",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.horse
                            }
                        }),
                        
                    },
                    {  
                        name : "Non-Dairy Cattle",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.non_dairyCattle
                            }
                        }),
                        
                    },
                    {  
                        name : "Poultry",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.poultry
                            }
                        }),
                        
                    },
                    {  
                        name : "Swine",
                        data : agricultureData.map((data:any)=> {
                            return {
                                x : data.location,
                                y : data.swine
                            }
                        }),
                        
                    },
                ])


            }
            
            console.log(res.data);
        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))




    },[agricultureType, year])
    return (
        <div className="flex flex-col p-10">
            <Typography color="white" className="font-bold text-2xl flex self-center text-center -mt-6 mb-4 bg-darkgreen py-2 px-10 rounded-lg">
                                    Agriculture
                                </Typography>
           <div className="flex gap-5">
                <div className="bg-darkgreen border-2 rounded-xl px-20 mb-2">
                    <Radio defaultChecked name="agricultureType" label={<span className="font-bold text-white">Crops</span>} color ="green" value={"crops"} onChange={(e:any)=>setAgricultureType(e.target.value)}/>
                    <Radio name="agricultureType" label={<span className="font-bold text-white">Live-Stocks</span>} color ="green" value={"livestocks"} onChange={(e:any)=>setAgricultureType(e.target.value)}/>
                </div>
                <div><YearMenu useYearState={[year, setYear]}/></div>
           </div>
           <div>
            {agricultureSeries && isLoading? 
              <Skeleton />
              :
                <TabsDefault
                    data={[
                        {
                            label : "Survey Data",
                            value : "s-data",
                            tabPanelChild : <AgricultureRawData agricultureType = {agricultureType} year={year ? year : new Date().getFullYear().toString()}/>
                        },
                        {
                            label : "Bar Chart",
                            value : "barChart",
                            tabPanelChild : <BarChart chart_icon={<ChartBarIcon className="w-6 h-6"/>} chart_label={`Agriculture ${agricultureType}`} 
                            chart_meaning={`Overall collected data in ${
                                user_info.user_type === "s-admin"
                                ? "Laguna Province"
                                : user_info.user_type === "lgu_admin" || user_info.user_type === "lu_admin"
                                ? user_info.municipality_name
                                : "Brgy."
                            }`}
                            series={agricultureSeries} isLoading = {isLoading}/>
                            
                        },

                    ]}
                
                />
            
            
            
            
            
            
           }
                
           </div>
        </div>
    )
}


export default AgricultureSummary