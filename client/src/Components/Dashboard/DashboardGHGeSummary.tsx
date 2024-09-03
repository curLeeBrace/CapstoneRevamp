import {useState } from "react"
import FilterComponent from "../FilterComponent"
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import SurveyData from "../../routes/SurveyData";
import { Select, Option} from "@material-tailwind/react";
import useUserInfo from "../../custom-hooks/useUserType";

const DashboardGHGeSummary = () => {
    const [address, setAddress] = useState<AddressReturnDataType>();
    const [formType, setFormType] = useState<"residential" | "commercial">("residential");
    const [brgy, setBrgy] = useState<AddressReturnDataType>();

    const [survey_category, setSurveyCategory] = useState<string>("mobile-combustion");
    const userInfo = useUserInfo();


    return (
        <div className="flex flex-col h-full">

            <div className="text-center font-bold text-black text-2xl m-2">
                GHGe Summary
            </div>

           <div className="flex gap-3 flex-wrap">

            <div className="w-full 2xl:w-52">
                <Select  value={survey_category} label="GHGe Category" onChange={(value)=>setSurveyCategory(value as string)}>
                    <Option value="mobile-combustion">Mobile Combustion</Option>
                    <Option value="waste-water">Waste Water</Option>
                </Select>

            </div>
            
            <div>
                <FilterComponent

                        municipalityState={{
                        setState : setAddress,
                        state : address
                    }}
                    
                    formTypeState={{
                        setState : setFormType,
                        state : formType
                    }}

                    brgyState={{
                        setState : setBrgy,
                        state : brgy

                    }}

                    // selectAllState={{
                    //     setState : setSelectAll,
                    //     state : selectAll

                    // }}



                />
            </div>
           </div>

            <div className="mt-5 h-full">

                <SurveyData 
                    form_type={formType} 
                    muni_code={
                        userInfo.user_type === "lgu_admin" ? userInfo.municipality_code
                        :   address ? address.address_code 
                        :   userInfo.municipality_code
                        
                    } 
                    prov_code={    
                        userInfo.user_type === "lgu_admin" ? userInfo.province_code
                        :   address ? address.parent_code 
                        :   userInfo.province_code
                    } 
                    brgy_code={brgy?.address_code} 
                    survey_category = {survey_category}
                />

            </div>










        </div>
    )
}

export default DashboardGHGeSummary