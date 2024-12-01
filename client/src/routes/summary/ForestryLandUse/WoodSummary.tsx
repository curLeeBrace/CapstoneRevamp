import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"
import SimpleCard from "../../../Components/Dashboard/SimpleCard"
import { ArrowRightCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import exportToExcel from "../../../custom-hooks/export_data/exportToExel"



interface WoodSummaryProps {
    year : string
}


type WoodDataTypes = {
    form_id : string;
    email : string,
    municipality_name : string,
    brgy_name : string;
    fuelwood : number,
    charcoal : number,
    construction : number,
    novelties : number,
    totalGHGe : number
}


const WoodSummary = ({year} : WoodSummaryProps) => {

    const [tb_head, set_tbHead] = useState<string[]>();
    const [woodData, setWoodData] = useState<any[]>();
    const [donutState, setDonutState] = useState<DonutState>();


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();


    useEffect(()=>{
        setIsLoading(true);
        set_tbHead(['ID', 'Email',
            ...(user_info.user_type !== "lu_admin" ? ["Municipality"] : []),
            user_info.user_type === "lu_admin" ? "Institution" : "Brgy",
             'Fuelwood (tons)', 'Charcoal (unitless)', 'Construction (tons)', 'Novelties (tons)', 'GHGe'])
        const {municipality_code, user_type, province_code} = user_info
        
        axiosPrivate.get('/summary-data/forest-land-use/falu-wood', {
            params : {
                municipality_code,
                user_type,
                prov_code : province_code,
                year,
            }
        })
        .then(res => {
            const woodData :WoodDataTypes[] = res.data as WoodDataTypes[]

            //For Table 
            setWoodData(
                woodData.map((data : WoodDataTypes)=>{
                    const {
                        form_id,
                        email,
                        municipality_name,
                        brgy_name,
                        fuelwood,
                        charcoal,
                        construction,
                        novelties,
                        totalGHGe,
                    } = data;
                    return [
                        form_id.slice(-3),
                        email,
                        ...(user_info.user_type !== "lu_admin" ? [municipality_name] : []),
                        brgy_name, 
                        fuelwood,
                        charcoal,
                        construction,
                        novelties,
                        totalGHGe]
                })
            )
            //For Donut Chart
            let woodContainer = {
                fuelwood : 0,
                charcoal : 0,
                construction : 0,
                novelties : 0,
            }

            woodData.forEach((data : WoodDataTypes) => {
                const {
                    fuelwood,
                    charcoal,
                    construction,
                    novelties,
                } = data;
                woodContainer.fuelwood += fuelwood;
                woodContainer.charcoal += charcoal;
                woodContainer.construction += construction;
                woodContainer.novelties += novelties;
            })


            const {
                fuelwood,
                charcoal,
                construction,
                novelties,
            } = woodContainer;
            setDonutState({
                labels : [
                    "Fuelwood (tons)",
                    "Charcoal (unitless)",
                    "Construction (tons)",
                    "Novelties (tons)",
                ],

                series : [
                    fuelwood,
                    charcoal,
                    construction,
                    novelties,
                ]
            })


        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

    },[year])

    const handleExport = () => {
        if (woodData && woodData.length > 0 && tb_head) {
            exportToExcel(woodData, tb_head, `${user_info.user_type === 's-admin' ? 'Laguna' : user_info.municipality_name} Forestlands Surveyed Data`);
        } else {
            alert("No data to export.");
        }
    };
    

    return(
        <div className="flex flex-col gap-5 border-2 mx-4 rounded-lg my-2 border-gray-300">

            <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen text-white">Woods and Wood Products Harvesting Summary</div>
            <div className="ml-8 font-bold border-2 w-48 -mb-4 rounded-md border-gray-300 p-2">
            <button onClick={handleExport} className="flex items-center">
                <ArrowRightCircleIcon className="h-6 mx-2" />
                Export to Excel
            </button>
            </div>
            <div className="w-full flex justify-center mx-8 mb-4">

            <div className="w-2/4 mr-2 mb-2">
                    {
                        woodData && tb_head ? <Table tb_datas={woodData} tb_head={tb_head} isLoading = {isLoading}/>
                        : 
                        <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
                    }
                        
                </div>
                <div className="basis-full border-2 rounded-lg border-gray-300 grid grid-cols-1 justify-center max-h-96 overflow-y-auto mr-10 pb-10 mb-2">

                <div className="my-2 px-2">
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Woods and Wood Products Harvesting Summary" chart_meaning={`Overall collected data in ${
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


export default WoodSummary