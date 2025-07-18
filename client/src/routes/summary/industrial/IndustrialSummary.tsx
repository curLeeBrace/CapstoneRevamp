import YearMenu from "../../../Components/YearMenu";
import BarChart, {BarSeriesTypes} from "../../../Components/Dashboard/BarChart";
import {UserIcon} from "@heroicons/react/24/solid";
import { useState } from "react";
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart";

import { Radio } from "@material-tailwind/react";
import useUserInfo from "../../../custom-hooks/useUserType";
import MineralSummary from "./MineralSummary";
import ChemicalSummary from "./ChemicalSummary";
import MetalSummary from "./MetalSummary";
import ElectronicsSummary from "./ElectronicsSummary";
import OthersSummary from "./OthersSummary";


import useGetBaseSummary from "../../../custom-hooks/useGetBaseSummary";

// type BarSeriesTypes = {

//     name : string,
//     data : {
//         x : string
//         y : number
//     }[],
//     fillColor? : string,

// }


// type IndustryType = {
//   industry_type : 
// }



const IndustrialSummary = () => {


    const [res_series, setResSeries] = useState<BarSeriesTypes[]>();
    const [dsi, setDSI] = useState<DonutState>();
    const [typeOfData, setTypeOfData] = useState<DonutState>()
    

    const [industry_type, setIndustryType] = useState<"all" | "mineral" | "chemical" | "metal" | "electronics" | "others">();
    const [year, setYear] = useState<string>();

    const [industryLabel, setIndustryLabel] = useState<string>("Industrial"); // Store the label

    const user_info = useUserInfo();


    useGetBaseSummary({category : "industrial", setDSI, setResSeries, setTypeOfData, year, industry_type})

    // useEffect(()=>{
    //     console.log("YEAR : ", year);
    // },[])

  


   




  return (
    <div className="flex flex-col gap-5 mt-4">
      <div className="flex w-full justify-center gap-5">
        <div className="bg-darkgreen border-2 rounded-xl px-36">
            <Radio defaultChecked name="indusry_type" label={<span className="font-bold text-white">All (Industrial)</span>} color ="green" value={"all"} onChange={(e: any) => { setIndustryType(e.target.value); setIndustryLabel("Industrial");}} />
            <Radio name="indusry_type" label={<span className="font-bold text-white">Mineral</span>} color ="green" value={"mineral"} onChange={(e: any) => { setIndustryType(e.target.value); setIndustryLabel("Mineral");}} />
            <Radio name="indusry_type" label={<span className="font-bold text-white">Chemical</span>} color ="green" value={"chemical"} onChange={(e: any) => { setIndustryType(e.target.value); setIndustryLabel("Chemical");}} />
            <Radio name="indusry_type" label={<span className="font-bold text-white">Metal</span>} color ="green" value={"metal"} onChange={(e: any) => { setIndustryType(e.target.value); setIndustryLabel("Metal");}} />
            <Radio name="indusry_type" label={<span className="font-bold text-white">Electronics</span>} color ="green" value={"electronics"} onChange={(e: any) => { setIndustryType(e.target.value); setIndustryLabel("Electronics");}} />
            <Radio name="indusry_type" label={<span className="font-bold text-white">Others</span>} color ="green" value={"others"} onChange={(e: any) => { setIndustryType(e.target.value); setIndustryLabel("Others");}} />          
        </div>

        <div>
            <YearMenu useYearState={[year, setYear]}/>
        </div>
   
     
      </div>

      <div className="flex mx-4 gap-5 justify-center">
        {/* Column/Bar Chart Container */}   

        <div className="w-3/5 h-[400px]">
            <BarChart chart_icon={<UserIcon className="w-6 h-6"/>} 
            chart_label={`Response ${user_info.user_type === "s-admin" || user_info.user_type === "lgu_admin" ? "per" : "in"} ${user_info.user_type === "lu_admin" ? "Laguna University" : user_info.user_type === "s-admin" ? "Municipality" : "Brgy."}`}
            chart_meaning={`Overall Response for ${industryLabel} ${user_info.user_type === "s-admin" 
            ? "Laguna Province" 
            : user_info.user_type === "lu_admin" 
            ? "Laguna University"
            : user_info.user_type === "lgu_admin"
            ? `${user_info.municipality_name}`
            : "Selected Area"}.`}
            series={res_series} />
        </div>

        {/* Donut Chart Container */}
        <div className="w-4/12 flex flex-col">
          {/* 1st Donut Chart Container */}
          <div className="border-2 rounded-lg py-4 mb-2 border-gray-300">
            {dsi && <DonutChart series={dsi.series} labels={dsi.labels} title={`Data Source Identifier (${industryLabel})`} chart_meaning={`Overall collected data in ${
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
            {typeOfData && <DonutChart series={typeOfData.series} labels={typeOfData.labels} title={`Type of Data (${industryLabel})`} chart_meaning={`Overall collected data in ${
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
          industry_type == "mineral"? 
            <div>
              <MineralSummary year = {year ? year : new Date().getFullYear().toString()}/>
          
            </div> 
          : industry_type == "chemical" ?
            <div>
              <ChemicalSummary year = {year ? year : new Date().getFullYear().toString()}/>
            </div>
          : industry_type == "metal" ?
          <div>
            <MetalSummary year = {year ? year : new Date().getFullYear().toString()}/>
          </div>
          
          :industry_type == "electronics"?
            <div>
              <ElectronicsSummary year = {year ? year : new Date().getFullYear().toString()}/>

            </div>
          
          : industry_type == "others" ?
            <div>
              <OthersSummary year = {year ? year : new Date().getFullYear().toString()}/>
            </div>
          : <div className="flex flex-col gap-10">
              <div>
                <MetalSummary year = {year ? year : new Date().getFullYear().toString()}/>
              </div>
              <div>
                <ChemicalSummary year = {year ? year : new Date().getFullYear().toString()}/>
              </div>
              <div>
                <MineralSummary year = {year ? year : new Date().getFullYear().toString()}/>
              </div>
              <div>
                <ElectronicsSummary year = {year ? year : new Date().getFullYear().toString()}/>
              </div>
              <div>
                <OthersSummary year = {year ? year : new Date().getFullYear().toString()}/>
              </div>
              
              
              
              
              
          </div>
        }
    </div>
  );
};

export default IndustrialSummary;
