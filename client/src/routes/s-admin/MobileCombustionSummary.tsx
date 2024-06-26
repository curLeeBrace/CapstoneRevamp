
import BarChart from "../../Components/Dashboard/BarChart"
import {GlobeAsiaAustraliaIcon, TruckIcon, ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {AddressReturnDataType} from "../../custom-hooks/useFilterAddrress";
import { Typography, Checkbox} from "@material-tailwind/react";
import SimpleCard from "../../Components/Dashboard/SimpleCard";
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import Municipality from "../../custom-hooks/Municipality";

const MobileCombustionSummary = () => {
    
    const axiosPrivate = useAxiosPrivate();

    const [formType, setFormType] = useState<"residential" | "commercial" | "both">();
    const [mobileCombustionData, setMobileCombustionData] = useState<any>();
    const [isLoading, set_isLoading] = useState<boolean>(false);
    const [v_typeSeries, set_vTypeSeries] = useState<any[]>();
    const [v_ageSeries, set_vAgeSeries] = useState<any[]>();
    const [vehicle_ghge_rate, setVehicleGHGeRate] = useState<any[]>();

    const [address, setAddress] = useState<AddressReturnDataType>();

    const [user, setUser] = useState({
        type : "",
        municipality_code: "",
        province_code :"",
        municipality_name : "",
    });


    useEffect(()=>{
        const user_info = Cookies.get("user_info");
        if (user_info) {
            const { municipality_code, user_type, municipality_name, province_code } = JSON.parse(user_info as string);
            if (user_type === "lgu_admin") {
              setUser({
                municipality_code,
                municipality_name,
                province_code,
                type: user_type,
              });
            }
          }
    },[])
  




    useEffect(()=> {
        let muni_code = user.type === "lgu_admin" ? user.municipality_code : address ? address.address_code : undefined
        let prov_code = user.type === "lgu_admin" ? user.province_code : address ? address.parent_code : undefined

        if(formType){
    

            set_isLoading(true)
            axiosPrivate.get(`/summary-data/mobile-combustion/${prov_code}/${muni_code}/${formType}`)
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
                            y : vehicle.counts_ofVehicleTypes[index]
                        }
                    })
                }])

                set_vAgeSeries([{
                    name: 'count',
                    data : vehicle.vehicleAges.map((v_age:any, index:any) => {
                        return {
                            x : `${v_age} year(s) old`,
                            y : vehicle.counts_ofVehicleAge[index]
                        }
                    })
                }])

                setVehicleGHGeRate([{
                    name: 'ghge',
                    data : vehicle.vehicleTypes.map((v_type:any, index:any) => {
                        return {
                            x : v_type,
                            y : vehicle.vehicle_ghge_rate[index].toFixed(2)
                        }
                    })
                }])




            })
            .catch(err => {
                set_isLoading(false)
                console.log(err)
            });
        }

    },[formType,address])


    const handleFormType = (event : React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>{
        const value = event.target.value
        setFormType(value as any);

    }


 

   

    
    return (
        <div className="">
            <div className="flex flex-col w-full px-20 gap-5">
                {/* TITLE */}
                <div className="text-center mt-3">
                    <Typography className="font-bold text-2xl text-gray-800" >Summary Data of Mobile Combustion</Typography>
                </div>
                <div className="flex gap-5 flex-wrap">
                    <div className=" basis-full md:basis-1/5">
                        {/* dito */}
                        <Municipality setAddress={setAddress} />
                       
                        

                    </div>
                    <div className="flex basis-8/12">
                        <Checkbox
                            name='formType'
                            value={'residential'}
                            checked={formType === "residential"} // Checked if this is selected
                            onChange={(event) => handleFormType(event)} // Handler for selection
                            label={
                            <Typography variant="small" color="gray" className="font-normal mr-4">
                                Residential
                            </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />
                        <Checkbox
                            name='formType'
                            value={'commercial'}
                            checked={formType === "commercial"} // Checked if this is selected
                            onChange={(event) => handleFormType(event)} // Handler for selection
                            label={
                            <Typography variant="small" color="gray" className="font-normal mr-4">
                                Commercial
                            </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />
                          <Checkbox
                            name='formType'
                            value={'both'}
                            checked={formType === "both"} // Checked if this is selected
                            onChange={(event) => handleFormType(event)} // Handler for selection
                            label={
                            <Typography variant="small" color="gray" className="font-normal mr-4">
                                Both
                            </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />
                    </div> 
                </div>
                {
                    mobileCombustionData?
                        
                        <div className="flex flex-wrap w-full gap-5 h-full">

                                <div className="w-full lg:w-1/3 shrink-0">

                                    <div className="h-full lg:h-40">

                                         <SimpleCard body={`${mobileCombustionData.emmission.tb_ghge.toFixed(2)}`} header="Total GHG Emmision" icon={<GlobeAsiaAustraliaIcon className="h-full w-full"/>} content=""/>
                                        {/* <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/> */}
                            
                                    </div>

                                </div>

                                <div className="flex flex-col w-full lg:w-3/5 gap-3 h-full">
                                    
                                     
                                    
                                        <BarChart chart_icon={<TruckIcon className="h-6 2-6"/>} chart_label="Vehicle Type" chart_meaning="Overall surveyed vehicles." series={v_typeSeries} isLoading = {isLoading}/>
                                        <BarChart chart_icon={<TruckIcon className="h-6 2-6"/>} chart_label="Vehicle Age" chart_meaning="Total counts of diffirent vehicle age." series={v_ageSeries} isLoading = {isLoading}/>
                                        <BarChart chart_icon={<TruckIcon className="h-6 2-6"/>} chart_label="Vehicle Emission Rate" chart_meaning="Total Emission rate per vehicle." series={vehicle_ghge_rate} isLoading = {isLoading}/>
                                  
                                           
                                     
                                        
                                        {/* <div className="">
                                            {
                                                !isLoading  ?
                                                    
                                                :<Skeleton/>
                                            }
                                        </div>
                                        <div className="">
                                            {
                                                !isLoading  ?
                                                    
                                                :<Skeleton/>
                                            }
                                        </div> */}
                                        
                                    
                                    
                                    
                                
                                </div>
                

                            </div> :
                            <div className="flex justify-center w-full">
                                <div className="basis-1/2">
                                    <SimpleCard body={"No available data yet"} header="Please select some option first to filter the data" icon={<ExclamationTriangleIcon className="h-full w-full"/>} content=""/>

                                </div>
                            </div>
                }
            </div>
        </div>
    )
}

export default MobileCombustionSummary