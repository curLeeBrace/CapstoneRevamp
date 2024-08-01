import { useState } from "react"
import FilterComponent from "../FilterComponent"
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import MC_SurveyData from "../../routes/MC_SurveyData";

const DashMobileCombustionSummary = () => {
    const [address, setAddress] = useState<AddressReturnDataType>();
    const [formType, setFormType] = useState<"residential" | "commercial">();
    const [brgy, setBrgy] = useState<AddressReturnDataType>();
    const [selectAll, setSelectAll] = useState(false);



    return (
        <div className="flex flex-col h-full">

            <div className="text-center font-bold text-black text-2xl m-2">
                GHGe Summary
            </div>

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
            <div className="mt-5 h-full">

                <MC_SurveyData form_type={formType} muni_code={address?.address_code} prov_code={address?.parent_code} brgy_code={brgy?.address_code} selectAll = {selectAll} />

            </div>










        </div>
    )
}

export default DashMobileCombustionSummary