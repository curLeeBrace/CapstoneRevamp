import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"



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
        set_tbHead(['ID', 'Email', 'Municipality,', 'Brgy', 'Cement Production - Portland (tons)', 'Lime Production (tons)', 'Cement Production - Portland (blended)', 'Glass Production (tons)', 'GHGe'])
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
                    return [form_id,email,municipality_name, brgy_name, cpb, cpp, lp, gp, totalGHGe]
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


    return(
        <div className="flex flex-col gap-5">

            <div className="mx-24 text-3xl">Mineral Summary</div>
        
            <div className="w-full flex justify-center mx-8">

                <div className="w-3/5">
                    {
                        mineralData && tb_head ? <Table tb_datas={mineralData} tb_head={tb_head} isLoading = {isLoading}/>
                        :<div>No Data!</div>
                    }
                        
                </div>
                <div className="w-4/12 flex flex-col justify-center">
                
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Mineral Donut Chart"/>
                            :<div>No Data!</div>
                        }

                </div>
            </div>
        </div>
    )
}


export default MineralSummary