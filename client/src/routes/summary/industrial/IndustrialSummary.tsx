import YearMenu from "../../../Components/YearMenu";
import BarChart from "../../../Components/Dashboard/BarChart";
import {UserIcon} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import DonutChart, {DonutState} from "../../../Components/Dashboard/DonutChart";

import { Radio } from "@material-tailwind/react";


type BarSeriesTypes = {

    name : string,
    data : {
        x : string
        y : number
    }[],
    fillColor? : string,

}

const navLinkStyle = (isActive: boolean, isTransitioning: boolean) => {
  return {
    fontWeight: isActive ? "bold" : "",
    viewTransitionName: isTransitioning ? "slide" : "",
    color: isActive ? "white" : "#009c39",
    background: isActive ? "#009c39" : "white",
  };
};

const IndustrialSummary = () => {


    const [res_series, setResSeries] = useState<BarSeriesTypes[]>();
    const [dsi, setDSI] = useState<DonutState>();
    

    const [year, setYear] = useState<string>();

    useEffect(()=>{
        setDSI({
            labels : ["a","b","c","d","e"],
            series : [44, 55, 41, 17, 15]
        })
    },[])





  return (
    <div className="flex flex-col gap-5 mt-10">
      <div className="flex w-full justify-center gap-5">
        <div>
            <Radio name="indusry_type" label="Mineral" color ="green" value={"mineral"}/>
            <Radio name="indusry_type" label="Chemical" color ="green" value={"chemical"}/>
            <Radio name="indusry_type" label="Metal" color ="green" value={"metal"}/>
            <Radio name="indusry_type" label="Electronics" color ="green" value={"electronics"}/>
            <Radio name="indusry_type" label="Others" color ="green" value={"others"}/>            
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
            {dsi && <DonutChart series={dsi.series} labels={dsi.labels} title="Type of Data"/>}

          </div>
        </div>

      </div>
    </div>
  );
};

export default IndustrialSummary;
