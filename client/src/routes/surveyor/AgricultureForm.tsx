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
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");
  const user_info = useUserInfo();
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const {state} = useLocation();


  const [selectedType, setSelectedType] = useState<string>("mineral");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value);
  };


    
const submitValidation = () => {
  
  }

  



  return (
    <>
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden">
       <AlertBox openAlert = {openAlert}  setOpenAlert={setOpenAlert}  message={alert_msg}/>

       <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-2/3 px-6 py-6 -mt-10 shadow-black shadow-2xl rounded-xl relative gap-5">
       <Typography variant="h4" color="blue-gray" className="text-center">
        Agriculture Survey
      </Typography>
      
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
        
    <div className="w-64">
     <BrgyMenu disabled = {params.action === "view"} municipality_code= {user_info.municipality_code} setBrgys={setBrgy} deafult_brgyName={state && state.brgy_name}/>
    
    </div>
    
          
                {/* CROPS*/}
     
            <div className="relative">
            <div className="relative mb-4 w-2/3 whitespace-nowrap">
            <Typography className=" text-md font-bold mb-4 whitespace-normal text-lg">
             Crops
              </Typography>
          

              <div className="md:grid md:grid-rows-4 md:grid-flow-col md:mt-2 md:gap-x-6 gap-y-2 flex flex-col"> 

              <Typography className=" text-md whitespace-nowrap mt-2 mr-2">
              Dry Season, Irrigated (Has)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

            <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
              Dry Season, Rainfed (Has)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
         
              <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
             Wet Season, Irrigated (Has)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                 className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
              Wet Season, Rainfed (Has)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
     
          <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
              Crops Residue (Tons)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-10 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

          <Typography className=" text-md md:whitespace-nowrap mr-2 mt-2 whitespace-normal">
              Dolomite and or Limestone Consumption (Kg)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-10 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
   
            </div>
            <Typography className=" text-md font-bold mb-4 whitespace-normal text-lg mt-6">
            Livestock
              </Typography>

              
              <div className="md:grid md:grid-rows-4 md:grid-flow-col md:mt-2 md:gap-x-6 gap-y-2 flex flex-col"> 

              <Typography className=" text-md whitespace-nowrap mt-2 mr-2">
              Dairy Cattle (Heads)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

            <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
              Swine (Heads)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
         
              <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
             Non-Dairy Cattle (Heads)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                 className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
             Horse(Heads)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
     
          <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
              Buffalo (Heads)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-10 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

          <Typography className=" text-md md:whitespace-nowrap mr-2 mt-2 whitespace-normal">
              Goat (Heads)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-10 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

          <Typography className=" text-md md:whitespace-nowrap mr-2 mt-2 whitespace-normal">
              Poultry (Heads)
              </Typography>
              <Input
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-10 mt-2 w-52"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
           
          </div>
          </div>
        
        </div>

        <div >
        <Button 
                fullWidth 
                className="mt-8 md:w-full md:ml-44 w-64 ml-4"
                loading = {isLoading}
                onClick={submitValidation}
                >
                  {
                    params.action === "submit" ?
                    "Submit"
                    : params.action === "update" ?
                    "Request Update"
                    : "Accept Update"
                  }
                </Button>
                </div>
        
      </form>
    </Card>
    </div>
    </>
  );
}