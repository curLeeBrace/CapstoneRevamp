
import Chemical from "./Chemical";
import Electronics from "./Electronics";
import Metal from "./Metal";
import Mineral from "./Mineral";
import Others from "./Others";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { NavLink, Outlet } from "react-router-dom";





import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AlertBox from "../../../Components/Forms/AlertBox";
import useUserInfo from "../../../custom-hooks/useUserType";
import BrgyMenu from "../../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";

// type Payload = {
//   survey_data : any
//   surveyor_info : any
//   dateTime_created:Date
//   dateTime_edited:Date|null
// }

// type formDataTypes = {
//   form_type : string,
//   vehicle_type : string,
//   vehicle_age : number,
//   fuel_type : string,
//   liters_consumption : number,
//   brgy_name : string

// }

 function IndustrialForm() {
  const params = useParams();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");
  const user_info = useUserInfo();
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const { state } = useLocation();

  const [selectedType, setSelectedType] = useState<string>("mineral");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };


  const navLinkStyle = (isActive : boolean, isTransitioning : boolean ) => {
    
    return {
      fontWeight: isActive ? "bold" : "",
      viewTransitionName: isTransitioning ? "slide" : "",
      color: isActive ? "white" : "#009c39",
      background : isActive ? "#009c39" :"white",
      
    };
  }


  return (
    <>
      <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gray-200">
        <AlertBox
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          message={alert_msg}
        />

        <Card className="w-full max-w-4xl px-6 py-6 shadow-2xl shadow-black rounded-xl">
          <Typography variant="h4" color="blue-gray" className="text-center mb-4">
            Industrial Survey
          </Typography>

          {/* <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"> */}
            <div className="mb-1 flex flex-col gap-6">
              <Typography className="-mb-3 text-md font-bold text-black">
                Select Industry Type
              </Typography>

              <div className="md:flex md:justify-around grid grid-cols-3 gap-4">

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

              
              {/* <div className="md:flex md:flex-row gap-5 grid grid-cols-2">
                <Checkbox
                  disabled={params.action === "view"}
                  name="form_type"
                  value={"mineral"}
                  checked={selectedType === "mineral"}
                  onChange={handleChange}
                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal mr-4"
                    >
                      Mineral
                    </Typography>
                  }
                  containerProps={{ className: "-ml-2.5" }}
                />
                <Checkbox
                  disabled={params.action === "view"}
                  name="form_type"
                  value={"chemical"}
                  checked={selectedType === "chemical"}
                  onChange={handleChange}
                  // onChange={(event) => handleChange({ })} // Handler for selection
                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal mr-4"
                    >
                      Chemical
                    </Typography>
                  }
                  containerProps={{ className: "-ml-2.5" }}
                />
                <Checkbox
                  disabled={params.action === "view"}
                  name="form_type"
                  value={"metal"}
                  checked={selectedType === "metal"}
                  onChange={handleChange}
                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal mr-4"
                    >
                      Metal
                    </Typography>
                  }
                  containerProps={{ className: "-ml-2.5" }}
                />
                <Checkbox
                  disabled={params.action === "view"}
                  name="form_type"
                  value={"electronics"}
                  checked={selectedType === "electronics"}
                  onChange={handleChange}
                  // onChange={(event) => handleChange({})} // Handler for selection

                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Electronics
                    </Typography>
                  }
                  containerProps={{ className: "-ml-2.5" }}
                />
                <Checkbox
                  disabled={params.action === "view"}
                  name="form_type"
                  value={"others"}
                  checked={selectedType === "others"}
                  onChange={handleChange}
                  // onChange={(event) => handleChange({ })} // Handler for selection
                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal mr-4"
                    >
                      Others
                    </Typography>
                  }
                  containerProps={{ className: "-ml-2.5" }}
                />
              </div> */}




              <div className="md:flex md:flex-row gap-5 grid grid-cols ">
                <BrgyMenu
                  disabled={params.action === "view"}
                  municipality_code={user_info.municipality_code}
                  setBrgys={setBrgy}
                  deafult_brgyName={state && state.brgy_name}
                />

                <Select label="Data Source Identifier">
                  <Option>Commercial</Option>
                  <Option>Industrial</Option>
                  <Option>Institutional</Option>
                  <Option>Others</Option>
                </Select>

                <Select label="Type of Data">
                  <Option>Census</Option>
                  <Option>Individual Business Survey</Option>
                  <Option>Others</Option>
                </Select>
              </div>
              <Typography variant="h4" color="blue-gray" className="mb-5">
                Annual Total Production
              </Typography>

         




              {/* MINERAL FORM TYPE */}
              {/* {selectedType === "mineral" && (
               
              )} */}

              {/* CHEMICAL FORM TYPE */}
              {/* {selectedType === "chemical" && (
                
              )} */}
              {/* METAL FORM TYPE  */}
              {/* {selectedType === "metal" && (
               
              )} */}

              {/* ELECTRONICS FORM TYPE */}
              {/* {selectedType === "electronics" && (
               
              )} */}

              {/* OTHERS FORM TYPE */}
              {/* {selectedType === "others" && (
                
              )} */}


            </div>
{/* 
            <div>
              <Button
                fullWidth
                className="mt-8 md:w-full md:ml-44 w-64 ml-4"
                loading={isLoading}
                onClick={submitValidation}
              >
                {params.action === "submit"
                  ? "Submit"
                  : params.action === "update"
                  ? "Request Update"
                  : "Accept Update"}
              </Button>
            </div> */}
          {/* </form> */}
          <Outlet/>
        </Card>
      </div>
      
    </>
  );
}



export {
  Chemical,
  Electronics,
  Metal,
  Mineral,
  Others,
  IndustrialForm
}
