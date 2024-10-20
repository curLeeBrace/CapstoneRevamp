import YearMenu from "../../../Components/YearMenu";
import BarChart, {BarSeriesTypes} from "../../../Components/Dashboard/BarChart";
import {UserIcon} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart";

import { Radio } from "@material-tailwind/react";
import useUserInfo from "../../../custom-hooks/useUserType";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import MineralSummary from "./MineralSummary";
import ChemicalSummary from "./ChemicalSummary";
import MetalSummary from "./MetalSummary";
import ElectronicsSummary from "./ElectronicsSummary";
import OthersSummary from "./OthersSummary";

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

type RequestQueryTypes = {
  user_type : string
  industry_type : "all" | "mineral" | "chemical" | "metal" | "electronics" | "others";
  municipality_code : string;
  brgy_name : string;
  prov_code : string;
  year : string
}

const IndustrialSummary = () => {


    const [res_series, setResSeries] = useState<BarSeriesTypes[]>();
    const [dsi, setDSI] = useState<DonutState>();
    const [typeOfData, setTypeOfData] = useState<DonutState>()
    

    const [industry_type, setIndustryType] = useState<"all" | "mineral" | "chemical" | "metal" | "electronics" | "others">();
    const [year, setYear] = useState<string>();


    const axiosPrivate = useAxiosPrivate();

    // useEffect(()=>{
    //     console.log("YEAR : ", year);
    // },[])

  


    useEffect(()=>{
      const user_info = useUserInfo();
      const {municipality_code, user_type, province_code, brgy_name} = user_info

      axiosPrivate.get(`/summary-data/industrial`, {
        params : {
          brgy_name,
          industry_type,
          municipality_code,
          prov_code : province_code,
          user_type : user_type as string,
          year : year ? year : new Date().getFullYear().toString()
        } as RequestQueryTypes
      })
    .then(res => {

      if(res.status === 200) {
        const {responsePerLocation, dsi_analytics, tyoeOfDataAnalytics} = res.data
        
        setResSeries([{
          name : "Survey Count",
          data : responsePerLocation.map((response:any) => {
            return {
              x : response.location,
              y : response.count
            }
          })
        }])


        const {commercial, industrial, institutional, others} = dsi_analytics
        setDSI({
          labels : ["commercial", "industrial", "institutional", "others"],
          series : [commercial, industrial, institutional, others]
        })


        const {census, ibs} = tyoeOfDataAnalytics

        setTypeOfData({
          labels : ["census", "IBS", "others"],
          series : [census, ibs, tyoeOfDataAnalytics.others]
        })
        







        // setResSeries(responsePerLocation);
        // setDSI(dsi_analytics);

      }

    })
    .catch(err => console.log(err))



    },[industry_type])




  return (
    <div className="flex flex-col gap-5 mt-10">
      <div className="flex w-full justify-center gap-5">
        <div>
            <Radio defaultChecked name="indusry_type" label="All" color ="green" value={"all"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
            <Radio name="indusry_type" label="Mineral" color ="green" value={"mineral"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
            <Radio name="indusry_type" label="Chemical" color ="green" value={"chemical"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
            <Radio name="indusry_type" label="Metal" color ="green" value={"metal"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
            <Radio name="indusry_type" label="Electronics" color ="green" value={"electronics"} onChange={(e:any)=>setIndustryType(e.target.value)}/>
            <Radio name="indusry_type" label="Others" color ="green" value={"others"} onChange={(e:any)=>setIndustryType(e.target.value)}/>            
        </div>

        <div>
            <YearMenu useYearState={[year, setYear]}/>
        </div>
   
     
      </div>

      <div className="flex mx-10 gap-5 justify-center">
        {/* Column/Bar Chart Container */}
        <div className="w-3/5">
            <BarChart chart_icon={<UserIcon className="w-6 h-6"/>} chart_label="Reponse per Municipality" chart_meaning="Overall Response" series={res_series}/>
        </div>

        {/* Donut Chart Container */}
        <div className="w-4/12 flex flex-col">
          {/* 1st Donut Chart Container */}
          <div>
            {dsi && <DonutChart series={dsi.series} labels={dsi.labels} title="Data Source Identifier"/>}
                
          </div>
          {/* 2nd Donut Chart Container */}
          <div> 
            {typeOfData && <DonutChart series={typeOfData.series} labels={typeOfData.labels} title="Type of Data"/>}

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
