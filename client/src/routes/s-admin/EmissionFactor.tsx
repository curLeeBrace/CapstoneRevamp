import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import WasteWater from "./EmissionFactorSectors/WasteWater";
import MobileCombustion from "./EmissionFactorSectors/MobileCombustion";

 
export default function CheckoutForm() {
  const [type, setType] = React.useState("mobile-combustion");

 
  return (
    <div className="mx-auto my-2 w-full max-w-[50rem]">
    <Card className="mx-4 rounded-lg border-2 border-gray-300">
      <CardHeader
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center px-4 py-8 text-center bg-darkgreen rounded-lg"
      >
        
        <Typography variant="h5" color="white">
            Update Emission Factor       
        </Typography>
      </CardHeader>
      <CardBody>
        <Tabs value={type} className="">
          <TabsHeader className="relative z-0 grid grid-cols-3 gap-3 ">
            <Tab value="mobile-combustion" onClick={() => setType("mobile-combustion")}>
              Mobile Combustion
            </Tab>
            <Tab value="waste-water" onClick={() => setType("waste-water")}>
              Waste Water
            </Tab>
            <Tab value="industrial" onClick={() => setType("industrial")}>
              Industrial
            </Tab>
            <Tab value="agriculture" onClick={() => setType("agriculture")}>
              Agriculture
            </Tab>
            <Tab value="stationary" onClick={() => setType("waste-water")}>
              Stationary
            </Tab>
            
          </TabsHeader>
          <TabsBody
            className="!overflow-x-hidden !overflow-y-visible"
            animate={{
              initial: {
                x: type === "card" ? 400 : -400,
              },
              mount: {
                x: 0,
              },
              unmount: {
                x: type === "card" ? 400 : -400,
              },
            }}
          >
            <TabPanel value="mobile-combustion" className="p-0">
             <MobileCombustion/>
            </TabPanel>

            <TabPanel value="waste-water" className="p-0">
             <WasteWater/>
            </TabPanel>
            
            <TabPanel value="industrial" className="p-0">
             <WasteWater/>
            </TabPanel>

            <TabPanel value="agriculture" className="p-0">
             <WasteWater/>
            </TabPanel>
            
            <TabPanel value="stationary" className="p-0">
             <WasteWater/>
            </TabPanel>

          </TabsBody>
        </Tabs>
      </CardBody>
    </Card>
    </div>
  );
}