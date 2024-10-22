import { Card, Typography } from "@material-tailwind/react";
import { Dispatch, useState, createContext, useContext} from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import AlertBox from "../../../Components/Forms/AlertBox";
import useUserInfo from "../../../custom-hooks/useUserType";
import BrgyMenu from "../../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";

import { NavLink } from "react-router-dom";
import Crops from "./Crops";
import LiveStocks from "./LiveStocks";


interface AgricultureContextType {
  brgy : AddressReturnDataType | undefined,
  setOpenAlert : Dispatch<React.SetStateAction<boolean>>
  setAlertMsg : Dispatch<React.SetStateAction<string>>
}




const AgricultureContext = createContext<AgricultureContextType>({} as AgricultureContextType);



function AgricultureForm() {
  const params = useParams();
  const user_info = useUserInfo();
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const { state } = useLocation();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");

  // const navLinkStyle = (isActive : boolean, isTransitioning : boolean ) => {
    
  //   return {
  //     fontWeight: isActive ? "bold" : "",
  //     viewTransitionName: isTransitioning ? "slide" : "",
  //     color: isActive ? "white" : "#009c39",
  //     background : isActive ? "#009c39" :"white",
      
  //   };
  // }


  const navLinkClass = (industryType : string) : string=> {
    const {agriculture_type} = params;
  
    let design = "p-2 rounded-lg w-24 flex justify-center item-center ";
  
    if(industryType === agriculture_type){
      design = design + "font-bold bg-green-800 text-white"
    } else {
      design = design + "text-green-700 bg-white text-lg"
    }
  
  
    return design
  
  }

  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden">
      <AlertBox
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        message={alert_msg}
      />

      <Card className="w-full max-w-4xl px-6 py-6 shadow-2xl shadow-black rounded-xl h-auto relative">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Agriculture Survey
        </Typography>

        <form className="mt-8 mb-2 max-w-screen-lg w-full flex flex-col gap-5">
          {/* Barangay Menu */}
          <div className="">
            <BrgyMenu
              disabled = {params.action === "view" || params.action === "finish"}
              municipality_code={user_info.municipality_code}
              setBrgys={setBrgy}
              deafult_brgyName={state && state.brgy_name}
            />
          </div>

          <div className="mb-1 flex flex-col gap-6">
            <Typography className="-mb-3 text-md font-bold text-black">
                Select Agriculture Type
            </Typography>

            <div className="flex gap-7 overflow-x-auto ">
               <NavLink to={"submit/0/crops"}
                //  style={({isActive, isTransitioning})=>navLinkStyle(isActive, isTransitioning)}
                 className={navLinkClass("crops")}
                >
                  Crops
                </NavLink>
                <NavLink to={"submit/1/livestocks"}
                //  style={({isActive, isTransitioning})=>navLinkStyle(isActive, isTransitioning)}
                 className={navLinkClass("livestocks")}
                >
                  LiveStocks
                </NavLink>
              
            </div>

          </div>

        {/* rende here  */}
        <AgricultureContext.Provider  value={{brgy, setOpenAlert, setAlertMsg}}>
              <Outlet/>
        </AgricultureContext.Provider>


        </form>
      </Card>
    </div>
  );
}


const useAgricultureContextData = () => {
  return useContext(AgricultureContext);
};





export {AgricultureForm, Crops, useAgricultureContextData, LiveStocks}
