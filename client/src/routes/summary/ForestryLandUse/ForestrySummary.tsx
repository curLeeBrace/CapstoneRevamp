import { useEffect, useState } from "react";
import YearMenu from "../../../Components/YearMenu";
import BarChart, { BarSeriesTypes } from "../../../Components/Dashboard/BarChart";
import DonutChart, { DonutState } from "../../../Components/Dashboard/DonutChart";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../../../custom-hooks/useUserType";
import { Radio, Typography } from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";
import WoodSummary from "./WoodSummary";
import ForestLandsSummary from "./ForestLandsSummary";
import useGetBaseSummary from "../../../custom-hooks/useGetBaseSummary";

// type RequestQueryTypes = {
//   user_type : string
//   falu_type : "forestry-wood" | "forestry-forestlands" 
//   municipality_code : string;
//   brgy_name : string;
//   prov_code : string;
//   year : string
// }

const ForestrySummary = () => {


    const [res_series, setResSeries] = useState<BarSeriesTypes[]>();
    const [dsi, setDSI] = useState<DonutState>();
    const [typeOfData, setTypeOfData] = useState<DonutState>()
    

    const [falu_type, setFaluType] = useState<"falu-wood" | "falu-forestland" >();
    const [year, setYear] = useState<string>();

    const [emissionLabel, setEnissionLabel] = useState<string>("Forestry Land Use"); // Store the label

    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo();



    useGetBaseSummary({category : "falu", setDSI, setResSeries, setTypeOfData, year, falu_type})
    // useEffect(()=>{
    //     console.log("YEAR : ", year);
    // },[])

  


    // useEffect(()=>{
    //   const user_info = useUserInfo();
    //   const {municipality_code, user_type, province_code, brgy_name} = user_info

    //   axiosPrivate.get(`/`, {
    //     params : {
    //       brgy_name,
    //       falu_type,
    //       municipality_code,
    //       prov_code : province_code,
    //       user_type : user_type as string,
    //       year : year ? year : new Date().getFullYear().toString()
    //     } as RequestQueryTypes
    //   })
    // .then(res => {

    //   if(res.status === 200) {
    //     const {responsePerLocation, dsi_analytics, tyoeOfDataAnalytics} = res.data
        
    //     setResSeries([{
    //       name : "GHG Emission",
    //       data : responsePerLocation.map((response:any) => {
    //         return {
    //           x : response.location,
    //           y : response.count
    //         }
    //       })
    //     }])


    //     const {commercial, industrial, institutional, others} = dsi_analytics
    //     setDSI({
    //       labels : ["commercial", "industrial", "institutional", "others"],
    //       series : [commercial, industrial, institutional, others]
    //     })


    //     const {census, ibs} = tyoeOfDataAnalytics

    //     setTypeOfData({
    //       labels : ["census", "IBS", "others"],
    //       series : [census, ibs, tyoeOfDataAnalytics.others]
    //     })
        


    //   }

    // })
    // .catch(err => console.log(err))



    // },[falu_type])




  return (
    <div className="flex flex-col gap-5 mt-4">
       <div className="flex self-center mt-3">
        <Typography className="font-bold text-white text-2xl text-center bg-darkgreen -mt-4 py-2 -mb-3 px-10 rounded-lg">
          {" "}
          Forestry Land Use
        </Typography>
      </div>
      <div className="flex w-full justify-center gap-5">
        <div className="bg-darkgreen border-2 rounded-xl px-36">
            <Radio defaultChecked name="falu_type" label={<span className="font-bold text-white">All</span>} color ="green" value={"all"} onChange={(e: any) => { setFaluType(e.target.value); setEnissionLabel("Forestry Land Use");}} />
            <Radio name="falu_type" label={<span className="font-bold text-white"> Wood Products Harvesting</span>} color ="green" value={"falu-wood"} onChange={(e: any) => { setFaluType(e.target.value); setEnissionLabel("Woods and wood Products Harvesting");}} />
            <Radio name="falu_type" label={<span className="font-bold text-white">Changes in the Use of the Forestlands</span>} color ="green" value={"falu-forestland"} onChange={(e: any) => { setFaluType(e.target.value); setEnissionLabel("Changes in the Use of the Forestlands");}} />         
        </div>

        <div>
            <YearMenu useYearState={[year, setYear]}/>
        </div>
   
     
      </div>

      <div className="flex mx-4 gap-5 justify-center">
        {/* Column/Bar Chart Container */}   

        <div className="w-3/5 h-[400px]">
        {/* KAW NA BAHALA KUNG ANO GUSTO MO PALABASIN SA CHART */}
            <BarChart chart_icon={<UserIcon className="w-6 h-6"/>} 
            chart_label={`GHG Emission ${user_info.user_type === "s-admin" || user_info.user_type === "lgu_admin" ? "per" : "in"} ${user_info.user_type === "lu_admin" ? "Laguna University" : user_info.user_type === "s-admin" ? "Municipality" : "Brgy."}`}
            chart_meaning={`Overall ghge for ${emissionLabel}.`}
            series={res_series} />
        </div>

        {/* Donut Chart Container */}
        <div className="w-4/12 flex flex-col">
          {/* 1st Donut Chart Container */}
          <div className="border-2 rounded-lg py-4 mb-2 border-gray-300">
            {dsi && <DonutChart series={dsi.series} labels={dsi.labels} title={`Data Source Identifier (${emissionLabel})`} chart_meaning={`Overall collected data in ${
            user_info.user_type === "s-admin"
            ? "Laguna Province"
            : user_info.user_type === "lgu_admin" || user_info.user_type === "lu_admin"
            ? user_info.municipality_name
            : "Brgy."
        }`}
        />}
                
          </div>
          {/* 2nd Donut Chart Container */}
          <div className="border-2 rounded-lg py-4 border-gray-300">
            {typeOfData && <DonutChart series={typeOfData.series} labels={typeOfData.labels} title={`Type of Data (${emissionLabel})`} chart_meaning={`Overall collected data in ${
            user_info.user_type === "s-admin"
            ? "Laguna Province"
            : user_info.user_type === "lgu_admin" || user_info.user_type === "lu_admin"
            ? user_info.municipality_name
            : "Brgy."
        }`}
        />}

          </div>
        </div>
      </div>
      
        {
          falu_type == "falu-wood"? 
            <div>
                <WoodSummary year = {year ? year : new Date().getFullYear().toString()}/>
            </div> 
          : falu_type == "falu-forestland"? 
            <div>
                <ForestLandsSummary year = {year ? year : new Date().getFullYear().toString()}/>
                </div>
          : <div className="flex flex-col gap-10">
              <div>
                <WoodSummary year = {year ? year : new Date().getFullYear().toString()}/>
              </div>
              <div>
                <ForestLandsSummary year = {year ? year : new Date().getFullYear().toString()}/>
              </div>             
              
          </div>
        }
    </div>
  );
};

export default ForestrySummary;
