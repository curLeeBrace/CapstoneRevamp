import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"



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
        set_tbHead(['ID', 'Email', 'Municipality,', 'Brgy', 'Iron and Steel Production from Integrated Facilities (tons)', 'Iron and Steel Production from Non-integrated Facilities (tons)', 'GHGe'])
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
                    return [form_id,email,municipality_name, brgy_name, ispif, ispnif, totalGHGe]
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


    return(
        <div className="flex flex-col gap-5 border-2 mx-4 rounded-lg my-2 border-gray-300">

        <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen text-white">Metal Summary</div>
        
            <div className="w-full flex justify-center mx-8">

            <div className="w-2/4 mb-10 pr-10 ">
                    {
                        metalData && tb_head ? <Table tb_datas={metalData} tb_head={tb_head} isLoading = {isLoading}/>
                        :<div>No Data!</div>
                    }
                        
                </div>
                <div className="basis-full border-2 rounded-lg border-gray-300 grid grid-cols-1 justify-center max-h-96 overflow-y-auto mr-10 pb-10 mb-2">
                
                <div className="my-2">
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Metal Donut Chart" chart_meaning={`${user_info.user_type === "s-admin" ? "Laguna Province" : user_info.user_type === "lgu_admin" ? `${user_info.municipality_name}` : "Brgy."}`}/>
                            :<div>No Data!</div>
                        }
                </div>
                
                </div>
            </div>
        </div>
    )
}


export default MetalSummary