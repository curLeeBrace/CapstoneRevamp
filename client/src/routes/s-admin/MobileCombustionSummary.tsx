
import LineChart from "../../Components/Dashboard/BarChart"
import {Cog6ToothIcon, PowerIcon, FaceSmileIcon} from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import useFilterAddress, {AddressReturnDataType} from "../../custom-hooks/useFilterAddrress";
import { Typography, Select, Option, Checkbox} from "@material-tailwind/react";
import { SimpleCard } from "../../Components/Dashboard/SimpleCard";

const MobileCombustionSummary = () => {
    const [city_opt, set_city_opt] = useState<string[]>();
    const [address, setAddress] = useState<AddressReturnDataType>();
    const [formType, setFormType] = useState<"residential" | "commercial" | "both">();
    const filterADddress = useFilterAddress;

    useEffect(()=>{
        const address = filterADddress({address_type : "mucipality"}) as AddressReturnDataType[]
        set_city_opt(address.map(addr => addr.address_name));

    },[])

    useEffect(()=> {
        console.log("Sheesh")
        console.log(address);
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
                    <Typography className="font-bold text-xl text-gray-800" >Summary Data of Mobile Combustion</Typography>
                </div>
                <div className="flex gap-5 flex-wrap">
                    <div className=" basis-full md:basis-1/5">
                        <Select onChange={(value) => {
                            setAddress((prev : any) => {
                                let lgu_municipality:any;   
                                
                
                                const mucipality_data= filterADddress({address_type : "mucipality"});
                                mucipality_data.forEach(data =>{
                                    if(data.address_name === value){
                    
                                    lgu_municipality = {
                                        municipality_name : data.address_name,
                                        municipality_code : data.address_code,
                                        province_code : data.parent_code,
                                    }
                                    }
                                })
                
                                return prev = lgu_municipality
                            })
                        }}
                        >
                            {city_opt? 
                                city_opt.map((city, index)=>(
                                    <Option value={city} key = {index}>
                                        {city}
                                    </Option>
                                )) : <Option value =""> </Option>
                            }
                        </Select>

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

                <div className="flex gap-5">
                        <div className="basis-2/5 ">
                            <div className="h-1/2">
                                <SimpleCard body="10.5" header="Total GHG Emmision" icon={<FaceSmileIcon className="h-6 2-6"/>}/>

                            </div>

                        </div>

                        <div className="flex flex-col bg-slate-700 basis-3/5">
                            <LineChart chart_icon={<FaceSmileIcon className="h-6 2-6"/>} chart_label="asd" chart_meaning="asd"/>
                            <LineChart chart_icon={<FaceSmileIcon className="h-6 2-6"/>} chart_label="asd" chart_meaning="asd"/>
                        </div>
        

                    </div>
            </div>
        </div>
    )
}

export default MobileCombustionSummary