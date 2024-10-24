import React, { useEffect, useState } from "react";
import Table from "../Components/Table";
import Skeleton from "../Components/Skeleton";
import useAxiosPrivate from "../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../custom-hooks/useUserType";
import useSelectAllData from "../custom-hooks/useSelectAllData";
import SimpleCard from "../Components/Dashboard/SimpleCard";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";


type SurveyDataProps = {
  form_type: string | undefined;
  muni_code: string | undefined;
  prov_code: string | undefined;
  brgy_code: string | undefined;
  selectedYear?: string | undefined;
  survey_category?: string;
  totalGHGeSetState? : React.Dispatch<React.SetStateAction<number>>
};
/////////////////////////////////////////////////////////
interface PopulationUsingTheSystems {
  septic_tanks: number;
  openPits_latrines: {
    cat1: number;
    cat2: number;
    cat3: number;
    cat4: number;
  };
  riverDischarge: {
    cat1: number;
    cat2: number;
  };
}

interface WasteWaterDataPerSurvey {
  populationUsingTheSystems: PopulationUsingTheSystems;
  wasteWaterGHGe: number;
  surveyor: string;
  dateTime: Date;
}

const SurveyData = ({
  form_type,
  muni_code,
  prov_code,
  brgy_code,
  selectedYear,
  survey_category,
  totalGHGeSetState,

}: SurveyDataProps) => {



  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState<any[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userInfo = useUserInfo();
  const selectAll = useSelectAllData;

  console.log("BRGY CODE : ", brgy_code);

  const column =
    survey_category === "mobile-combustion"
      ? [
          "Surveyor",
          "Vehicle Type",
          "Vehicle Age",
          "Fuel Type",
          "Fuel Consumption",
          "GHGe",
          "DateTime",
        ]
      : [
          "Surveyor",
          "Septic Tanks",
          "(OpenPits_Latrines) dry climate, ground water table lower than latrine, small family (2-5 people)",
          "(OpenPits_Latrines) dry climate, ground water table lower than latrine, communal",
          "(OpenPits_Latrines) wet climate/flush water use, ground water table than latrine",
          "(OpenPits_Latrines) regular sediment removal for fertilizer",
          "(River Discharge) stagnant oxigen deficientrivers and lakes",
          "(River Discharge) rivers, lakes and estuaries",
          "GHGe",
          "DateTime",
        ];

  useEffect(() => {
    if (form_type) {
      setIsLoading(true);
    
      const selectAllData = selectAll(muni_code, brgy_code);

      console.log("SELECT ALL : ", selectAllData)
      axiosPrivate
        .get(`/summary-data/dashboard/${survey_category}`, {
          params: {
            province_code: prov_code,
            municipality_code: muni_code,
            form_type: form_type,
            brgy_code: brgy_code,
            selectAll : selectAllData,
            user_type: userInfo.user_type,
            selectedYear: selectedYear,
          },
        })
        .then((res) => {

          // console.log("eyy", res.data);
          const surveyData = res.data;
          console.log("survey_category : ", survey_category);
          if (survey_category === "mobile-combustion") {

              setData(
                surveyData.map((mc_data: any) => {
                  const {
                    surveyor,
                    v_type,
                    v_age,
                    f_type,
                    f_consumption,
                    dateTime,
                    ghge,
                  } = mc_data;
                  const date = new Date(dateTime).toLocaleDateString();
                  const time = new Date(dateTime).toLocaleTimeString();
                  return [
                    surveyor,
                    v_type,
                    v_age,
                    f_type,
                    f_consumption,
                    ghge.toFixed(3),
                    date + " : " + time,
                  ];
                })
              );


              const mobileCombustionTotalGHGe = getTotalGHGe(surveyData.map((data:any) => data.ghge))
              totalGHGeSetState && totalGHGeSetState(mobileCombustionTotalGHGe);
              console.log("mobileCombustion : ", mobileCombustionTotalGHGe);





          } else if (survey_category === "waste-water") {
            setData(
              surveyData.map((surveyData: any) => {
                const {
                  populationUsingTheSystems,
                  wasteWaterGHGe,
                  dateTime,
                  surveyor,
                } = surveyData as WasteWaterDataPerSurvey;
                const { openPits_latrines, riverDischarge, septic_tanks } =
                  populationUsingTheSystems;

                const date = new Date(dateTime).toLocaleDateString();
                const time = new Date(dateTime).toLocaleTimeString();
                const dTime = date + " : " + time;
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
                  dTime,
                ];
              })
            );


            const wasteWaterTotalGHGe = getTotalGHGe(surveyData.map((data:any) => data.wasteWaterGHGe))
            totalGHGeSetState && totalGHGeSetState(wasteWaterTotalGHGe);
            console.log("wasteWater : ", wasteWaterTotalGHGe)


          }
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [
    form_type,
    muni_code,
    brgy_code,
    prov_code,
    selectedYear,
    survey_category,
  ]);

  return (
    <div className="h-full">
      {isLoading ? (
        <Skeleton />
      ) : data && data.length > 0 ? (
        <Table tb_datas={data} tb_head={column} />
      ) : (
        <div className="h-full flex justify-center items-center">
        <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
        </div>
      )}
    </div>
  );
};





const getTotalGHGe = (ghges : number[]) : number=> {

  let total_ghge = 0;
      ghges.forEach(ghge => {
          total_ghge += ghge
      });

  return total_ghge

}




export default SurveyData;
