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
import MobileCombustionEmissions from "./EmissionFactorSectors/MobileCombustion";
import WasteWaterEmissions from "./EmissionFactorSectors/WasteWater";
import IndustrialEmissions from "./EmissionFactorSectors/Industrial";
import AgricultureEmissions from "./EmissionFactorSectors/Agriculture";
import StationaryEmissions from "./EmissionFactorSectors/Stationary";
import Forestry from "./EmissionFactorSectors/Forestry";

 
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
  <TabsHeader className="relative z-0 grid grid-cols-3 gap-3">
      <Tab
        value="mobile-combustion"
        onClick={() => setType("mobile-combustion")}
        className={type === "mobile-combustion" ? "font-bold text-darkgreen" : ""}
      >
        Mobile Combustion
      </Tab>
      <Tab
        value="waste-water"
        onClick={() => setType("waste-water")}
        className={type === "waste-water" ? "font-bold text-darkgreen" : ""}
      >
        Waste Water
      </Tab>
      <Tab
        value="industrial"
        onClick={() => setType("industrial")}
        className={type === "industrial" ? "font-bold text-darkgreen" : ""}
      >
        Industrial
      </Tab>
      <Tab
        value="agriculture"
        onClick={() => setType("agriculture")}
        className={type === "agriculture" ? "font-bold text-darkgreen" : ""}
      >
        Agriculture
      </Tab>
      <Tab
        value="stationary"
        onClick={() => setType("stationary")}
        className={type === "stationary" ? "font-bold text-darkgreen" : ""}
      >
        Stationary
      </Tab>
      <Tab
        value="forestry"
        onClick={() => setType("forestry")}
        className={type === "forestry" ? "font-bold text-darkgreen" : ""}
      >
        Forestry
      </Tab>
    </TabsHeader>
    <TabsBody
  className="!overflow-x-hidden !overflow-y-visible"
  animate={{
    initial: { x: type === "card" ? 400 : -400 },
    mount: { x: 0 },
    unmount: { x: type === "card" ? 400 : -400 },
  }}
>
  {type === "mobile-combustion" && (
    <TabPanel value="mobile-combustion">
      <MobileCombustionEmissions />
    </TabPanel>
  )}
  {type === "waste-water" && (
    <TabPanel value="waste-water">
      <WasteWaterEmissions />
    </TabPanel>
  )}
  {type === "industrial" && (
    <TabPanel value="industrial">
      <IndustrialEmissions />
    </TabPanel>
  )}
  {type === "agriculture" && (
    <TabPanel value="agriculture">
      <AgricultureEmissions />
    </TabPanel>
  )}
  {type === "stationary" && (
    <TabPanel value="stationary">
      <StationaryEmissions />
    </TabPanel>
  )}
   {type === "forestry" && (
    <TabPanel value="forestry">
      <Forestry />
    </TabPanel>
  )}
</TabsBody>
  </Tabs>

      </CardBody>
    </Card>
    </div>
  );
}