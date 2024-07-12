import { useEffect, useState } from "react";
import Table from "../Components/Table";
import axios from "../api/axios";




type MC_SurveyDataProps = {
    form_type : string | undefined;
    muni_code : string | undefined;
    prov_code : string | undefined;
}




const MC_SurveyData = ({form_type, muni_code, prov_code} : MC_SurveyDataProps) => {

    const column = ['Surveyor','Vehicle Type', 'Vehicle Age', 'Fuel Type', 'Fuel Consumption', 'DateTime'];

    const [mc_datas, set_mcDatas] = useState<any[]>();








    useEffect(()=>{
        axios.get(`/summary-data/mc-surveyData/${prov_code}/${muni_code}/${form_type}`)
        .then(res => {
            console.log("eyy", res.data)
            const res_mcData = res.data;

            set_mcDatas(res_mcData.map(((mc_data : any) => {
                const  {surveyor, v_type, v_age, f_type, f_consumption, dateTime} = mc_data;
                const date = new Date(dateTime).toLocaleDateString()
                const time = new Date(dateTime).toLocaleTimeString()
                return [surveyor, v_type, v_age, f_type, f_consumption, date +" : " + time]
            })))
                

        })
        .catch(err => console.log(err));


    },[form_type,muni_code])


    console.log(mc_datas);
    return (
        <div className="">
            {
                mc_datas && <Table tb_datas={mc_datas} tb_head={column}/>
            }
          
        </div>
    )

}

export default MC_SurveyData