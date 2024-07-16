import { useState } from "react"
import FilterComponent from "../FilterComponent"
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import MC_SurveyData from "../../routes/MC_SurveyData";

const DashMobileCombustionSummary = () => {
    const [address, setAddress] = useState<AddressReturnDataType>();
    const [formType, setFormType] = useState<"residential" | "commercial">();
    return (
        <div className="flex flex-col h-full">

            <div className="text-center font-bold text-black text-2xl m-2">
                GHGe Summary
            </div>

           <FilterComponent addressState={{
            setState : setAddress,
            state : address
           }}
           
           formTypeState={{
            setState : setFormType,
            state : formType
           }}
           />
            <div className="mt-5 h-full">

                <MC_SurveyData form_type={formType} muni_code={address?.address_code} prov_code={address?.parent_code}/>

            </div>










        </div>
    )
}

export default DashMobileCombustionSummary