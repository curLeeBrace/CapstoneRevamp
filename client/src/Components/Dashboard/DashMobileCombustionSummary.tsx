import { useState } from "react"
import FilterComponent from "../FilterComponent"
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import SurveyData from "../../routes/SurveyData";
import { Select, Option} from "@material-tailwind/react";

const DashMobileCombustionSummary = () => {
    const [address, setAddress] = useState<AddressReturnDataType>();
    const [formType, setFormType] = useState<"residential" | "commercial">();
    const [brgy, setBrgy] = useState<AddressReturnDataType>();
    const [selectAll, setSelectAll] = useState(false);
    const [survey_category, setSurveyCategory] = useState<string>("mobile-combustion");
    



    return (
        <div className="flex flex-col h-full">

            <div className="text-center font-bold text-black text-2xl m-2">
                GHGe Summary
            </div>

           <div className="flex gap-3 flex-wrap">

            <div>
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

                    selectAllState={{
                        setState : setSelectAll,
                        state : selectAll

                    }}



                />
            </div>
           </div>

            <div className="mt-5 h-full">

                <SurveyData 
                    form_type={formType} 
                    muni_code={address?.address_code} 
                    prov_code={address?.parent_code} 
                    brgy_code={brgy?.address_code} 
                    selectAll = {selectAll} 
                    survey_category = {survey_category}
                />

            </div>










        </div>
    )
}

export default DashMobileCombustionSummary