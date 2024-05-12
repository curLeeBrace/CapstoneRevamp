import { useState } from 'react';
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";


export function StationaryForm() {
 // State for "Form Scope" checkboxes
 const [selectedScope, setSelectedScope] = useState<number | null>(null);

 // State for "Fuel Type" checkboxes
 const [selectedFuelType, setSelectedFuelType] = useState<number | null>(null);

  // Function to handle selection in "Form Scope" checkboxes
  const handleScopeChange = (scopeId: number) => {
    setSelectedScope(scopeId);
  };

  // Function to handle selection in "Fuel Type" checkboxes
  const handleFuelTypeChange = (fuelTypeId: number) => {
    setSelectedFuelType(fuelTypeId);
  };

  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gradient-to-t from-green-400 via-green-200 to-slate-50">
      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 shadow-2xl rounded-xl">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Stationary Fuel Combustion Form
        </Typography>

        <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <div>
              <Typography variant="h6" color="blue-gray">
                Data Source
              </Typography>
              <Input
                size="lg"
                placeholder="example: Rob Busto"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              />
            </div>

            <div>
              <Typography variant="h6" color="blue-gray">
                Vehicle Type
              </Typography>
              <Input
              type='text'
                size="lg"
                placeholder="Tricycle, Motor, Jeep, etc."
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              />
            </div>

            <div>
              <Typography variant="h6" color="blue-gray">
                Form Scope
              </Typography>
              <Checkbox
                checked={selectedScope === 1} // Checked if this is selected
                onChange={() => handleScopeChange(1)} // Handler for selection
                label={
                  <Typography variant="small" color="gray" className="font-normal mr-4">
                    Residential
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}

              />
              <Checkbox
                checked={selectedScope === 2} // Checked if this is selected
                onChange={() => handleScopeChange(2)} // Handler for selection
                label={
                  <Typography variant="small" color="gray" className="font-normal">
                    Commercial
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              
            </div>
            
          </div>
          

          {/* Column 2 */}
          <div className="flex flex-col gap-6"> {/* Second column */}
            <div>
              <Typography variant="h6" color="blue-gray">
                Fuel Type
              </Typography>
              <Checkbox
                checked={selectedFuelType === 3} // Checked if this is selected
                onChange={() => handleFuelTypeChange(3)} // Handler for selection
                label={
                  <Typography variant="small" color="gray" className="mr-4">
                    Diesel
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Checkbox
              
                checked={selectedFuelType === 4} // Checked if this is selected
                onChange={() => handleFuelTypeChange(4)} // Handler for selection
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
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              />
            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mt-2">
                How long does your fuel last? (days)
              </Typography>
              <Input
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              />
            </div>
          </div>

          {/* Full-width elements */}
          <div className="md:col-span-2">
            <Button fullWidth className="mt-6">
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
