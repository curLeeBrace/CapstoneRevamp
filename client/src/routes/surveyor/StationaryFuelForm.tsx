import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AlertBox from "../../Components/Forms/AlertBox";
import useUserInfo from "../../custom-hooks/useUserType";
import BrgyMenu from "../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";

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
export function StationaryFuelForm() {
  const params = useParams();
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");
  const user_info = useUserInfo();
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const { state } = useLocation();

  const submitValidation = () => {
    // validation logic here
  };

  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden">
      <AlertBox openAlert={openAlert} setOpenAlert={setOpenAlert} message={alert_msg} />

      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-2/3 px-6 py-6 shadow-black shadow-2xl rounded-xl">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Stationary Fuel Consumption Survey
        </Typography>

        <form className="mt-8 mb-2 max-w-screen-lg w-full">
        <Typography className="text-md font-bold text-lg">Form Type</Typography>
        <Checkbox
              disabled = {params.action === "view"}
              name='form_type'
              value={'residential'}
             
              label={
                <Typography variant="small" color="gray" className="font-normal mr-4">
                  Residential
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}

            />
              <Checkbox
              disabled = {params.action === "view"}
              name='form_type'
              value={'commercial'}
              
             
              // onChange={(event) => handleChange({ })} // Handler for selection
              label={
                <Typography variant="small" color="gray" className="font-normal mr-4">
                  Commercial
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}

            />
          {/* Barangay Menu */}
          <div className="my-6 w-56">
            <BrgyMenu
              disabled={params.action === "view"}
              municipality_code={user_info.municipality_code}
              setBrgys={setBrgy}
              deafult_brgyName={state && state.brgy_name}
            />
          </div>

          {/* COOKING Section */}
          <Typography className="text-md font-bold mb-4 text-lg">Cooking</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Charcoal (Kilogram)</Typography>
              <Input
                type="number"
                placeholder="0"
                 className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Diesel (Liters)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Kerosene (Liters)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Propane/LPG (Kilogram)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Wood or Wood Waste (Kilogram)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* GENERATOR Section */}
          <Typography className="text-md font-bold mb-4 text-lg mt-8">Generator</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Motor Gasoline (Liters)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Diesel (Liters)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Kerosene (Liters)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Residual Fuel Oil (Liters)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            
          </div>

          
          {/* LIGHTING Section */}
          <Typography className="text-md font-bold mb-4 text-lg mt-8">Lighting</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Kerosene (Liters)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              fullWidth
              className="w-64 md:w-full"
              loading={isLoading}
              onClick={submitValidation}
            >
              {params.action === "submit" ? "Submit" : params.action === "update" ? "Request Update" : "Accept Update"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
