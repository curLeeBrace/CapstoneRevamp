import { Input, Radio } from "@material-tailwind/react"
import BrgyMenu from "../../../custom-hooks/BrgyMenu"
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import { useEffect, useState } from "react";
import useUserInfo from "../../../custom-hooks/useUserType";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import { Link, useLocation } from "react-router-dom";
import useSearchFilter from "../../../custom-hooks/useSearchFilter";

import Table from "../../../Components/Table";
import SimpleCard from "../../../Components/Dashboard/SimpleCard";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";




const ForestAndLandUseList = () => {
    const [brgy, setBrgy] =  useState<AddressReturnDataType>();
    const [falu_type, setFALU_type] = useState<string>("falu-wood");




    const [tb_head, set_tbHead] = useState<string[]>();
    const [tb_data, set_tbData] = useState<any[][]>();
    const user_info = useUserInfo();
    const axiosPrivate = useAxiosPrivate();

    const [searchQuery, setSearchQuery] = useState<string>(""); 
    const filteredData = useSearchFilter(tb_data, searchQuery); 
    const {state} = useLocation();
    const locationLabel = user_info?.user_type === "lu_surveyor" ? "Institution" : "Brgy";


    useEffect(()=>{
        if(falu_type === "falu-wood"){
            set_tbHead(["ID", locationLabel, "Staus", "Fuel-Wood", "Charcoal", "Construction", "Novelties", "DateTime","Action"])
        } else {
            set_tbHead(["ID", locationLabel, "Status", "Used for Agriculture", " Used as Grasslands", " Left as Barren Areas", "DateTime","Action"])
        }
    },[falu_type])
    
    useEffect(()=>{
        const {user_type,municipality_code} = user_info

        axiosPrivate.get(`/forms/${falu_type}/surveyed-data`, {params : {
            user_type,
            municipality_code : municipality_code,
            brgy_code : brgy?.address_code,
            surveyType : null
        }})
        .then(res => {
            const form_data = res.data;
            // console.log("Indstrial Data : ", form_data);

            const preparedData = prepare_tbData(falu_type as string, form_data);

            console.log("Prepared Data : ", preparedData)

            set_tbData(preparedData);

        })
        .catch((err)=> console.log("SURVEY LIST : ", err))


    },[brgy, falu_type])




    const prepare_tbData = (falu_type : string, form_data:any[]) :any[][] => {
        let tb_data: any[] = [];
        if(falu_type === "falu-wood") {
            tb_data = form_data.map((data: any) => {
                const form_id = data.form_id;
                const brgy_name = data.survey_data.brgy_name
                const status = data.survey_data.status
                const {
                    dsi,
                    type_ofData,
                    fuelwood,
                    charcoal,
                    construction,
                    novelties,
                } = data.survey_data

                let statusText: string;
                let statusColor: string; 
                
                const statusNumber = Number(status);  
                  
                switch (statusNumber) {
                  case 0:
                    statusText = "Updated";
                    statusColor = "text-green-500 font-bold";  
                    break;
                  case 1:
                    statusText = "Pending";
                    statusColor = "text-red-500 font-bold"; 
                    break;
                  case 2:
                    statusText = "Updated";
                    statusColor = "text-green-500 font-bold";  
                    break;
                  default:
                    statusText = "Updated";
                    statusColor = "text-green-500 font-bold"; 
                }                

                const dateTime = data.dateTime_edited
                ? new Date(data.dateTime_edited).toLocaleDateString() + " " + new Date(data.dateTime_edited).toLocaleTimeString()
                : new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();
                    
                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/forestry-land-use/update/0/falu-wood?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        dsi,
                        type_ofData,
                        fuelwood,
                        charcoal,
                        construction,
                        novelties,
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                  return [
                    form_id.slice(-3),
                    brgy_name,
                    <span className={statusColor}>{statusText}</span>,
                    fuelwood,
                    charcoal,
                    construction,
                    novelties, 
                    dateTime,
                    LinkComponent
                  ]

            })



              
        } else {

            tb_data = form_data.map((data: any) => {
                const form_id = data.form_id;
                const brgy_name = data.survey_data.brgy_name
                const status = data.survey_data.status
                const {
                    dsi,
                    type_ofData,
                    ufA,
                    uaG,
                    laBA,
            
                } = data.survey_data

                
                let statusText: string;
                let statusColor: string; 
                
                const statusNumber = Number(status);  
                
                 
                switch (statusNumber) {
                  case 0:
                    statusText = "Updated";
                    statusColor = "text-green-500 font-bold";  
                    break;
                  case 1:
                    statusText = "Pending";
                    statusColor = "text-red-500 font-bold"; 
                    break;
                  case 2:
                    statusText = "Updated";
                    statusColor = "text-green-500 font-bold";  
                    break;
                  default:
                    statusText = "Updated";
                    statusColor = "text-green-500 font-bold"; 
                }                
                
                
                const dateTime = data.dateTime_edited
                ? new Date(data.dateTime_edited).toLocaleDateString() + " " + new Date(data.dateTime_edited).toLocaleTimeString()
                : new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();
                    
                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/forestry-land-use/update/1/falu-forestland?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        dsi,
                        type_ofData,
                        ufA,
                        uaG,
                        laBA,
                    
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                  return [
                    form_id.slice(-3),
                    brgy_name,
                    <span className={statusColor}>{statusText}</span>,
                    ufA,
                    uaG,
                    laBA, 
                    dateTime,
                    LinkComponent
                  ]

            })
        }



        return tb_data


    }
    
    return (
        <div className="flex flex-col py-3 gap-5 px-5 lg:px-24 ">
            <div className="text-2xl self-center rounded-lg bg-darkgreen text-white py-2 px-2">Forest And Land Use List</div>    <div className="flex bg-blue-gray-100 flex-wrap justify-center p-3 rounded-md shadow-md">
                <div className=" w-full lg:w-52 mx-20">
                    <BrgyMenu setBrgys={setBrgy} municipality_code={user_info.municipality_code} user_info={user_info} deafult_brgyName={user_info.user_type === 'lu_surveyor' ? 'Laguna University' : (state && state.brgy_name) }/>
                <div className="my-2">  
                <Input
                    type="search"
                    label="Search ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className=' bg-none'
                />
               
          </div> 
        
                </div>
                <div className="flex  w-full gap-4 lg:w-1/2 flex-wrap">
               
                {/* <Radio defaultChecked name="indusry_type" label="All" color ="green" value={"all"} onChange={(e:any)=>setIndustryType(e.target.value)}/> */}
                    <Radio defaultChecked name="falu_type" label="Wood" color ="green" value={"falu-wood"} onChange={(e:any)=>setFALU_type(e.target.value)}/>
                    <Radio name="falu_type" label="ForestLand" color ="green" value={"falu-forestland"} onChange={(e:any)=>setFALU_type(e.target.value)}/>

                </div>
            </div>

            <div>
                {

                    tb_head && filteredData.length ? (
                    <Table tb_datas={filteredData} tb_head={tb_head} />
                    ) : (
                        <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
                    )

                }
                
            </div>


        </div>
    )
}

export default ForestAndLandUseList