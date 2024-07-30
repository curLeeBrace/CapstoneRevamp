import BrgyMenu from "../custom-hooks/BrgyMenu";
import Municipality from "../custom-hooks/Municipality"
// import MC_SurveyData from "../../routes/MC_SurveyData" 
import {AddressReturnDataType} from "../custom-hooks/useFilterAddrress";
import { Checkbox, Typography } from "@material-tailwind/react";
import useUserInfo from "../custom-hooks/useUserType";

interface FilterComponentProps  {
    municipalityState :  {
        state : AddressReturnDataType | undefined
        setState : React.Dispatch<React.SetStateAction<AddressReturnDataType | undefined>>
    },

    brgyState :  {
        state : AddressReturnDataType | undefined
        setState : React.Dispatch<React.SetStateAction<AddressReturnDataType | undefined>>
    },
    
    formTypeState : {
        state : "residential" | "commercial"|undefined
        setState : React.Dispatch<React.SetStateAction<"residential" | "commercial"|undefined>>
    },

    selectAllState : {
        state : boolean;
        setState : React.Dispatch<React.SetStateAction<boolean>>;
    }


}

const FilterComponent = ({municipalityState, formTypeState, brgyState, selectAllState}:FilterComponentProps) => {

    const userInfo = useUserInfo();
    const handleFormType = (event : React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>{
        const value = event.target.value

        formTypeState.setState(value as any)
    }

    return(

             <div>
                    
                    <div className="flex w-full flex-wrap gap-2">

                    <div className="w-96 flex items-center gap-2">
                        <Municipality setAddress={municipalityState.setState} disabled = {userInfo.user_type === "s-admin" && selectAllState.state === true}/>
                        {
                            municipalityState.state && userInfo.user_type === "lgu_admin" && 
                            <div className="self-center">
                                <BrgyMenu setBrgys={brgyState.setState} municipality_code={municipalityState.state.address_code}
                                 disabled = {userInfo.user_type === "lgu_admin" && selectAllState.state === true}   />
                            </div>
                        }

                    </div>

                    <div className="">
                       
                        <Checkbox
                            disabled = {municipalityState.state == undefined}
                            name='formType'
                            value={'residential'}
                            checked={formTypeState.state === "residential"} // Checked if this is selected
                            onChange={(event) => handleFormType(event)} // Handler for selection
                            label={
                            <Typography variant="small" color="gray" className="font-normal mr-4">
                                Residential
                            </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />
                        <Checkbox
                            disabled = {municipalityState.state == undefined}
                            name='formType'
                            value={'commercial'}
                            checked={formTypeState.state === "commercial"} // Checked if this is selected
                            onChange={(event) => handleFormType(event)} // Handler for selection
                            label={
                            <Typography variant="small" color="gray" className="font-normal mr-4">
                                Commercial
                            </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />

                        <Checkbox
                            disabled = {municipalityState.state == undefined || formTypeState.state === undefined}
                            name='selectAll'
                            value={'selectAll'}
                            checked={selectAllState.state === true} // Checked if this is selected
                            onChange={() => selectAllState.setState(!selectAllState.state)} // Handler for selection
                            label={
                            <Typography variant="small" color="gray" className="font-normal">
                                Select all {formTypeState.state} data in {userInfo.user_type === "s-admin" ?  "Laguna" : `${userInfo.municipality_name}`}
                            </Typography>
                            }
                            containerProps={{ className: "-ml-2.5" }}
                        />


                    </div>
                        
                        
                    </div> 
                </div>
    )
}
export default FilterComponent