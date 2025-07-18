import useUserInfo from "../../../custom-hooks/useUserType"
import BrgyMenu from "../../../custom-hooks/BrgyMenu";
import Municipality from "../../../custom-hooks/Municipality";
import Table from "../../../Components/Table";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import { useEffect, useState } from "react";
import SimpleCard from "../../../Components/Dashboard/SimpleCard";
import { ArrowRightCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import exportToExcel from "../../../custom-hooks/export_data/exportToExel";




interface AgricultureRawDataProps {
    agricultureType : string
    year : string
}

type CropsDataTypes = {
    form_id : string,
    email : string,
    municipality_name : string,
    brgy_name : string,
    rdsi : number,
    rdsr : number,
    rwsi : number,
    rwsr : number,
    crop_residues : number,
    dol_limestone : number,
    ghge : number,
    dateTime : Date,
}



type LiveStocksDataTypes = {
    form_id : string,
    email : string,
    municipality_name : string,
    brgy_name : string,
    buffalo : number,
    cattle : number,
    goat : number,
    horse : number,
    poultry : number,
    swine : number,
    non_dairyCattle : number,
    ghge : number,
    dateTime : Date
}


const AgricultureRawData = ({agricultureType, year}:AgricultureRawDataProps) => {
    const {user_type, municipality_name, municipality_code} = useUserInfo();
    const [loc, setLoc] = useState<AddressReturnDataType | undefined>(undefined);
    const axiosPrivate = useAxiosPrivate();
    const [tb_head, set_tbHead] = useState<string[]>();
    const [tb_data, set_tbData] = useState<any[][]>();
    const user_info = useUserInfo();

    useEffect(()=>{
        axiosPrivate.get('/summary-data/agriculture/raw-data',{
            params : {
                agricultureType, 
                municipality_name : user_type === "s-admin" ? loc?.address_name : municipality_name, 
                municipality_code : municipality_code,
                brgy_name : user_type === "s-admin" ? undefined : loc?.address_name, 
                user_type, 
                year
            }
        })
        .then(res => {
            console.log("Agriculture Response : ", res.data);
           

            if(agricultureType === "crops"){
                const cropsData : CropsDataTypes[] = res.data as CropsDataTypes[]
                set_tbHead(['ID', 'Email', 
                    ...(user_info.user_type !== "lu_admin" ? ["Municipality"] : []),
                    user_info.user_type === "lu_admin" ? "Institution" : "Brgy",
                    'Rice (Dry Season, Irrigated)', 'Rice (Dry Season, Rainfed)','Rice (Wet Season, Irrigated)','Rice (Wet Season, Rainfed)','Crop Residues (tonnes of dry weight)','Dolomite and/or Limestone Consumption', 'GHGe', 'DateTime'])

                set_tbData(cropsData.map(data => {
                    const {
                        form_id,
                        email,
                        municipality_name,
                        brgy_name,
                        rdsi,
                        rdsr,
                        rwsi,
                        rwsr,
                        crop_residues,
                        dol_limestone,
                        ghge,
                        dateTime 
                    } = data

                    const date = new Date(dateTime).toLocaleDateString();
                    const time = new Date(dateTime).toLocaleTimeString();

                    return [
                        form_id,
                        email,
                        ...(user_info.user_type !== "lu_admin" ? [municipality_name] : []),
                        brgy_name,
                        rdsi,
                        rdsr,
                        rwsi,
                        rwsr,
                        crop_residues,
                        dol_limestone,
                        ghge,
                        date + " : " + time,
                    ]
                }))


            } else {
                const liveStocksData:LiveStocksDataTypes[] = res.data as LiveStocksDataTypes[]
                set_tbHead(['ID', 'Email', 
                    ...(user_info.user_type !== "lu_admin" ? ["Municipality"] : []),
                    user_info.user_type === "lu_admin" ? "Institution" : "Brgy", 
                    'Buffalo', 'Cattle', 'Goat', 'Horse', 'Poultry', 'Swine', 'Non DairyCattle', 'GHGe', 'DateTime'])
                set_tbData(liveStocksData.map((data)=>{
                    const {
                        form_id,
                        email,
                        municipality_name,
                        brgy_name,
                        buffalo,
                        cattle,
                        goat,
                        horse,
                        poultry,
                        swine,
                        non_dairyCattle,
                        ghge,
                        dateTime
                    } = data
                    const date = new Date(dateTime).toLocaleDateString();
                    const time = new Date(dateTime).toLocaleTimeString();
                    return [
                        form_id,
                        email,
                        ...(user_info.user_type !== "lu_admin" ? [municipality_name] : []),
                        brgy_name,
                        buffalo,
                        cattle,
                        goat,
                        horse,
                        poultry,
                        swine,
                        non_dairyCattle,
                        ghge,
                        date + " : " + time,
                    ]
                }))
            }


        })
        .catch(err => console.log(err))
        
    },[agricultureType, year, loc?.address_name])

    const handleExport = () => {
        if (tb_data && tb_head) {
          exportToExcel(tb_data, tb_head, `${user_info.user_type === 's-admin' ? 'Laguna' : user_info.municipality_name} Agriculture Surveyed Data`);
        } else {
          alert("No data to export.");
        }
      };
    
    return(
        <div className="flex flex-col w-full h-full">
            <div>
                {
                    user_type === "s-admin" ?   
                        <Municipality setAddress={setLoc}/>
                    :   <BrgyMenu municipality_code={municipality_code} setBrgys={setLoc} user_info={user_info}/>
                }
            </div>
            <div className="py-4">
            <div className="flex my-2 font-bold items-center border-2 w-48 rounded-md border-gray-300 p-2">
            <button
                onClick={handleExport}
                className="flex items-center text-black"
            >
                <ArrowRightCircleIcon className="h-6 mx-2" />
                Export to Excel
            </button>
            </div>
                {
                    tb_data && tb_head && tb_data.length > 0 ?    <Table tb_datas={tb_data} tb_head={tb_head}/>:
                    <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
                }
                
            </div>
        </div>
    )
}



export default AgricultureRawData