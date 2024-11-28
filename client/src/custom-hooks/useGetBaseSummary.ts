import { useEffect } from "react"
import { BarSeriesTypes } from "../Components/Dashboard/BarChart"
import { DonutState } from "../Components/Dashboard/DonutChart"
import useUserInfo from "./useUserType"
import useAxiosPrivate from "./auth_hooks/useAxiosPrivate"
interface GetBaseSummaryProps {
    category : "industrial" | "falu"
    setResSeries : React.Dispatch<React.SetStateAction<BarSeriesTypes[] | undefined>>
    setDSI : React.Dispatch<React.SetStateAction<DonutState | undefined>>
    setTypeOfData : React.Dispatch<React.SetStateAction<DonutState | undefined>>
    falu_type? : "falu-wood" | "falu-forestland"
    industry_type? : "all" | "mineral" | "chemical" | "metal" | "electronics" | "others"
    year : string | undefined
}

type RequestQueryTypes = {
    user_type : string
    industry_type? : "all" | "mineral" | "chemical" | "metal" | "electronics" | "others";
    municipality_code : string;
    brgy_name : string;
    prov_code : string;
    year : string
  }

  
const useGetBaseSummary = ({category, setDSI, setResSeries, setTypeOfData, falu_type, industry_type, year} : GetBaseSummaryProps) => {
    const axiosPrivate = useAxiosPrivate();
    useEffect(()=>{
        const user_info = useUserInfo();
        const {municipality_code, user_type, province_code, brgy_name} = user_info
  
        axiosPrivate.get(`/summary-data/base-summary/${category}`, {
          params : {
            brgy_name,
            industry_type,
            falu_type,  
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
          
  
  
        }
  
      })
      .catch(err => console.log(err))
  
  
  
      },[industry_type, falu_type])
}



export default useGetBaseSummary