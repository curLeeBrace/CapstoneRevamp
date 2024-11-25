import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Select, Option, Typography, Input, Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import Skeleton from "../../../Components/Skeleton";



type EmissionFactor = {
  co2: number;
  ch4: number;
  n2o: number;
};

type StationaryEmissionFactors = {
  [category: string]: {
    [fuelType: string]: EmissionFactor;
  };
};

const STATIONARY_EMISSION_FACTOR: StationaryEmissionFactors = {
  cooking: {
    charcoal: { co2: 3.3, ch4: 0.0059, n2o: 0.0000295 },
    diesel: { co2: 2.66, ch4: 0.0004, n2o: 0.0000218 },
    kerosene: { co2: 2.52, ch4: 0.00035, n2o: 0.000021 },
    propane: { co2: 0.00298, ch4: 0.000000237, n2o: 0.00000000473 },
    wood: { co2: 1.75, ch4: 0.00468, n2o: 0.0000624 },
  },
  generator: {
    motor_gasoline: { co2: 2.27, ch4: 0.000328, n2o: 0.0000197 },
    kerosene: { co2: 2.52, ch4: 0.00035, n2o: 0.000021 },
    diesel: { co2: 2.66, ch4: 0.0004, n2o: 0.0000218 },
    residual_fuelOil: { co2: 2.94, ch4: 0.00038, n2o: 0.0000228 },
  },
  lighting: {
    kerosene: { co2: 2.52, ch4: 0.00035, n2o: 0.000021 },
  },
};

export default function StationaryEmissions() {
  const [category, setCategory] = useState<string>("cooking");
  const [fuelType, setFuelType] = useState<string|undefined>("charcoal");
  const [factors, setFactors] = useState<EmissionFactor>();
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(()=>{

    if(fuelType){

      axiosPrivate.get('/efactor/stationary/get-efactor', {params : {
        category : category,
        fuelType : fuelType
      }})
      .then((res) => setFactors(res.data.e_factors))
      .catch(err => console.log(err));
    }

  },[category, fuelType])

  // console.log("Category : ", category);
  // console.log("FuelType : ", fuelType);


  const handleCategoryChange = (value : any) => {
    setCategory(value);
    // const firstFuelType = Object.keys(STATIONARY_EMISSION_FACTOR[value])[0];
    setFuelType(undefined);
    

  };






  const handleFactorChange = (field: keyof EmissionFactor, value: string) => {
    setFactors((prev : any) => ({
      ...prev,
      [field]: parseFloat(value),
    }));
  };
  
  


  const handleSubmit = ()=> {
    setIsLoading(true);
    axiosPrivate.put('/efactor/stationary/update-efactor', {
      category,
      fuelType,
      e_factor : factors
    })
    .then(res => alert(res.data))
    .catch(err => console.log(err))
    .finally(() => setIsLoading(false))
  }
  

  return (
    <div className=" mx-auto sm:max-w-lg border p-4 rounded-lg bg-gray-100">
      <Typography variant="h5" className="mb-4 text-center">
        Update Stationary Emission Factors
      </Typography>
      
      <div className="flex flex-col gap-4 ">
        {/* Category Selector */}
        <div>
          <Select
            label = "Category"
            value={category}
            onChange={(e) => handleCategoryChange(e)}

          >
            {Object.keys(STATIONARY_EMISSION_FACTOR).map((key) => (
              <Option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Option>
            ))}
          </Select>
        </div>

        {/* Fuel Type Selector */}
        <div>
          <Select
            label = "Fuel"
            value={fuelType}
            onChange={(value)=>setFuelType(value)}
            className="w-full"
            
          >
            {Object.keys(STATIONARY_EMISSION_FACTOR[category]).map((key) => (
              <Option key={key} value={key} >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Option>
            ))}
          </Select>
       
        </div>

        {/* Emission Factors */}
        <div className=" sm:grid-cols-3 gap-4  ">
          {factors && !isLoading? (["co2", "ch4", "n2o"] as (keyof EmissionFactor)[]).map((factor) => (
            <div key={factor}>
              <Typography variant="small" className="font-medium mb-1">
                {factor.toUpperCase()}
              </Typography>
              <Input
                type="number"
                value={factors[factor]}
                onChange={(e) => handleFactorChange(factor, e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 w-36"
                labelProps={{ className: "before:content-none after:content-none" }}
              />
            </div>
          )) : <Skeleton/>}
        </div>
        <div className="flex justify-center">
                    <Button fullWidth className="w-full md:w-11/12" disabled={isLoading} onClick={handleSubmit}>
                        {isLoading ? "Updating..." : "Submit"}
                    </Button>
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





