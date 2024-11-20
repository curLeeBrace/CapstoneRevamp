import React, { useEffect, useState } from "react";
import Table from "../Components/Table";
import Skeleton from "../Components/Skeleton";
import useAxiosPrivate from "../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../custom-hooks/useUserType";
import useSelectAllData from "../custom-hooks/useSelectAllData";
import SimpleCard from "../Components/Dashboard/SimpleCard";
import { ArrowRightCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import exportToExcel from "../custom-hooks/export_data/exportToExel";
// import exportToPDF from "../custom-hooks/export_data/exportToPDF";


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
  form_id : string,
  email : string,
  municipality_name : string,

  brgy_name : any,
  populationUsingTheSystems: PopulationUsingTheSystems;
  wasteWaterGHGe: number;
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
          "ID",
          "Email",
          ...(userInfo.user_type !== "lu_admin" ? ["Municipality"] : []),
          userInfo.user_type === "lu_admin" ? "Institution" : "Brgy",

          "Vehicle Type",
          "Vehicle Age",
          "Fuel Type",
          "Fuel Consumption",
          "GHGe",
          "DateTime",
        ]
      : [
          "ID",
          "Email",
          ...(userInfo.user_type !== "lu_admin" ? ["Municipality"] : []),
          userInfo.user_type === "lu_admin" ? "Institution" : "Brgy",
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
                    form_id,
                    email,
                    municipality_name,
                    brgy_name,
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
                    form_id.slice(-3),
                    email,
                    ...(userInfo.user_type !== "lu_admin" ? [municipality_name] : []),
                    brgy_name,
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
                } = surveyData as WasteWaterDataPerSurvey;
                const { openPits_latrines, riverDischarge, septic_tanks } = populationUsingTheSystems;
                const {email, municipality_name, brgy_name} = surveyData

                const date = new Date(dateTime).toLocaleDateString();
                const time = new Date(dateTime).toLocaleTimeString();
                
                const dTime = date + " : " + time;
                return [
                  surveyData.form_id.slice(-3), 
                  email,
                  ...(userInfo.user_type !== "lu_admin" ? [municipality_name] : []),
                  brgy_name,
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

  const capitalizeFirstLetter = (str: string | undefined): string => {
    if (!str) return ""; // Handle undefined or empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  const handleExport = (format: "excel") => {
    if (!data || !data.length) {
      alert("No data to export.");
      return;
    }
    const formattedSurveyCategory = capitalizeFirstLetter(survey_category);
    const formattedFormType = capitalizeFirstLetter(form_type);
  
    if (format === "excel") {
      exportToExcel(data, column, `${userInfo.municipality_name} ${formattedSurveyCategory} (${formattedFormType}) Surveyed Data`);
    } 
  };

  

  return (
    <div className="h-full">
      <div className="flex my-2 font-bold items-center border-2 w-48 rounded-md border-gray-300 p-2 text-black">
        <button
          onClick={() => handleExport("excel")}
          className="flex items-center"
        >
          <ArrowRightCircleIcon className="h-6 mx-2" />
          Export to Excel
        </button>
    </div>
       {/* <button onClick={() => handleExport("pdf")}>Export to PDF</button> */}
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
