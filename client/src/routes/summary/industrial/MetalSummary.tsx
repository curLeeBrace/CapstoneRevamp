import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"
import { ArrowRightCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import SimpleCard from "../../../Components/Dashboard/SimpleCard"
import exportToExcel from "../../../custom-hooks/export_data/exportToExel"



interface MetalSummaryProps {
    year : string
}


type MetalDataTypes = {
    form_id : string;
    email : string,
    municipality_name : string,
    brgy_name : string;
    ispif : number,
    ispnif : number,
    totalGHGe : number
}


const MetalSummary = ({year} : MetalSummaryProps) => {

    const [tb_head, set_tbHead] = useState<string[]>();
    const [metalData, setMetalData] = useState<any[]>();
    const [donutState, setDonutState] = useState<DonutState>();


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();


    useEffect(()=>{
        setIsLoading(true);
        set_tbHead(['ID', 'Email',
            ...(user_info.user_type !== "lu_admin" ? ["Municipality"] : []),
            user_info.user_type === "lu_admin" ? "Institution" : "Brgy",
              'Iron and Steel Production from Integrated Facilities (tons)', 'Iron and Steel Production from Non-integrated Facilities (tons)', 'GHGe'])
        const {municipality_code, user_type, province_code} = user_info
        
        axiosPrivate.get('/summary-data/industrial/metal', {
            params : {
                municipality_code,
                user_type,
                prov_code : province_code,
                year,
            }
        })
        .then(res => {
            const metalData :MetalDataTypes[] = res.data as MetalDataTypes[]

            //For Table 
            setMetalData(
                    metalData.map((data : MetalDataTypes)=>{
                    const {email,municipality_name, ispif, ispnif, totalGHGe, brgy_name, form_id} = data;
                    return [form_id,
                        email,
                        ...(user_info.user_type !== "lu_admin" ? [municipality_name] : []),
                        brgy_name, 
                         ispif, ispnif, totalGHGe]
                })
            )
            //For Donut Chart
            let metalTonsContainer = {
                ispif : 0, 
                ispnif : 0,
            }

            metalData.forEach((data : MetalDataTypes) => {
                const {ispif, ispnif} = data;
                metalTonsContainer.ispif += ispif;
                metalTonsContainer.ispnif += ispnif;
          
            })


            const {ispif, ispnif} = metalTonsContainer;
            setDonutState({
                labels : ["Iron and Steel from Integrated Facilities (tons)","Iron and Steel from Non-integrated Facilities (tons)"],
                series : [ispif, ispnif]
            })


        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

    },[year])


    const handleExport = () => {
        if (metalData && tb_head) {
          exportToExcel(metalData, tb_head, `${user_info.user_type === 's-admin' ? 'Laguna' : user_info.municipality_name} Metal Surveyed Data`);
        } else {
          alert("No data to export.");
        }
      };

    return(
        <div className="flex flex-col gap-5 border-2 mx-4 rounded-lg my-2 border-gray-300">

        <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen text-white">Metal Summary</div>
        <div className="flex my-2 ml-8 font-bold items-center border-2 -mb-4 w-48 rounded-md border-gray-300 p-2">
        <button onClick={handleExport} className="flex items-center">
                <ArrowRightCircleIcon className="h-6 mx-2" />
                Export to Excel
            </button>
            </div>
        <div className="w-full flex justify-center mx-8 mb-4">

                <div className="w-2/4 mr-2 mb-2">
                    {
                        metalData && tb_head ? <Table tb_datas={metalData} tb_head={tb_head} isLoading = {isLoading}/>
                        :<SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>

                    }
                        
                </div>
                <div className="basis-full border-2 rounded-lg border-gray-300 grid grid-cols-1 justify-center max-h-96 overflow-y-auto mr-10 pb-10 mb-2">
                
                <div className="my-2 px-2">
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Metal" chart_meaning={`Overall collected data in ${
                                    user_info.user_type === "s-admin"
                                      ? "Laguna Province"
                                      : user_info.user_type === "lgu_admin" || user_info.user_type === "lu_admin"
                                      ? user_info.municipality_name
                                      : "Brgy."
                                  }`}
                                  />
                                :<SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
                            }
                </div>
                
                </div>
            </div>
        </div>
    )
}


export default MetalSummary