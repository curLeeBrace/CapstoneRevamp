import {useEffect, useState } from 'react';
import { Card, Input, Checkbox, Button, Typography, Select, Option} from "@material-tailwind/react";
import useHandleChange from '../../custom-hooks/useHandleChange';
import AlertBox from './AlertBox';
import Cookies from 'js-cookie';
import {user_info} from '../../routes/not-auth/LogIn';
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';
import DialogBox from "../DialogBox";
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import BrgyMenu from '../../custom-hooks/BrgyMenu';
import useUserInfo from '../../custom-hooks/useUserType';
import { AddressReturnDataType } from '../../custom-hooks/useFilterAddrress';


type formDataTypes = {
  form_type : string,
  vehicle_type : string,
  vehicle_age : number,
  fuel_type : string,
  liters_consumption : number,
}
export function StationaryForm() {

const handleChange = useHandleChange; 
const [formData, setFormData] = useState<formDataTypes>({} as formDataTypes);

const [vehicleOptions, setVehicleOptions] = useState<string[]>();
const [isLoading, set_isLoading] = useState<boolean>(false);
const [openAlert, setOpenAlert] = useState<boolean>(false);
const [aler_msg, setAlertMsg] = useState<string>("");
const axiosPivate = useAxiosPrivate();
const [openDialogBox, setOpenDialogBox] = useState(false);
const user_info = useUserInfo();
const [brgy, setBrgy] = useState({} as AddressReturnDataType);









const [searchParams, setSearchParams] = useSearchParams();
const params = useParams()


useEffect(()=>{

    setVehicleOptions(formData.form_type === "residential" ? 
        ["Car", "SUV", "Motorcycle"] : 
      formData.form_type === "commercial" ? 
        ["Jeep", "Tricycle", "Bus", "Van", "Taxi", "Truck"]
      :undefined
    )

    
},[formData.form_type])


useEffect(()=>{
    const {vehicle_age, liters_consumption} = formData

    if(vehicle_age && vehicle_age > 99){
      alert("Vehicle Age Limit Exceeded")
      setFormData({...formData, vehicle_age : 0})
    }
  
    if(liters_consumption && liters_consumption > 999) {
  
      alert("Liters Limit Exceeded")
      setFormData({...formData, liters_consumption : 0})
  }

},[formData?.vehicle_age, formData?.liters_consumption])


console.log("BRGY : ", brgy)




const submitHandler = () => {

  const {email, full_name, municipality_name, municipality_code, province_code} = user_info;
  
  let payload = {
    survey_data : {...formData, brgy_name : brgy.address_name, brgy_code : brgy.address_code},
    surveyor_info : {
      email,
      full_name,
      municipality_name,
      municipality_code,
      province_code
    },
    dateTime_created : new Date(),
    dateTime_edited : null,
  }



   setOpenDialogBox(false)
    set_isLoading(true);
    axiosPivate.post('/forms/fuel/insert', payload)
    .then(res => {
        if(res.status === 201){
          
          setOpenAlert(true);
          setAlertMsg("Sucsessfully Submitted!");
          setFormData({
            form_type : "",
            vehicle_type : "",
            vehicle_age : 0,
            fuel_type : "",
            liters_consumption : 0,
          })
        }

      set_isLoading(false);
    })
    .catch(err => {
      console.log(err)
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Server Error!");
    })

}



const submitValidation = () => {
    const {form_type, fuel_type, liters_consumption, vehicle_age, vehicle_type} = formData
    if(form_type && fuel_type &&  liters_consumption && vehicle_age && vehicle_type && brgy){
 
      setOpenDialogBox(true);
    } else {
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Some field are empty!");
    }

    
}



  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gray-200">

      <DialogBox open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={submitHandler} />

      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 -mt-10 shadow-black shadow-2xl rounded-xl relative">
            
             <AlertBox openAlert = {openAlert}  setOpenAlert={setOpenAlert}  message={aler_msg}/>
        
        <Typography variant="h4" color="blue-gray" className="text-center">
          Mobile Combustion Form
        </Typography>

        <div className="mt-8 grid grid-cols-1 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            {/* <div>
              <Typography variant="h6" color="blue-gray">
                Data Source
              </Typography>
              <Input
                size="lg"
                placeholder="example: Rob Busto"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              />
            </div> */}
            <BrgyMenu municipality_code= {user_info.municipality_code} setBrgys={setBrgy}/>
            <div>
              <Typography variant="h6" color="blue-gray">
                Form Type
              </Typography>
              <Checkbox
                disabled = {params.action === "view"}
                name='form_type'
                value={'residential'}
                checked={formData.form_type === "residential"} // Checked if this is selected
                onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
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
                checked={formData.form_type === "commercial"} // Checked if this is selected
                onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
    
                label={
                  <Typography variant="small" color="gray" className="font-normal">
                    Commercial
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              
            </div>


            <div>
              {/* <Typography variant="h6" color="blue-gray">
                Vehicle Type
              </Typography> */}
       
              <Select 
                 color="gray" label="Vehicle Type"
                 name='fuel_type'
                 onChange={(value : any) => setFormData({...formData, vehicle_type : value})}
                 disabled = {vehicleOptions === undefined && params.action === "view"}
              >
                 {
                  vehicleOptions ? 
                  vehicleOptions?.map((v_type, index) => (
                    <Option key={index} value={v_type}>
                      {v_type}
                    </Option>
                   ))
                   : <Option value=''> </Option>
                 }
 
              </Select>
              
            
              {/* <Input
                name='vehicle_type'
                value = {formData.vehicle_type}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type='text'
                size="lg"
                placeholder="Tricycle, Motor, Jeep, etc."
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              /> */}
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mt-2">
                Vehicle Age
              </Typography>
              <Input
              disabled = {params.action === "view"}
               name='vehicle_age'
               value = {formData.vehicle_age}
               onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Age of Vehicle"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                maxLength={2}
                min={0}
                max={99}
              />
            </div>
            
         
          

          {/* Column 2 */}
          
            <div>
              <Typography variant="h6" color="blue-gray">
                Fuel Type
              </Typography>
              <Checkbox
                disabled={params.action === "view"}
                name='fuel_type'
                value={'diesel'}
                checked={formData?.fuel_type === "diesel"} // Checked if this is selected
                onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
                
                label={
                  <Typography variant="small" color="gray" className="mr-4">
                    Diesel
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Checkbox
              disabled ={params.action === "view"}
              name='fuel_type'
              value={'gasoline'}
              checked={formData?.fuel_type === "gasoline"} // Checked if this is selected
              onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
                label={
                  <Typography variant="small" color="gray">
                    Gasoline
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
            </div>

            <div>
              <Typography variant="h6" color="blue-gray">
                Fuel Consumption in a whole day - (liters)
              </Typography>
              <Input
                disabled= {params.action === "view"}
                 name='liters_consumption'
                 value = {formData.liters_consumption}
                 onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                  type="number"
                  size="lg"
                  placeholder="Example: 3"
                  className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                  min={0}
                  max={999}
                  maxLength={3}
              />
            </div>

            </div>

           
          

          {/* Full-width elements */}
          <div className="md:col-span-2">
            <Button 
              fullWidth 
              className="mt-6 flex justify-center"
              loading = {isLoading}
              onClick={submitValidation}
              disabled = {params.action === "view"  }
            
            >
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
