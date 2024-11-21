import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Select, Option, Typography, Input, Button } from "@material-tailwind/react";
import { useState } from "react";

type EmissionFactor = {
  co2: number;
  ch4: number;
  n2o: number;
};

type EmissionEntry = {
  label: string;
  factor: EmissionFactor;
};

type AgricultureType = "crops" | "livestock";

const defaultEmissionData: Record<AgricultureType, EmissionEntry[]> = {
  crops: [
    { label: "Crop Residues", factor: { co2: 8, ch4: 0, n2o: 0.19 } },
    { label: "Dry Season, Irrigated", factor: { co2: 0, ch4: 120, n2o: 0 } },
    { label: "Dry Season, Rainfed", factor: { co2: 0, ch4: 52, n2o: 0 } },
    { label: "Wet Season, Irrigated", factor: { co2: 0, ch4: 326, n2o: 0 } },
    { label: "Wet Season, Rainfed", factor: { co2: 0, ch4: 139, n2o: 0 } },
    { label: "Other Crop Type", factor: { co2: 0, ch4: 0, n2o: 3.14 } },
  ],
  livestock: [
    { label: "Buffalo", factor: { co2: 0, ch4: 57, n2o: 1.25 } },
    { label: "Cattle", factor: { co2: 0, ch4: 48, n2o: 1.47 } },
    { label: "Goat", factor: { co2: 0, ch4: 5.22, n2o: 0.35 } },
    { label: "Horse", factor: { co2: 0, ch4: 20.19, n2o: 0 } },
    { label: "Poultry", factor: { co2: 0, ch4: 0.02, n2o: 0.03 } },
    { label: "Swine", factor: { co2: 0, ch4: 8, n2o: 0.76 } },
    { label: "Other", factor: { co2: 0, ch4: 0, n2o: 0 } },
  ],
};

export default function UpdateEmissionFactors() {
  const [agricultureType, setAgricultureType] = useState<AgricultureType>("crops");
  const [emissionData, setEmissionData] = useState<EmissionEntry[]>(defaultEmissionData[agricultureType]);
  const [isLoading, ] = useState(false);
 
  const handleTypeChange = (value: string | undefined) => {
    const validType: AgricultureType = (value as AgricultureType) || "crops";
    setAgricultureType(validType);
    setEmissionData([...defaultEmissionData[validType]]);
  };

  const handleFactorChange = (index: number, field: keyof EmissionFactor, value: string) => {
    setEmissionData((prev) => {
      const updated = [...prev];
      updated[index].factor[field] = Number(value);
      return updated;
    });
  };



  return (
    <div className="p-4">
      <Typography variant="h6" className="mb-4">
        Update Agriculture Emission Factors
      </Typography>
      <Select
        label="Select Agriculture Type"
        value={agricultureType}
        onChange={(value) => handleTypeChange(value)}
        className=""
      >
        <Option value="crops">Crops</Option>
        <Option value="livestock">Livestock</Option>
      </Select>
      <div className="mb-4 mt-4">
        {emissionData.map((entry, index) => (
          <div key={index} className="mb-4 border p-2 rounded-lg bg-gray-100 ">
            <Typography variant="small" className="font-bold mb-2">
              {entry.label}
            </Typography>
            <div className="md:flex md:gap-4">
              <div>
                <Typography className="block mb-1">CO2</Typography>
                <Input
                  type="number"
                  value={entry.factor.co2}
                  onChange={(e) => handleFactorChange(index, "co2", e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div>
              <Typography className="block mb-1">CH4</Typography>
              <Input
                  type="number"
                  value={entry.factor.ch4}
                  onChange={(e) => handleFactorChange(index, "ch4", e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
              <div>
              <Typography className="block mb-1">N20</Typography>
              <Input
                  type="number"
                  value={entry.factor.n2o}
                  onChange={(e) => handleFactorChange(index, "n2o", e.target.value)}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              </div>
            </div>
          </div>
          
        ))}
          <div className="flex justify-center">
                    <Button fullWidth className="w-full md:w-11/12" disabled={isLoading} >
                        {isLoading ? "Updating..." : "Submit"}
                    </Button>
                </div>
          <div className="flex justify-center">
          
                </div>
                <Typography
                    variant="small"
                    color="gray"
                    className="mt-2 flex items-center justify-center gap-2 font-medium opacity-60"
                >
                    <LockClosedIcon className="-mt-0.5 h-4 w-4" /> Press submit to apply changes.
                </Typography>
      </div>
   
    </div>
  );
}
