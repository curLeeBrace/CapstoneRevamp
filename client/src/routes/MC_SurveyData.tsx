import { useEffect, useState } from "react";
import Table from "../Components/Table";
import Skeleton from "../Components/Skeleton";
import useAxiosPrivate from "../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../custom-hooks/useUserType";



type MC_SurveyDataProps = {
    form_type : string | undefined;
    muni_code : string | undefined;
    prov_code : string | undefined;
    brgy_code :string | undefined;
    selectAll : boolean;
    selectedYear? : string | undefined;


}




const MC_SurveyData = ({form_type, muni_code, prov_code, brgy_code, selectAll, selectedYear} : MC_SurveyDataProps) => {
    const axiosPrivate = useAxiosPrivate();
    const column = ['Surveyor','Vehicle Type', 'Vehicle Age', 'Fuel Type', 'Fuel Consumption', 'GHGe', 'DateTime'];
    const [mc_datas, set_mcDatas] = useState<any[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userInfo = useUserInfo();








    useEffect(()=>{

        if(form_type && muni_code){
            setIsLoading(true);
            axiosPrivate.get(`/summary-data/mc-surveyData`, {params : {
                province_code : prov_code,
                municipality_code : muni_code,
                form_type : form_type,
                brgy_code : brgy_code,
                selectAll : selectAll,
                user_type : userInfo.user_type,
                selectedYear : selectedYear
            }})
            .then(res => {
                console.log("eyy", res.data)
                const res_mcData = res.data;
    
                set_mcDatas(res_mcData.map(((mc_data : any) => {
                    const  {surveyor, v_type, v_age, f_type, f_consumption, dateTime, ghge} = mc_data;
                    const date = new Date(dateTime).toLocaleDateString()
                    const time = new Date(dateTime).toLocaleTimeString()
                    return [surveyor, v_type, v_age, f_type, f_consumption, ghge.toFixed(3), date +" : " + time]
                })))
                    
    
            })
            .catch(err => console.log(err))
            .finally(()=>setIsLoading(false));
            
        }


    },[form_type,muni_code, brgy_code, selectAll, prov_code, selectedYear])


    return (
        <div className="h-full">
            {
                isLoading ? 
                    <Skeleton/>
                :   mc_datas && 
                mc_datas.length > 0 ? 
                    <Table tb_datas={mc_datas} tb_head={column}/>
                :<div className="h-full flex justify-center items-center">No data found</div>

             
            }
          
        </div>
    )

}

export default MC_SurveyData