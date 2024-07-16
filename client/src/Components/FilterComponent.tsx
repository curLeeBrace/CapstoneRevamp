import Municipality from "../custom-hooks/Municipality"
// import MC_SurveyData from "../../routes/MC_SurveyData" 
import {AddressReturnDataType} from "../custom-hooks/useFilterAddrress";
import { Checkbox, Typography } from "@material-tailwind/react";


interface FilterComponentProps  {
    addressState :  {
        state : AddressReturnDataType | undefined
        setState : React.Dispatch<React.SetStateAction<AddressReturnDataType | undefined>>
    },

    formTypeState : {
        state : "residential" | "commercial"|undefined
        setState : React.Dispatch<React.SetStateAction<"residential" | "commercial"|undefined>>
    }


}

const FilterComponent = ({addressState, formTypeState}:FilterComponentProps) => {




    const handleFormType = (event : React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>{
        const value = event.target.value

        formTypeState.setState(value as any)
    }

    return(

             <div className="flex gap-5 flex-wrap">
                    <div className=" basis-full md:basis-1/5">
                        {/* dito */}
                        <Municipality setAddress={addressState.setState} />
                    

                    </div>
                    <div className="flex basis-8/12">
                        <Checkbox
                            disabled = {addressState.state == undefined}
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
                            disabled = {addressState.state == undefined}
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

                        
                    </div> 
                </div>
    )
}
export default FilterComponent