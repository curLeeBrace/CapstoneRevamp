
import Chemical from "./Chemical";
import Electronics from "./Electronics";
import Metal from "./Metal";
import Mineral from "./Mineral";
import Others from "./Others";

import {
  Card,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { NavLink, Outlet } from "react-router-dom";





import { createContext, Dispatch, useContext, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AlertBox from "../../../Components/Forms/AlertBox";
import useUserInfo from "../../../custom-hooks/useUserType";
import BrgyMenu from "../../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";


interface IndustrialContextInterface {
  brgy : AddressReturnDataType | undefined,
  dsi : String | undefined,
  type_ofData : String | undefined
  setOpenAlert : Dispatch<React.SetStateAction<boolean>>
  setAlertMsg : Dispatch<React.SetStateAction<string>>
}
const IndustrialBaseDataContext = createContext<IndustrialContextInterface>({} as IndustrialContextInterface);

 function IndustrialForm() {
  const params = useParams();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");
  const user_info = useUserInfo();
  const { state } = useLocation();



  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const [dsi, setDsi] = useState<string>();
  const [type_ofData, setTypeOfData] = useState<string>();




  const navLinkStyle = (isActive : boolean, isTransitioning : boolean ) => {
    
    return {
      fontWeight: isActive ? "bold" : "",
      viewTransitionName: isTransitioning ? "slide" : "",
      color: isActive ? "white" : "#009c39",
      background : isActive ? "#009c39" :"white",
      
    };
  }


  return (

      <div className="flex justify-center min-h-screen px-4 pb-5 overflow-x-hidden bg-gray-200">
         <AlertBox
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            message={alert_msg}
          />
        <Card className="w-full max-w-4xl px-6 py-6 shadow-2xl shadow-black rounded-xl h-auto relative">
         
         
          <Typography variant="h4" color="blue-gray" className="text-center">
            Industrial Survey
          </Typography>

          {/* <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"> */}
            <div className="mb-1 flex flex-col gap-6">
              <Typography className="-mb-3 text-md font-bold text-black">
                Select Industry Type
              </Typography>

              <div className="flex justify-around">

                <NavLink to={"0/mineral"}
                 style={({isActive, isTransitioning})=>navLinkStyle(isActive, isTransitioning)}
                 className="p-2 rounded-lg w-24 text-center"
                >
                  Mineral
                </NavLink>
                <NavLink to={"1/chemical"}
                 style={({isActive, isTransitioning})=>navLinkStyle(isActive, isTransitioning)}
                 className="p-2 rounded-lg w-24 text-center"
                >
                  Chemical
                </NavLink>
                <NavLink to={"2/metal"}
                 style={({isActive, isTransitioning})=>navLinkStyle(isActive, isTransitioning)}
                 className="p-2 rounded-lg w-24 text-center"
                >
                  Metal
                </NavLink>


                <NavLink to={"3/electronics"}
                 style={({isActive, isTransitioning})=>navLinkStyle(isActive, isTransitioning)}
                 className="p-2 rounded-lg w-24 text-center"
                >
                  Electronics
                </NavLink>

                <NavLink to={"4/others"}
                 style={({isActive, isTransitioning})=>navLinkStyle(isActive, isTransitioning)}
                 className="p-2 rounded-lg w-24 text-center"
                >
                  Others
                </NavLink>

              </div>

              <div className="md:flex md:flex-row gap-5 grid grid-cols ">
                <BrgyMenu
                  disabled={params.action === "view"}
                  municipality_code={user_info.municipality_code}
                  setBrgys={setBrgy}
                  deafult_brgyName={state && state.brgy_name}
                />

                <Select label="Data Source Identifier" onChange={(value)=> setDsi(value)}>
                  <Option value="commercial">Commercial</Option>
                  <Option value="industrial">Industrial</Option>
                  <Option value="institutional">Institutional</Option>
                  <Option value="others">Others</Option>
                </Select>

                <Select label="Type of Data" onChange={(value)=> setTypeOfData(value)}>
                  <Option value="census">Census</Option>
                  <Option value="ibs">Individual Business Survey</Option>
                  <Option value="others">Others</Option>  
                </Select>
              </div>
              <Typography variant="h4" color="blue-gray" className="mb-5">
                Annual Total Production
              </Typography>
            </div>
            <IndustrialBaseDataContext.Provider  value={{brgy, dsi, type_ofData, setOpenAlert, setAlertMsg}}>
              <Outlet/>
            </IndustrialBaseDataContext.Provider>

        </Card>
      </div>
      

  );
}

const useIndustrialBaseData = () => {
  return useContext(IndustrialBaseDataContext);
};


export {
  Chemical,
  Electronics,
  Metal,
  Mineral,
  Others,
  IndustrialForm,
  useIndustrialBaseData

}
