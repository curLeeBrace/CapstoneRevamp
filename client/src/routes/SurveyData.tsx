import { useEffect, useState } from "react";
import Table from "../Components/Table";
import Skeleton from "../Components/Skeleton";
import useAxiosPrivate from "../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../custom-hooks/useUserType";



type SurveyDataProps = {
    form_type : string | undefined;
    muni_code : string | undefined;
    prov_code : string | undefined;
    brgy_code :string | undefined;
    selectAll : boolean;
    selectedYear? : string | undefined;
    survey_category? : string;


}
/////////////////////////////////////////////////////////
interface PopulationUsingTheSystems {
    septic_tanks : number
    openPits_latrines : {
        cat1 : number;
        cat2 : number;
        cat3 : number;
        cat4 : number;
    }
    riverDischarge : {
        cat1 : number;
        cat2 : number;
    }
}


interface WasteWaterDataPerSurvey{
    populationUsingTheSystems : PopulationUsingTheSystems;
    wasteWaterGHGe : number;
    surveyor : string;
    dateTime: Date
}




const SurveyData = ({form_type, muni_code, prov_code, brgy_code, selectAll, selectedYear, survey_category} : SurveyDataProps) => {
    const axiosPrivate = useAxiosPrivate();
    const [mc_datas, set_mcDatas] = useState<any[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userInfo = useUserInfo();


    const column = survey_category === "mobile-combustion" ?
            ['Surveyor','Vehicle Type', 'Vehicle Age', 'Fuel Type', 'Fuel Consumption', 'GHGe', 'DateTime'] :
            [
                'Surveyor', 
                'Septic Tanks', 
                '(OpenPits_Latrines) dry climate, ground water table lower than latrine, small family (2-5 people)',
                '(OpenPits_Latrines) dry climate, ground water table lower than latrine, communal',
                '(OpenPits_Latrines) wet climate/flush water use, ground water table than latrine',
                '(OpenPits_Latrines) regular sediment removal for fertilizer',
                '(River Discharge) stagnant oxigen deficientrivers and lakes',
                '(River Discharge) rivers, lakes and estuaries',
                'GHGe',
                'DateTime'
            ]


    useEffect(()=>{

        if(form_type && muni_code){
            setIsLoading(true);
            axiosPrivate.get(`/summary-data/dashboard/${survey_category}`, {params : {
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
                const surveyData = res.data;
                console.log("survey_category : ", survey_category)
                if(survey_category === "mobile-combustion") {
                    set_mcDatas(surveyData.map(((mc_data : any) => {
                        const  {surveyor, v_type, v_age, f_type, f_consumption, dateTime, ghge} = mc_data;
                        const date = new Date(dateTime).toLocaleDateString()
                        const time = new Date(dateTime).toLocaleTimeString()
                        return [surveyor, v_type, v_age, f_type, f_consumption, ghge.toFixed(3), date +" : " + time]
                    })))

                } else if(survey_category === "waste-water"){

                    set_mcDatas(surveyData.map(((surveyData : any) => {
                        const  {populationUsingTheSystems, wasteWaterGHGe, dateTime, surveyor} = surveyData as WasteWaterDataPerSurvey;
                        const {openPits_latrines, riverDischarge, septic_tanks} = populationUsingTheSystems;

                        const date = new Date(dateTime).toLocaleDateString()
                        const time = new Date(dateTime).toLocaleTimeString()
                        const dTime = date +" : " + time;
                        return [
                            surveyor, 
                            septic_tanks,
                            openPits_latrines.cat1, 
                            openPits_latrines.cat2, 
                            openPits_latrines.cat3, 
                            openPits_latrines.cat4, 
                            riverDischarge.cat1,
                            riverDischarge.cat2,
                            wasteWaterGHGe.toFixed(2),
                            dTime

                        ]
                    })))
                }
                    
    
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

export default SurveyData