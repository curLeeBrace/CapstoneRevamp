import { useEffect, useState } from "react"
import BrgyMenu from "../../../custom-hooks/BrgyMenu"
import useUserInfo from "../../../custom-hooks/useUserType";
import { Radio } from "@material-tailwind/react";
import Table from "../../../Components/Table";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import { Link } from "react-router-dom";
import { useSearchParams, useParams } from "react-router-dom";

const IndustrialList = () => {

    const [brgy, setBrgy] = useState<AddressReturnDataType>();
    const [indsutryType, setIndustryType] = useState<string>();
    const {brgy_name, email, full_name, img_id, municipality_code, municipality_name, province_code, user_type} = useUserInfo();

    const [tb_head, set_tbHead] = useState<string[]>();
    const [tb_data, set_tbData] = useState<any[][]>();


    const axiosPrivate = useAxiosPrivate();

    




    //Setting Table Headers
    useEffect(()=>{

        if(indsutryType === "mineral"){
            set_tbHead([
                "Brgy", "DSI", "Type of Data", 
                "Cement Production - Portland (tons)", 
                "Lime Production (tons)", "Cement Production - Portland (blended)", 
                "Glass Production (tons)", "DateTime", "Action"
            ]);
        } else if(indsutryType === "chemical"){
            set_tbHead(
                [
                    "Brgy", "DSI", "Type of Data", 
                    "Ammonia Production (tons)", "Soda Ash Production (tons)", 
                    "Dichloride and Vinyl Chloride Monomer (tons)", "Methanol (tons)",
                    "Ethylene oxide (tons)", "Carbon black (tons)", "Ethylene (tons)", 
                    "Acrylonitrile (tons)" , "DateTime", "Action"
                ]
            );
        } else if(indsutryType === "metal"){
            set_tbHead(
                [
                    "Brgy", "DSI", "Type of Data", 
                    "Iron and Steel Production from Integrated Facilities (tons)", 
                    "Iron and Steel Production from Non-integrated Facilities (tons)",
                    "DateTime", "Action" 
                ]
            );

        } else if(indsutryType === "electronics"){
            set_tbHead(
                [
                    "Brgy", "DSI", "Type of Data", 
                    "Integrated circuit of semiconductor (tons)", 
                    "Photovoltaics (tons)", "TFT Flat Panel Display (tons)",
                    "Heat transfer fluid (tons)",
                    "DateTime", "Action" 
                ]
            );

        } else if(indsutryType === "others"){


            set_tbHead(
                [
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
                    brgy_name, dsi, type_ofData,
                    cpp, lp, cpb,
                    gp, dateTime,   LinkComponent
                ]

            })
        }




        return tb_data
    }






    return (
        <div className="flex flex-col mt-10 gap-5 px-5 lg:px-24">
            <div className="text-2xl self-center">Industrial Surveyed List</div>

            <div className="flex bg-blue-gray-100 flex-wrap justify-center p-3 rounded-md shadow-md">
                <div className=" w-full lg:w-52">
                    <BrgyMenu setBrgys={setBrgy} municipality_code={municipality_code}/>
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
                    tb_head && tb_data ? <Table tb_datas={tb_data} tb_head={tb_head}/>
                    :<>No Available Data</>
                
                }

                
            </div>
        </div>
    )
}



export default IndustrialList