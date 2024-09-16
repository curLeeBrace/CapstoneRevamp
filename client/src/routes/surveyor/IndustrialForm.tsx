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
 
export function IndustrialForm() {
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
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gray-200">
       <AlertBox openAlert = {openAlert}  setOpenAlert={setOpenAlert}  message={alert_msg}/>

       <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-2/3 px-6 py-6 -mt-10 shadow-black shadow-2xl rounded-xl relative gap-5">
       <Typography variant="h4" color="blue-gray" className="text-center">
        Industrial Survey
      </Typography>
      
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
        <Typography className="-mb-3 text-md font-bold text-black">
  Select Industry Type
  </Typography>
      <div className="md:flex md:flex-row gap-5 grid grid-cols-2">
        
        <Checkbox
              disabled = {params.action === "view"}
              name='form_type'
              value={'mineral'}
              checked={selectedType === "mineral"}
              onChange={handleChange}
              label={
                <Typography variant="small" color="gray" className="font-normal mr-4">
                  Mineral
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}

            />
              <Checkbox
              disabled = {params.action === "view"}
              name='form_type'
              value={'chemical'}
              checked={selectedType === "chemical"}
              onChange={handleChange}
             
              // onChange={(event) => handleChange({ })} // Handler for selection
              label={
                <Typography variant="small" color="gray" className="font-normal mr-4">
                  Chemical
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}

            />
              <Checkbox
              disabled = {params.action === "view"}
              name='form_type'
              value={'metal'}
              checked={selectedType === "metal"}
              onChange={handleChange}
             
              label={
                <Typography variant="small" color="gray" className="font-normal mr-4">
                  Metal
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}

            />
            <Checkbox
              disabled = {params.action === "view"}
              name='form_type'
              value={'electronics'}
              checked={selectedType === "electronics"}
              onChange={handleChange}
            
              // onChange={(event) => handleChange({})} // Handler for selection
  
              label={
                <Typography variant="small" color="gray" className="font-normal">
                  Electronics
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
             <Checkbox
              disabled = {params.action === "view"}
              name='form_type'
              value={'others'}
              checked={selectedType === "others"}
              onChange={handleChange}
             
              // onChange={(event) => handleChange({ })} // Handler for selection
              label={
                <Typography variant="small" color="gray" className="font-normal mr-4">
                  Others
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}

            />

            </div>
  
              <div className="md:flex md:flex-row gap-5 grid grid-cols mr-10">
                <BrgyMenu disabled = {params.action === "view"} municipality_code= {user_info.municipality_code} setBrgys={setBrgy} deafult_brgyName={state && state.brgy_name}/>

                <Select label="Data Source Identifier" >
                  <Option>Commercial</Option>
                  <Option>Industrial</Option>
                  <Option>Institutional</Option>
                  <Option>Others</Option>
                </Select>
                
                <Select label="Type of Data" >
                  <Option>Census</Option>
                  <Option>Individual Business Survey</Option>
                  <Option>Others</Option>
                </Select>

                </div>
                      <Typography variant="h4" color="blue-gray" className="">
                        Annual Total Production
                      </Typography>

                      {/* MINERAL FORM TYPE */}
            {selectedType === "mineral" && (
            <div className="relative">
            <div className="relative mb-4 w-2/3 whitespace-nowrap">
            
            <Typography className="-mb-4 text-md">
              Cement Production - Portland (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography className="-mb-4 text-md mt-10">
                Cement Production - Portland (blended)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            
            <div className="md:absolute top-0 left-3/4 md:ml-28 w-2/3 flex flex-col">
              <Typography className="-mb-4 text-md">
                Lime Production (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              <Typography className=" text-md mt-10 ">
                Glass Production (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>
        )}
                {/* CHEMICAL FORM TYPE */}
          {selectedType === "chemical" && (
            <div className="relative">
            <div className="relative mb-4 w-2/3 whitespace-nowrap">
            
            <Typography className="-mb-4 text-md">
              Ammonia Production (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography className="-mb-4 text-md mt-10">
                Soda Ash Production (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            
            <div className="md:absolute top-0 left-3/4 md:ml-28 w-2/3 flex flex-col">
              <Typography className="-mb-4 text-md md:whitespace-nowrap md:mt-0 mt-3">
              Dichloride and Vinyl Chloride Monomer (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              
            </div>
            
            <Typography className=" text-md mt-14 font-bold mb-4">
              Petrochemical and Carbon Black Production
              </Typography>
          

              <div className="md:grid md:grid-rows-4 md:grid-flow-col md:mt-2 md:gap-2 flex flex-col"> 

              <Typography className=" text-md whitespace-nowrap mt-2 mr-2">
              Methanol (tons)
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
              Ethylene (tons)
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
              Ethylene oxide (tons)
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
              Acrylonitrile (tons)
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
              Carbon black (tons)
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
       
        )}
          {/* METAL FORM TYPE  */}
        {selectedType === "metal" && (
            <div className="relative">
            <div className="relative mb-4 w-2/3 whitespace-nowrap">
            
            <Typography className="-mb-4 text-md whitespace-normal">
            Iron and Steel Production from Integrated Facilities (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography className="-mb-4 text-md mt-10 whitespace-normal">
              Iron and Steel Production from Non-integrated Facilities (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
              
            

          </div>
        )}

         {/* ELECTRONICS FORM TYPE */}
         {selectedType === "electronics" && (
            <div className="relative">
            <div className="relative mb-4 w-2/3 whitespace-nowrap">
            
            <Typography className="-mb-4 text-md">
            Integrated circuit of semiconductor (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography className="-mb-4 text-md mt-10">
                TFT Flat Panel Display (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            
            <div className="md:absolute top-0 left-3/4 md:ml-28 w-2/3 flex flex-col">
              <Typography className="-mb-4 text-md">
              Photovoltaics (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              <Typography className=" text-md mt-10 ">
              Heat transfer fluid (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>
        )}

        {/* OTHERS FORM TYPE */}
        {selectedType === "others" && (
            <div className="relative">
            <div className="relative mb-4 w-2/3 whitespace-nowrap">
            
            <Typography className="-mb-4 text-md">
            Pulp and paper industry (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography className="-mb-4 text-md mt-10">
              Food and beverages industry (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            
            <div className="md:absolute top-0 left-3/4 md:ml-28 w-2/3 flex flex-col">
              <Typography className="-mb-4 text-md">
              Other carbon in pulp (tons)
              </Typography>
              <Input
                size="lg"
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              
            </div>
          </div>
        )}

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