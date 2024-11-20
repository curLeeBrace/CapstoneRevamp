

import {
  Card,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import Wood from "./WoodAndWood";
import ForestLands from "./ForestLands";





import { createContext, Dispatch, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AlertBox from "../../../Components/Forms/AlertBox";
import useUserInfo from "../../../custom-hooks/useUserType";
import BrgyMenu from "../../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import { ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";


interface ForestryContextInterface {
  brgy : AddressReturnDataType | undefined,
  dsi : String | undefined,
  type_ofData : String | undefined
  setOpenAlert : Dispatch<React.SetStateAction<boolean>>
  setAlertMsg : Dispatch<React.SetStateAction<string>>
}




const ForestryBaseDataContext = createContext<ForestryContextInterface>({} as ForestryContextInterface);

 function ForestryForm() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  // const [openDialogBox, setOpenDialogBox] = useState(false);
  // const [isLoading, set_isLoading] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");
  const user_info = useUserInfo();
  const { state } = useLocation();



  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const [dsi, setDsi] = useState<string>();
  const [type_ofData, setTypeOfData] = useState<string>();


  
 



    useEffect(()=>{
        const {action} = params 
        if(action !== "submit"){
            const {dsi, type_ofData} = state;
            setDsi(dsi);
            setTypeOfData(type_ofData)
          
        }
      },[searchParams])




const navLinkClass = (forestryType : string) : string=> {
  const {forestry_type} = params;

  let design = "p-2 rounded-lg md:w-96 text-center item-center ";

  if(forestryType === forestry_type){
    design = design + "font-bold bg-green-800 text-white"
  } else {
    design = design + "text-green-700 bg-white text-lg"
  }


  return design

}


  return (

      <div className="flex justify-center min-h-screen px-4 py-2 overflow-x-hidden bg-gray-200">
         <AlertBox
            openAlert={openAlert}
            setOpenAlert={setOpenAlert}
            message={alert_msg}
          />
        <Card className="w-full max-w-4xl px-6 py-6 shadow-2xl shadow-black rounded-xl h-auto relative">
         
         
          <Typography variant="h4" color="blue-gray" className="text-center text-xl text-white bg-darkgreen rounded-lg py-2 mb-2">
            Forestry and Land Use Survey
          </Typography>

          {/* <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"> */}
            <div className="mb-1 flex flex-col gap-6">

            <div className="flex items-center gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md w-full">
            <ExclamationCircleIcon className="w-8 h-8 text-white" />
            <Typography className="text-md font-bold text-white">
              Select Emission Type
            </Typography>
          </div>
              <div className="md:flex md:justify-around flex">
             
                <NavLink to={`submit/0/wood`}
                
                 className={navLinkClass("wood")}
                >
                  Wood and Wood Products Harvesting
                </NavLink>


                <NavLink to={"submit/1/forestlands"}
                 
                 className={navLinkClass("forestlands")}
                >
                  Changes in the Use of the Forestlands
                </NavLink>
               

              </div>

              <div className="md:flex md:flex-row gap-5 grid grid-cols ">
                <BrgyMenu
                  disabled = {params.action === "view" || params.action === "finish"}
                  municipality_code={user_info.municipality_code}
                  setBrgys={user_info.user_type === 'lu_surveyor' 
                    ? () => setBrgy({ address_code: '043426003', address_name: 'Laguna University', parent_code: '0434' }) 
                    : setBrgy} 
                  deafult_brgyName={user_info.user_type === 'lu_surveyor' ? 'Laguna University' : (state && state.brgy_name) }
                  user_info={user_info}
                />

                <Select label="Data Source Identifier" onChange={(value)=> setDsi(value)} value={state ? state.dsi : dsi} disabled = {params.action === "view" || params.action === "finish"}>
                  <Option value="commercial" >Commercial</Option>
                  <Option value="industrial">Industrial</Option>
                  <Option value="institutional">Institutional</Option>
                  <Option value="others">Others</Option>
                </Select>

                <Select label="Type of Data" onChange={(value)=> setTypeOfData(value)} value={state ? state.type_ofData : type_ofData} disabled = {params.action === "view" || params.action === "finish"} >
                  <Option value="census">Census</Option>
                  <Option value="ibs">Individual Business Survey</Option>
                  <Option value="others">Others</Option>  
                </Select>
              </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg my-4">
              <div className="flex items-center gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md w-full my-4 ">
            <InformationCircleIcon className="w-8 h-8 text-white" />
            <Typography className="text-md font-bold text-white">
              Forestry Emission Sources
            </Typography>
          </div>
            
            <ForestryBaseDataContext.Provider  value={{brgy, dsi, type_ofData, setOpenAlert, setAlertMsg}}>
              <Outlet/>
            </ForestryBaseDataContext.Provider>
            </div>
        </Card>
      </div>
      

  );
}

const useForestryBaseData = () => {
  return useContext(ForestryBaseDataContext);
};


export {
  Wood,
  ForestLands,
  useForestryBaseData,
  ForestryForm
}
