import { useEffect, useState } from "react"
import BrgyMenu from "../../../custom-hooks/BrgyMenu"
import useUserInfo from "../../../custom-hooks/useUserType";
import { Input, Radio } from "@material-tailwind/react";
import Table from "../../../Components/Table";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import { Link } from "react-router-dom";
import useSearchFilter from "../../../custom-hooks/useSearchFilter";
import SimpleCard from "../../../Components/Dashboard/SimpleCard";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";


const IndustrialList = () => {

    const [brgy, setBrgy] = useState<AddressReturnDataType>();
    const [indsutryType, setIndustryType] = useState<string>("mineral");
    const { municipality_code} = useUserInfo();

    const [tb_head, set_tbHead] = useState<string[]>();
    const [tb_data, set_tbData] = useState<any[][]>();


    const axiosPrivate = useAxiosPrivate();

    const [searchQuery, setSearchQuery] = useState<string>(""); 
    const filteredData = useSearchFilter(tb_data, searchQuery); 

  
    




    //Setting Table Headers
    useEffect(()=>{
        

        if(indsutryType === "mineral"){
            set_tbHead(["ID",
                "Brgy", "DSI", "Type of Data", 
                "Cement Production - Portland (tons)", 
                "Lime Production (tons)", "Cement Production - Portland (blended)", 
                "Glass Production (tons)", "DateTime", "Action"
            ]);
        } else if(indsutryType === "chemical"){
            set_tbHead(
                ["ID",
                    "Brgy", "DSI", "Type of Data", 
                    "Ammonia Production (tons)", "Soda Ash Production (tons)", 
                    "Dichloride and Vinyl Chloride Monomer (tons)", "Methanol (tons)",
                    "Ethylene oxide (tons)", "Carbon black (tons)", "Ethylene (tons)", 
                    "Acrylonitrile (tons)" , "DateTime", "Action"
                ]
            );
        } else if(indsutryType === "metal"){
            set_tbHead(
                ["ID",
                    "Brgy", "DSI", "Type of Data", 
                    "Iron and Steel Production from Integrated Facilities (tons)", 
                    "Iron and Steel Production from Non-integrated Facilities (tons)",
                    "DateTime", "Action" 
                ]
            );

        } else if(indsutryType === "electronics"){
            set_tbHead(
                ["ID",
                    "Brgy", "DSI", "Type of Data", 
                    "Integrated circuit of semiconductor (tons)", 
                    "Photovoltaics (tons)", "TFT Flat Panel Display (tons)",
                    "Heat transfer fluid (tons)",
                    "DateTime", "Action" 
                ]
            );

        } else if(indsutryType === "others"){


            set_tbHead(
                ["ID",
                    "Brgy", "DSI", "Type of Data", 
                    "Pulp and paper industry (tons)", 
                    "Other carbon in pulp (tons)", "Food and beverages industry (tons)",
                    "DateTime", "Action" 
                ]
            );

        }

    },[indsutryType])



    useEffect(()=>{

        axiosPrivate.get(`/forms/industrial-${indsutryType}/surveyed-data`, {params : {
            municipality_code : municipality_code,
            brgy_code : brgy?.address_code,
            surveyType : null
        }})
        .then(res => {
            const form_data = res.data;
            console.log("Indstrial Data : ", form_data);

            const preparedData = prepare_tbData(indsutryType as string, form_data);


            set_tbData(preparedData);

        })
        .catch((err)=> console.log("SURVEY LIST : ", err))




    },[indsutryType, brgy])





    const prepare_tbData = (indsutryType: string, form_data: any[]) : any[][] => {
        let tb_data: any[] = [];

        if(indsutryType === "mineral"){

            tb_data = form_data.map((data: any) => {
                const {
                    brgy_name, dsi, type_ofData,
                    cpp, lp, cpb,
                    gp,
                } = data.survey_data;

                const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();

                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/industrial/update/0/mineral?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        dsi,
                        type_ofData,
                        cpp,
                        lp,
                        cpb,
                        gp
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                  return [
                    data.form_id,
                    brgy_name, dsi, type_ofData,
                    cpp, lp, cpb,
                    gp, dateTime,   LinkComponent
                ]

            })
        } else if(indsutryType === "chemical") {

            tb_data = form_data.map((data: any) => {
                const {
                    brgy_name, dsi, type_ofData,
                    ap,
                    sap,
                    pcbp_M,
                    pcbp_E,
                    pcbp_EDVCM,
                    pcbp_EO,
                    pcbp_A,
                    pcbp_CB,
                } = data.survey_data;

                const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();

                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/industrial/update/1/chemical?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        dsi,
                        type_ofData,
                        ap,
                        sap,
                        pcbp_M,
                        pcbp_E,
                        pcbp_EDVCM,
                        pcbp_EO,
                        pcbp_A,
                        pcbp_CB,
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                  return [
                    data.form_id,
                    brgy_name, dsi, type_ofData,
                    ap,
                    sap,
                    pcbp_M,
                    pcbp_E,
                    pcbp_EDVCM,
                    pcbp_EO,
                    pcbp_A,
                    pcbp_CB,
                    dateTime, LinkComponent
                ]

            })
        } else if(indsutryType === "metal"){
            tb_data = form_data.map((data: any) => {
                const {
                    brgy_name, dsi, type_ofData,
                    ispif,
                    ispnif,
                } = data.survey_data;

                const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();

                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/industrial/update/2/metal?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        dsi,
                        type_ofData,
                        ispif,
                        ispnif,
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                  return [
                    data.form_id,
                    brgy_name, dsi, type_ofData,
                    ispif,
                    ispnif,
                    dateTime, LinkComponent
                ]

            })
        } else if (indsutryType === "electronics"){

            tb_data = form_data.map((data: any) => {
                const {
                    brgy_name, dsi, type_ofData,
                    ics,
                    photovoltaics,
                    tft_FPD,
                    htf,
                } = data.survey_data;

                const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();

                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/industrial/update/3/electronics?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        dsi,
                        type_ofData,
                        ics,
                        photovoltaics,
                        tft_FPD,
                        htf,
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                  return [
                    data.form_id,
                    brgy_name, dsi, type_ofData,
                    ics,
                    photovoltaics,
                    tft_FPD,
                    htf,
                    dateTime, LinkComponent
                ]

            })

        } else if (indsutryType === "others"){
            tb_data = form_data.map((data: any) => {
                const {
                    brgy_name, dsi, type_ofData,
                    ppi,
                    other,
                    fbi,
                } = data.survey_data;

                const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();

                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/industrial/update/4/others?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        dsi,
                        type_ofData,
                        ppi,
                        other,
                        fbi,
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                  return [
                    data.form_id,
                    brgy_name, dsi, type_ofData,
                    ppi,
                    other,
                    fbi,
                    dateTime, LinkComponent
                ]

            })
        }




        return tb_data
    }
    

    return (
        <div className="flex flex-col mt-10 gap-5 px-5 lg:px-24 ">
            <div className="text-2xl self-center rounded-lg bg-darkgreen text-white py-2 px-2">Industrial Surveyed List</div>

            <div className="flex bg-blue-gray-100 flex-wrap justify-center p-3 rounded-md shadow-md">
                <div className=" w-full lg:w-52 mx-20">
                    <BrgyMenu setBrgys={setBrgy} municipality_code={municipality_code}/>
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
                    <Radio defaultChecked name="indusry_type" label="Mineral" color ="green" value={"mineral"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
                    <Radio name="indusry_type" label="Chemical" color ="green" value={"chemical"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
                    <Radio name="indusry_type" label="Metal" color ="green" value={"metal"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
                    <Radio name="indusry_type" label="Electronics" color ="green" value={"electronics"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
                    <Radio name="indusry_type" label="Others" color ="green" value={"others"} onChange={(e:any)=>setIndustryType(e.target.value)}/>  
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



export default IndustrialList