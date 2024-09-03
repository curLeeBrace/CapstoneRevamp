import BrgyMenu from "../custom-hooks/BrgyMenu";
import Municipality from "../custom-hooks/Municipality"
// import MC_SurveyData from "../../routes/MC_SurveyData" 
import {AddressReturnDataType} from "../custom-hooks/useFilterAddrress";
import { Checkbox, Typography } from "@material-tailwind/react";
import YearMenu from "../Components/YearMenu"
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
        state : "residential" | "commercial"
        setState : React.Dispatch<React.SetStateAction<"residential" | "commercial">>
    },

    // selectAllState : {
    //     state : boolean;
    //     setState : React.Dispatch<React.SetStateAction<boolean>>;
    // }

    yearState ? : {
        state : string|undefined;
        setState : React.Dispatch<React.SetStateAction<string|undefined>>;
    }


}

const FilterComponent = ({municipalityState, formTypeState, brgyState, yearState}:FilterComponentProps) => {

    const userInfo = useUserInfo();
    const handleFormType = (event : React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>{
        const value = event.target.value

        formTypeState.setState(value as any)
    }


  


    
    // useEffect(()=>{

    //     const {user_type} = userInfo;


    //     if(user_type === "s-admin")  {

    //         if(municipalityState.state == undefined || municipalityState.state == null){
    //             selectAllState.setState(true)
    //         } else {
    //             selectAllState.setState(false)
    //         }

    //     } else if (user_type === "lgu_admin") {

    //         if(brgyState.state == undefined || brgyState.state == null){
    //             selectAllState.setState(true)
    //         } else {
    //             selectAllState.setState(false)
    //         }
    //     }
        
      

      
    // },[formTypeState.state, municipalityState.state, brgyState.state]) 

    

    return(

             <div>
                    <div className="flex w-full flex-wrap gap-2">
 
                        <div className="flex h-full w-full xl:w-96 sm:flex-nowrap flex-wrap gap-6">
                            
                                <Municipality setAddress={municipalityState.setState} />

                            
                            {
                                municipalityState.state && userInfo.user_type === "lgu_admin" && 
                                
                                    <BrgyMenu setBrgys={brgyState.setState} municipality_code={municipalityState.state.address_code} />
                           
                            }

                        </div>
                        
                            {
                                yearState && 
                                <YearMenu useYearState={[yearState.state, yearState.setState]}/>
                            }

                    
                        <div className="self-center">
                        
                            <Checkbox
                                // disabled = {municipalityState.state == undefined}
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
                                // disabled = {municipalityState.state == undefined}
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

                            {/* <Checkbox
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
                            /> */}
                        

                        


                        </div>
                        
                        
                    </div> 
                </div>
    )
}
export default FilterComponent