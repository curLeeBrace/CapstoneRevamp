import { Radio } from "@material-tailwind/react"
import BrgyMenu from "../../../custom-hooks/BrgyMenu"
import { useEffect, useState } from "react";
import useUserInfo from "../../../custom-hooks/useUserType";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import Table from "../../../Components/Table";
import { Link } from "react-router-dom";

const AgricultureList = () => {

    const [brgy, setBrgy] = useState<AddressReturnDataType>();
    const [agricultureType, setAgricultureType] = useState<string>("crops");
    const { municipality_code} = useUserInfo();

    const [tb_head, set_tbHead] = useState<string[]>();
    const [tb_data, set_tbData] = useState<any[][]>();
    const axiosPrivate = useAxiosPrivate();


    useEffect(()=>{
        
        if(agricultureType === "crops"){
            set_tbHead(["ID", "BRGY", "Dry Season, Irrigated (Has)", "Dry Season, Rainfed (Has)", "Wet Season, Irrigated (Has)", "Wet Season, Rainfed (Has)", "Crops Residue (Tons)", "Dolomite and/or Limestone Consumption (Kg)","DateTime","Action"])
        } else {
            set_tbHead(["ID", "BRGY", "Buffalo (Heads)", "Dairy Cattle (Heads)", "Goat (Heads)", "Horse (Heads)", "Non-Dairy Cattle (Heads)", "Poultry (Heads)", "Swine (Heads)","DateTime","Action"])
        }

    },[agricultureType])



    useEffect(()=>{



        axiosPrivate.get(`/forms/agriculture-${agricultureType}/surveyed-data`, {params : {
            municipality_code : municipality_code,
            brgy_code : brgy?.address_code,
            surveyType : null
        }})
        .then(res => {
            const form_data = res.data;
            // console.log("Indstrial Data : ", form_data);

            const preparedData = prepare_tbData(agricultureType as string, form_data);


            set_tbData(preparedData);

        })
        .catch((err)=> console.log("SURVEY LIST : ", err))


    },[brgy, agricultureType])




    const prepare_tbData = (agricultureType: string, form_data: any[]) : any[][] => {
        let tb_data: any[] = [];

        if(agricultureType === "crops"){

            tb_data = form_data.map((data: any) => {
                const form_id = data.form_id;
                const brgy_name = data.survey_data.brgy_name
                const {
                    rdsi,
                    rdsr,
                    rwsi,
                    rwsr,
                    crop_residues,
                    dol_limestone,
                } = data.survey_data.crops
                const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();

                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/agriculture/update/0/crops?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        rdsi,
                        rdsr,
                        rwsi,
                        rwsr,
                        crop_residues,
                        dol_limestone,
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                return [
                    form_id, 
                    brgy_name,
                    rdsi,
                    rdsr,
                    rwsi,
                    rwsr,
                    crop_residues,
                    dol_limestone,
                    dateTime,
                    LinkComponent
                ]

            })

        } else {

            tb_data = form_data.map((data: any) => {
                const form_id = data.form_id;
                const brgy_name = data.survey_data.brgy_name
                const {
                    buffalo,
                    cattle,
                    goat,
                    horse,
                    poultry,
                    swine,
                    non_dairyCattle,
                } = data.survey_data.live_stock
                const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();

                const LinkComponent = (
                    <Link
                      to={`/surveyor/forms/agriculture/update/1/livestocks?form_id=${data.form_id}`}
                      state={{
                        brgy_name,
                        buffalo,
                        cattle,
                        goat,
                        horse,
                        poultry,
                        swine,
                        non_dairyCattle,
                      }}
                    >
                      <div className="text-green-700">Update</div>
                    </Link>
                  );


                return [
                    form_id, 
                    brgy_name,
                    buffalo,
                    cattle,
                    goat,
                    horse,
                    poultry,
                    swine,
                    non_dairyCattle,
                    dateTime,
                    LinkComponent
                ]

            })
        }
    
    
        return tb_data
    }




    return (
        <div className="flex flex-col mt-10 gap-5 px-5 lg:px-24">
            <div className="text-2xl self-center rounded-lg bg-darkgreen text-white py-2 px-2">Agriculture Surveyed List</div>

            <div className="flex bg-blue-gray-100 flex-wrap justify-center p-3 rounded-md shadow-md">
                <div className=" w-full lg:w-52">
                    <BrgyMenu setBrgys={setBrgy} municipality_code={municipality_code}/>
                </div>
                <div className="flex  w-full gap-4 lg:w-1/2 flex-wrap">
                {/* <Radio defaultChecked name="indusry_type" label="All" color ="green" value={"all"} onChange={(e:any)=>setIndustryType(e.target.value)}/> */}
                    <Radio defaultChecked name="agriculture_type" label="Crops" color ="green" value={"crops"} onChange={(e:any)=>setAgricultureType(e.target.value)}/>
                    <Radio name="agriculture_type" label="LiveStocks" color ="green" value={"livestocks"} onChange={(e:any)=>setAgricultureType(e.target.value)}/>
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


export default AgricultureList
