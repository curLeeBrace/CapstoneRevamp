import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"
import SimpleCard from "../../../Components/Dashboard/SimpleCard"
import { ArrowRightCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import exportToExcel from "../../../custom-hooks/export_data/exportToExel"



interface ForestlandsSummaryProps {
    year : string
}


type ForestlandsDataTypes = {
    form_id : string;
    email : string,
    municipality_name : string,
    brgy_name : string;
    ufA : number,
    uaG : number,
    laBA : number,
    totalGHGe : number
}


const ForestLandsSummary = ({year} : ForestlandsSummaryProps) => {

    const [tb_head, set_tbHead] = useState<string[]>();
    const [forestLandsData, setforestLandsData] = useState<any[]>();
    const [donutState, setDonutState] = useState<DonutState>();


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();


    useEffect(()=>{
        setIsLoading(true);
        set_tbHead(['ID', 'Email', 
            ...(user_info.user_type !== "lu_admin" ? ["Municipality"] : []),
            user_info.user_type === "lu_admin" ? "Institution" : "Brgy",
             'Used For Agriculture (hectare)', 'Used as Grasslands (hectare)', 'Left as Barren Areas (hectare)', 'GHGe'])
        const {municipality_code, user_type, province_code} = user_info
        
        axiosPrivate.get('/summary-data/forest-land-use/falu-forestland', {
            params : {
                municipality_code,
                user_type,
                prov_code : province_code,
                year,
            }
        })
        .then(res => {
            const forestLandsData :ForestlandsDataTypes[] = res.data as ForestlandsDataTypes[]

            //For Table 
            setforestLandsData(
                forestLandsData.map((data : ForestlandsDataTypes)=>{
                    const {
                        form_id,
                        email,
                        municipality_name,
                        brgy_name,
                        ufA,
                        uaG,
                        laBA,
                        totalGHGe,
                    } = data;
                    return [
                        form_id,
                        email,
                        ...(user_info.user_type !== "lu_admin" ? [municipality_name] : []),
                        brgy_name, 
                        ufA,
                        uaG,
                        laBA,
                        totalGHGe]
                })
            )
            //For Donut Chart
            let forestsLandContainer = {
                ufA : 0,
                uaG : 0,
                laBA : 0,
            }

            forestLandsData.forEach((data : ForestlandsDataTypes) => {
                const {
                    ufA,
                    uaG,
                    laBA,
                } = data;
                forestsLandContainer.ufA += ufA;
                forestsLandContainer.uaG += uaG;
                forestsLandContainer.laBA += laBA;
            })


            const {
                ufA,
                uaG,
                laBA,
            } = forestsLandContainer;
            setDonutState({
                labels : [
                    "Used For Agriculture (hectare)",
                    "Used as Grasslands (hectare)",
                    "Left as Barren Areas (hectare)",
                ],

                series : [
                    ufA,
                    uaG,
                    laBA,
                ]
            })


        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

    },[year])




    const handleExport = () => {
        if (forestLandsData && tb_head) {
          exportToExcel(forestLandsData, tb_head, `${user_info.user_type === 's-admin' ? 'Laguna' : user_info.municipality_name} Forestlands Surveyed Data`);
        } else {
          alert("No data to export.");
        }
      };

    return(
        <div className="flex flex-col gap-5 border-2 mx-4 rounded-lg my-2 border-gray-300">

            <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen text-white">Changes in the Use of the Forestlands Summary</div>
            <div className="ml-8 font-bold border-2 w-48 -mb-4 rounded-md border-gray-300 p-2">
            <button onClick={handleExport} className="flex items-center">
                <ArrowRightCircleIcon className="h-6 mx-2" />
                Export to Excel
            </button>
            </div>
        
            <div className="w-full flex justify-center mx-8 mb-4">

            <div className="w-2/4 mr-2 mb-2">
                    {
                        forestLandsData && tb_head ? <Table tb_datas={forestLandsData} tb_head={tb_head} isLoading = {isLoading}/>
                        : 
                        <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
                    }
                        
                </div>
                <div className="basis-full border-2 rounded-lg border-gray-300 grid grid-cols-1 justify-center max-h-96 overflow-y-auto mr-10 pb-10 mb-2">

                <div className="my-2 px-2">
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Changes in the Use of the Forestlands" chart_meaning={`Overall collected data in ${
                                    user_info.user_type === "s-admin"
                                      ? "Laguna Province"
                                      : user_info.user_type === "lgu_admin" || user_info.user_type === "lu_admin"
                                      ? user_info.municipality_name
                                      : "Brgy."
                                  }`}
                                  />
                                :
                                   <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>

                        }
                    </div>

                </div>
            </div>
        </div>
    )
}


export default ForestLandsSummary