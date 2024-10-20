import Table from "../../../Components/Table"
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate"
import useUserInfo from "../../../custom-hooks/useUserType"



interface ElectronicsSummaryProps {
    year : string
}


type ElectronicsDataTypes = {
    form_id : string;
    email : string,
    municipality_name : string,
    brgy_name : string;
    ics : number,
    tft_FPD : number,
    photovoltaics : number,
    htf : number,
    totalGHGe : number
}


const ElectronicsSummary = ({year} : ElectronicsSummaryProps) => {

    const [tb_head, set_tbHead] = useState<string[]>();
    const [electronicsData, setElectronicsData] = useState<any[]>();
    const [donutState, setDonutState] = useState<DonutState>();


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();


    useEffect(()=>{
        setIsLoading(true);
        set_tbHead(['ID', 'Email', 'Municipality,', 'Brgy', 'Integrated circuit of semiconductor (tons)', 'Photovoltaics (tons)', 'TFT Flat Panel Display (tons)', 'Heat transfer fluid (tons)', 'GHGe'])
        const {municipality_code, user_type, province_code} = user_info
        
        axiosPrivate.get('/summary-data/industrial/electronics', {
            params : {
                municipality_code,
                user_type,
                prov_code : province_code,
                year,
            }
        })
        .then(res => {
            const electronicsData :ElectronicsDataTypes[] = res.data as ElectronicsDataTypes[]

            //For Table 
            setElectronicsData(
                    electronicsData.map((data : ElectronicsDataTypes)=>{
                    const {email,municipality_name, ics,
                        tft_FPD,
                        photovoltaics,
                        htf,
                        totalGHGe, brgy_name, form_id} = data;
                    return [form_id,email,municipality_name, brgy_name, 
                        ics,
                        tft_FPD,
                        photovoltaics,
                        htf,
                        totalGHGe]
                })
            )
            //For Donut Chart
            let electronicsTonsContainer = {
                ics : 0,
                tft_FPD : 0,
                photovoltaics : 0,
                htf : 0,
            }

            electronicsData.forEach((data : ElectronicsDataTypes) => {
                const {
                    ics,
                    tft_FPD,
                    photovoltaics,
                    htf,
                } = data;
                electronicsTonsContainer.ics += ics;
                electronicsTonsContainer.tft_FPD += tft_FPD;
                electronicsTonsContainer.photovoltaics += photovoltaics;
                electronicsTonsContainer.htf += htf;

          
            })


            const {
                ics,
                tft_FPD,
                photovoltaics,
                htf,
            } = electronicsTonsContainer;
            setDonutState({
                labels : ['Integrated circuit of semiconductor (tons)', 'Photovoltaics (tons)', 'TFT Flat Panel Display (tons)', 'Heat transfer fluid (tons)'],
                series : [
                    ics,
                    tft_FPD,
                    photovoltaics,
                    htf,
                ]
            })


        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

    },[year])


    return(
        <div className="flex flex-col gap-5">

            <div className="mx-24 text-3xl">Electronics Summary</div>
        
            <div className="w-full flex justify-center mx-8">

                <div className="w-3/5">
                    {
                        electronicsData && tb_head ? <Table tb_datas={electronicsData} tb_head={tb_head} isLoading = {isLoading}/>
                        :<div>No Data!</div>
                    }
                        
                </div>
                <div className="w-4/12 flex flex-col justify-center">
                
                        {
                            donutState ?
                                <DonutChart labels={donutState.labels} series={donutState.series} title="Electronics Donut Chart"/>
                            :<div>No Data!</div>
                        }

                </div>
            </div>
        </div>
    )
}


export default ElectronicsSummary