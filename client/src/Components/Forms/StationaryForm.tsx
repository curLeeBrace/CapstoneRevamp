import { useEffect, useState } from 'react';
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import useHandleChange from '../../custom-hooks/useHandleChange';
import AlertBox from './AlertBox';
export function StationaryForm() {
//  // State for "Form Scope" checkboxes
//  const [selectedScope, setSelectedScope] = useState<number | null>(null);

//  // State for "Fuel Type" checkboxes
//  const [selectedFuelType, setSelectedFuelType] = useState<number | null>(null);

//   // Function to handle selection in "Form Scope" checkboxes
//   const handleScopeChange = (scopeId: number) => {
//     setSelectedScope(scopeId);
//   };

//   // Function to handle selection in "Fuel Type" checkboxes
//   const handleFuelTypeChange = (fuelTypeId: number) => {
//     setSelectedFuelType(fuelTypeId);
//   };

const handleChange = useHandleChange; 
const [formData, setFormData] = useState({
  form_type : "",
  vehicle_type : "",
  vehicle_age : "",
  fuel_type : "",
  liters_consumption :"",
  date : "",
});
const [isLoading, set_isLoading] = useState<boolean>(false);
const [openAlert, setOpenAlert] = useState<boolean>(false);



console.log(formData);


  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gradient-to-t from-green-400 via-green-200 to-slate-50">

      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 shadow-2xl rounded-xl">
            
             <AlertBox openAlert = {openAlert}  setOpenAlert={setOpenAlert}  message='eyy'/>
        
        <Typography variant="h4" color="blue-gray" className="text-center">
          Stationary Fuel Combustion Form
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

            <div>
              <Typography variant="h6" color="blue-gray">
                Form Type
              </Typography>
              <Checkbox
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
              <Typography variant="h6" color="blue-gray">
                Vehicle Type
              </Typography>
              <Input
                name='vehicle_type'
                value = {formData.vehicle_type}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type='text'
                size="lg"
                placeholder="Tricycle, Motor, Jeep, etc."
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray" className="mt-2">
                Vehicle Age
              </Typography>
              <Input
               name='vehicle_age'
               value = {formData.vehicle_age}
               onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Age of Vehicle"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              />
            </div>
            
         
          

          {/* Column 2 */}
          
            <div>
              <Typography variant="h6" color="blue-gray">
                Fuel Type
              </Typography>
              <Checkbox
                name='fuel_type'
                value={'diesel'}
                checked={formData.fuel_type === "diesel"} // Checked if this is selected
                onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
                label={
                  <Typography variant="small" color="gray" className="mr-4">
                    Diesel
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Checkbox
              
              name='fuel_type'
              value={'gasoline'}
              checked={formData.fuel_type === "gasoline"} // Checked if this is selected
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
                Consumption of Fuel (in Liters)
              </Typography>
              <Input
                 name='liters_consumption'
                 value = {formData.liters_consumption}
                 onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
              />
            </div>

            </div>

           
          

          {/* Full-width elements */}
          <div className="md:col-span-2">
            <Button 
              fullWidth className="mt-6"
              loading = {isLoading}
              onClick={()=>setOpenAlert(true)}
            >
              Submit
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
