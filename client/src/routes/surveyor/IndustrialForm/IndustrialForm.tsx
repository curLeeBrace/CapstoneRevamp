
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
import { NavLink, Outlet, useSearchParams } from "react-router-dom";





import { createContext, Dispatch, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AlertBox from "../../../Components/Forms/AlertBox";
import useUserInfo from "../../../custom-hooks/useUserType";
import BrgyMenu from "../../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import SurveyInformation from "../../ScheduleSurvey/SurveyInformation";


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


  const [formSchedule, setFormSchedule] = useState<{
    start_date : Date,
    deadline : Date,
    status : string
  }>();
    const axiosPrivate = useAxiosPrivate()
  
    useEffect(()=>{
      axiosPrivate.get('/survey-schedule/schedule-identifier', {params : {
        survey_type : "industrial",
        municipality_name : user_info.municipality_name
      }})
      .then(res => {
    
        if(res.status === 200){
            const {
            start_date,
            deadline,
            status,
            } = res.data
            setFormSchedule({
              start_date,
              deadline,
              status,
            });
        } else {
          setFormSchedule(undefined)
        }
      })
      .catch((err)=>console.log(err));
    },[])

 



    useEffect(()=>{
        const {action} = params 
        if(action !== "submit"){
            const {dsi, type_ofData} = state;
            setDsi(dsi);
            setTypeOfData(type_ofData)
          
        }
      },[searchParams])


  // const navLinkStyle = (isActive : boolean, isTransitioning : boolean) => {
    
    

  //   return {
  //     fontWeight: isActive ? "bold" : "",
  //     color: isActive ? "white" : "#009c39",
  //     viewTransitionName: isTransitioning ? "slide" : "",
  //     background : isActive ? "#009c39" :"white",
      
  //   };
  // }


const navLinkClass = (industryType : string) : string=> {
  const {industrial_type} = params;

  let design = "p-2 rounded-lg w-24 flex justify-center item-center ";

  if(industryType === industrial_type){
    design = design + "font-bold bg-green-800 text-white"
  } else {
    design = design + "text-green-700 bg-white text-lg"
  }


  return design

}


  return (

      <div className="flex justify-center min-h-screen px-4 py-2 overflow-x-hidden bg-gray-200">

        {
          !formSchedule || formSchedule.status === "inactive" && params.action === "submit" ? <SurveyInformation form_schedInfo={formSchedule}/>
          :<>
            <AlertBox
              openAlert={openAlert}
              setOpenAlert={setOpenAlert}
              message={alert_msg}
            />
          
            <Card className="w-full max-w-4xl px-6 py-6 shadow-2xl shadow-black rounded-xl h-auto relative">
            
            
              <Typography variant="h4" color="blue-gray" className="text-center text-xl text-white bg-darkgreen rounded-lg py-2 mb-2">
                Industrial Survey
              </Typography>

              {/* <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"> */}
                <div className="mb-1 flex flex-col gap-6">
                  <Typography className="-mb-3 text-md font-bold text-black">
                    Select Industry Type
                  </Typography>

                  <div className="md:flex md:justify-around grid grid-cols-2">

                    <NavLink to={`submit/0/mineral`}
                    
                    className={navLinkClass("mineral")}
                    >
                      Mineral
                    </NavLink>
                    <NavLink to={"submit/1/chemical"}
                    
                    className={navLinkClass("chemical")}
                    >
                      Chemical
                    </NavLink>
                    <NavLink to={"submit/2/metal"}
                    
                    className={navLinkClass("metal")}

                    >
                      Metal
                    </NavLink>


                    <NavLink to={"submit/3/electronics"}
                    
                    className={navLinkClass("electronics")}
                    >
                      Electronics
                    </NavLink>

                    <NavLink to={"submit/4/others"}
                
                    className={navLinkClass("others")}
                    >
                      Others
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
                  <Typography variant="h4" color="blue-gray" className="mb-5">
                    Annual Total Production
                  </Typography>
                </div>
                <IndustrialBaseDataContext.Provider  value={{brgy, dsi, type_ofData, setOpenAlert, setAlertMsg}}>
                  <Outlet/>
                </IndustrialBaseDataContext.Provider>

            </Card>
          </>
        }
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
