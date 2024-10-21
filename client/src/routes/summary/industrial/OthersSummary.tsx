import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"



interface othersSummaryProps {
    year : string
}


type OthersDataTypes = {
    form_id : string;
    email : string,
    municipality_name : string,
    brgy_name : string;
    ppi : number
    fbi : number
    other : number
    totalGHGe : number
}


const OthersSummary = ({year} : othersSummaryProps) => {

    const [tb_head, set_tbHead] = useState<string[]>();
    const [othersData, setOthersData] = useState<any[]>();
    const [donutState, setDonutState] = useState<DonutState>();


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();


    useEffect(()=>{
        setIsLoading(true);
        set_tbHead(['ID', 'Email', 'Municipality,', 'Brgy', 'Pulp and paper industry (tons)', 'Other carbon in pulp (tons)', 'Food and beverages industry (tons)', 'GHGe'])

        const {municipality_code, user_type, province_code} = user_info
        
        axiosPrivate.get('/summary-data/industrial/others', {
            params : {
                municipality_code,
                user_type,
                prov_code : province_code,
                year,
            }
        })
        .then(res => {
            const othersData :OthersDataTypes[] = res.data as OthersDataTypes[]

            //For Table 
            setOthersData(
                    othersData.map((data : OthersDataTypes)=>{
                    const {email,municipality_name, ppi,
                        fbi,
                        other, totalGHGe, brgy_name, form_id} = data;
                    return [form_id,email,municipality_name, brgy_name, ppi,
                        fbi,
                        other,
                        totalGHGe]
                })
            )
            //For Donut Chart
            let othersTonsContainer = {
                ppi : 0,
                fbi : 0,
                other : 0,
            }

            othersData.forEach((data : OthersDataTypes) => {
                const {ppi,fbi,other,} = data;

                othersTonsContainer.ppi += ppi;
                othersTonsContainer.fbi += fbi;
                othersTonsContainer.other += other

          
            })


            const {ppi,fbi,other,} = othersTonsContainer;
            setDonutState({
                labels : ['Pulp and paper industry (tons)', 'Other carbon in pulp (tons)', 'Food and beverages industry (tons)'],
                series : [ppi,fbi,other,]
            })


        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

    },[year])


    return(
        <div className="flex flex-col gap-5 border-2 mx-4 rounded-lg my-2 border-gray-300">

        <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen text-white">Others Summary</div>
        
        <div className="w-full flex justify-center mx-8">

            <div className="w-2/4 mb-10 pr-10 ">
                    {
                        othersData && tb_head ? <Table tb_datas={othersData} tb_head={tb_head} isLoading = {isLoading}/>
                        :<div>No Data!</div>
                    }
                        
                </div>
                <div className="basis-full border-2 rounded-lg border-gray-300 grid grid-cols-1 justify-center max-h-96 overflow-y-auto mr-10 pb-10 mb-2">

                <div className="my-2">
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Others Donut Chart" chart_meaning={`${user_info.user_type === "s-admin" ? "Laguna Province" : user_info.user_type === "lgu_admin" ? `${user_info.municipality_name}` : "Brgy."}`}/>
                            :<div>No Data!</div>
                        }
                </div>

                
                </div>
            </div>
        </div>
    )
}


export default OthersSummary