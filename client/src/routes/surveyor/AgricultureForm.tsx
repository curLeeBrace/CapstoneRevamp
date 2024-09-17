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
export function AgricultureForm() {
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
          Agriculture Survey
        </Typography>

        <form className="mt-8 mb-2 max-w-screen-lg w-full">
          {/* Barangay Menu */}
          <div className="mb-6 w-56">
            <BrgyMenu
              disabled={params.action === "view"}
              municipality_code={user_info.municipality_code}
              setBrgys={setBrgy}
              deafult_brgyName={state && state.brgy_name}
            />
          </div>

          {/* Crops Section */}
          <Typography className="text-md font-bold mb-4 text-lg">Crops</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Dry Season, Irrigated (Has)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Dry Season, Rainfed (Has)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Wet Season, Irrigated (Has)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Wet Season, Rainfed (Has)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Crops Residue (Tons)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Dolomite and/or Limestone Consumption (Kg)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* Livestock Section */}
          <Typography className="text-md font-bold mb-4 text-lg mt-8">Livestock</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Dairy Cattle (Heads)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Swine (Heads)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Non-Dairy Cattle (Heads)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Horse (Heads)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Buffalo (Heads)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Goat (Heads)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Poultry (Heads)</Typography>
              <Input
                type="number"
                placeholder="0"
                className="w-full"
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
