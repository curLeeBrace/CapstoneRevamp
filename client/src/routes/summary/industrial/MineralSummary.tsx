import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"
import SimpleCard from "../../../Components/Dashboard/SimpleCard"
import { ArrowRightCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import exportToExcel from "../../../custom-hooks/export_data/exportToExel"



interface MineralSummaryProps {
    year : string
}


type MineralDataTypes = {
    form_id : string;
    email : string,
    municipality_name : string,
    brgy_name : string;
    cpp : number, 
    cpb : number, 
    lp : number, 
    gp : number,
    totalGHGe : number
}


const MineralSummary = ({year} : MineralSummaryProps) => {

    const [tb_head, set_tbHead] = useState<string[]>();
    const [mineralData, setMineraData] = useState<any[]>();
    const [donutState, setDonutState] = useState<DonutState>();


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();


    useEffect(()=>{
        setIsLoading(true);
        set_tbHead(['ID', 'Email', 
            ...(user_info.user_type !== "lu_admin" ? ["Municipality"] : []),
            user_info.user_type === "lu_admin" ? "Institution" : "Brgy",
            'Cement Production - Portland (tons)', 'Lime Production (tons)', 'Cement Production - Portland (blended)', 'Glass Production (tons)', 'GHGe'])
        const {municipality_code, user_type, province_code} = user_info
        
        axiosPrivate.get('/summary-data/industrial/mineral', {
            params : {
                municipality_code,
                user_type,
                prov_code : province_code,
                year,
            }
        })
        .then(res => {
            const mineralData :MineralDataTypes[] = res.data as MineralDataTypes[]

            //For Table 
            setMineraData(
                    mineralData.map((data : MineralDataTypes)=>{
                    const {email,municipality_name, cpb, cpp, lp, gp, totalGHGe, brgy_name, form_id} = data;
                    return [form_id,email,
                        ...(user_info.user_type !== "lu_admin" ? [municipality_name] : []),
                         brgy_name, cpb, cpp, lp, gp, totalGHGe]
                })
            )
            //For Donut Chart
            let mineralTonsContainer = {
                cpp : 0,
                cpb : 0,
                lp : 0,
                gp : 0,
            }

            mineralData.forEach((data : MineralDataTypes) => {
                const {cpb, cpp, lp, gp} = data;
                mineralTonsContainer.cpb += cpb;
                mineralTonsContainer.cpp += cpp;
                mineralTonsContainer.lp += lp;
                mineralTonsContainer.gp += gp;
            })


            const {cpb, cpp, lp, gp} = mineralTonsContainer;
            setDonutState({
                labels : ["Cement Production - Portland (tons)","Cement Production - Portland (blended)","Lime Production (tons)","Glass Production (tons)"],
                series : [cpb, cpp, lp, gp, ]
            })


        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

    },[year])

    const handleExport = () => {
        if (mineralData && tb_head) {
          exportToExcel(mineralData, tb_head, `${user_info.user_type === 's-admin' ? 'Laguna' : user_info.municipality_name} Mineral Surveyed Data`);
        } else {
          alert("No data to export.");
        }
      };

    return(
        <div className="flex flex-col gap-5 border-2 mx-4 rounded-lg my-2 border-gray-300">

        <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen text-white">Mineral Summary</div>
        <div className="flex my-2 ml-8 font-bold items-center border-2 -mb-4 w-48 rounded-md border-gray-300 p-2">
        <button onClick={handleExport} className="flex items-center">
                <ArrowRightCircleIcon className="h-6 mx-2" />
                Export to Excel
            </button>
            </div>
        <div className="w-full flex justify-center mx-8 mb-4">

                <div className="w-2/4 mr-2 mb-2">
                    {
                        mineralData && tb_head ? <Table tb_datas={mineralData} tb_head={tb_head} isLoading = {isLoading}/>
                        :<SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>

                    }
                        
                </div>
                <div className="basis-full border-2 rounded-lg border-gray-300 grid grid-cols-1 justify-center max-h-96 overflow-y-auto mr-10 pb-10 mb-2">

                <div className="my-2 px-2">
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Mineral" chart_meaning={`Overall collected data in ${
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


export default MineralSummary