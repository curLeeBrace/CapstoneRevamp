import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"
import SimpleCard from "../../../Components/Dashboard/SimpleCard"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"



interface ChemicalSummaryProps {
    year : string
}


type MineralDataTypes = {
    form_id : string;
    email : string,
    municipality_name : string,
    brgy_name : string;
    ap : number,
    sap : number,
    pcbp_EDVCM : number,
    pcbp_M : number,
    pcbp_EO : number,
    pcbp_CB : number,
    pcbp_E : number,
    pcbp_A : number,
   

    totalGHGe : number
}


const ChemicalSummary = ({year} : ChemicalSummaryProps) => {

    const [tb_head, set_tbHead] = useState<string[]>();
    const [chemicalData, setChemicalData] = useState<any[]>();
    const [donutState, setDonutState] = useState<DonutState>();


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();


    useEffect(()=>{
        setIsLoading(true);
        set_tbHead(['ID', 'Email', 'Municipality,', 'Brgy', 'Ammonia Production (tons)', 'Soda Ash Production (tons)', 'Dichloride and Vinyl Chloride Monomer (tons)', 'Methanol (tons)', 'Ethylene oxide (tons)', 'Carbon black (tons)', 'Ethylene (tons)', 'Acrylonitrile (tons)', 'GHGe'])
        const {municipality_code, user_type, province_code} = user_info
        
        axiosPrivate.get('/summary-data/industrial/chemical', {
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
            setChemicalData(
                    mineralData.map((data : MineralDataTypes)=>{
                    const {
                        form_id,
                        email,
                        municipality_name,
                        brgy_name,
                        ap,
                        sap,
                        pcbp_EDVCM,
                        pcbp_M,
                        pcbp_EO,
                        pcbp_CB,
                        pcbp_E,
                        pcbp_A,
                        totalGHGe,
                    } = data;
                    return [
                        form_id,email,municipality_name, brgy_name, 
                        ap,
                        sap,
                        pcbp_EDVCM,
                        pcbp_M,
                        pcbp_EO,
                        pcbp_CB,
                        pcbp_E,
                        pcbp_A,
                        totalGHGe]
                })
            )
            //For Donut Chart
            let chemicalTonsContainer = {
                ap : 0,
                sap : 0,
                pcbp_EDVCM : 0,
                pcbp_M : 0,
                pcbp_EO : 0,
                pcbp_CB : 0,
                pcbp_E : 0,
                pcbp_A : 0,
            }

            mineralData.forEach((data : MineralDataTypes) => {
                const {
                    ap,
                    sap,
                    pcbp_EDVCM,
                    pcbp_M,
                    pcbp_EO,
                    pcbp_CB,
                    pcbp_E,
                    pcbp_A,
                } = data;
                chemicalTonsContainer.ap += ap;
                chemicalTonsContainer.sap += sap;
                chemicalTonsContainer.pcbp_EDVCM += pcbp_EDVCM;
                chemicalTonsContainer.pcbp_M += pcbp_M;
                chemicalTonsContainer.pcbp_EO += pcbp_EO
                chemicalTonsContainer.pcbp_CB += pcbp_CB
                chemicalTonsContainer.pcbp_E += pcbp_E
                chemicalTonsContainer.pcbp_A += pcbp_A
            })


            const {
                ap,
                sap,
                pcbp_EDVCM,
                pcbp_M,
                pcbp_EO,
                pcbp_CB,
                pcbp_E,
                pcbp_A,
            } = chemicalTonsContainer;
            setDonutState({
                labels : [
                    "Ammonia Production (tons)",
                    "Soda Ash Production (tons)",
                    "Dichloride and Vinyl Chloride Monomer (tons)",
                    "Methanol (tons)",
                    "Ethylene oxide (tons)",
                    "Carbon black (tons)",
                    "Ethylene (tons)",
                    "Acrylonitrile (tons)"
                ],

                series : [
                    ap,
                    sap,
                    pcbp_EDVCM,
                    pcbp_M,
                    pcbp_EO,
                    pcbp_CB,
                    pcbp_E,
                    pcbp_A,
                ]
            })


        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

    },[year])


    return(
        <div className="flex flex-col gap-5 border-2 mx-4 rounded-lg my-2 border-gray-300">

            <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen text-white">Chemical Summary</div>
        
            <div className="w-full flex justify-center mx-8 mb-4">

            <div className="w-2/4 mr-2 mb-2">
                    {
                        chemicalData && tb_head ? <Table tb_datas={chemicalData} tb_head={tb_head} isLoading = {isLoading}/>
                        : 
                        <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
                    }
                        
                </div>
                <div className="basis-full border-2 rounded-lg border-gray-300 grid grid-cols-1 justify-center max-h-96 overflow-y-auto mr-10 pb-10 mb-2">

                <div className="my-2 px-2">
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Chemical" chart_meaning={`Overall collected data in ${user_info.user_type === "s-admin" ? "Laguna Province." : user_info.user_type === "lgu_admin" ? `${user_info.municipality_name}.` : "Brgy."}`}/>
                                :
                                   <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>

                        }
                    </div>

                </div>
            </div>
        </div>
    )
}


export default ChemicalSummary