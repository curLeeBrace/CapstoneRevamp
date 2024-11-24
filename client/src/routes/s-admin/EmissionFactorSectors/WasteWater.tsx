import {
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { Fragment, useEffect, useState } from "react";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import Skeleton from "../../../Components/Skeleton";

type EmissionFactors = {
  uncollected : {
    percapitaBODgeneration_perday : number;
    percapitaBODgeneration_peryear : number;
    cfi_BOD_dischargersSewer : number;
    methane_correction_factor : {
      septic_tanks: number;
      openPits_latrines: {
        cat1: number;
        cat2: number;
        cat3: number;
        cat4: number;
      };
      riverDischarge: {
        cat1: number;
        cat2: number;
      };

    }

  }
  max_ch4Production : number; 
  
};

type FormType = "residential" | "commercial";

export default function WasteWaterEmissions() {
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState<FormType>("residential");



  const [emissionFactors, setEmissionFactors] = useState<EmissionFactors>();
  /*
    {
    uncollected : {
      cfi_BOD_dischargersSewer : 0,
      percapitaBODgeneration_perday : 0,
      percapitaBODgeneration_peryear : 0,
      methane_correction_factor : {
        septic_tanks : 0,
        openPits_latrines : {
          cat1 : 0,
            cat2 : 0,
            cat3 : 0,
            cat4 : 0,
        },
        riverDischarge : {
            cat1 : 0,
            cat2 : 0
        }
        
      }
    },
    max_ch4Production : 0,
  }
  
  */

  const axiosPrivate = useAxiosPrivate();


  useEffect(()=>{
    axiosPrivate.get(`efactor/waste-water/get-efactor/${formType}`)
    .then(res => {
        const eFactors = res.data as EmissionFactors;

        setEmissionFactors(eFactors);
    })
    .catch(err => console.log(err));


  },[formType])



  console.log("Emisison Factors", emissionFactors);






  const handleFuelTypeChange = (value: string | undefined) => {
    const formType =
      value === "residential" || value === "commercial" ? value : "residential";
    setFormType(formType);
    // setEmissionFactors(defaultEmissionFactors[formType]);
  };


  // const handleFactorChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   category: keyof EmissionFactors,
  //   subCategory?: string
  // ) => {
  //   const { value } = e.target;
  //   const parsedValue = parseFloat(value);
  //   if(parsedValue >= 0 && parsedValue <= 100 || value == ''){

  //       setEmissionFactors((prev) => {
  //         if (subCategory) {
  //           // Ensure the property being spread is an object
  //           const nestedCategory = prev[category] as Record<string, number>;
    
  //           return {
  //             ...prev,
  //             [category]: {
  //               ...nestedCategory,
  //               [subCategory]: parsedValue,
  //             },
  //           };
  //         }
  //         return {
  //           ...prev,
  //           [category]: parsedValue,
  //         };
  //       });
  //   } else {
  //       alert("Invalid Input!!")
  //   }

  // };






  //can be reusable...
  // Utility function to update deeply nested objects
  const updateNestedValue = (
    obj: any,
    keys: string[],
    value: any
  ): Record<string, any> => {
    if (keys.length === 1) {
      return { ...obj, [keys[0]]: value };
    }
    const [key, ...restKeys] = keys;
    return {
      ...obj,
      [key]: updateNestedValue(obj[key], restKeys, value),
    };
  };



  const handleFactorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    keys: string[]
  ) => {
    const { value } = e.target;
    const parsedValue = parseFloat(value);
    if(parsedValue >= 0 && parsedValue <= 100 || value == ''){
      setEmissionFactors((prev) =>
        updateNestedValue(prev, keys, value) as EmissionFactors
      );

    } else {
      alert("Invalid Input!!")
    }

  }
//////////////////////////////////////////////

// console.log("Emmision Factor : ", emissionFactors);
const handleSubmit = () => {

  setIsLoading(true);

  axiosPrivate.put('efactor/waste-water/update-efactor', {
    surveyType : formType,
    emissionFactors : emissionFactors
  })
  .then(res => alert(res.data))
  .catch(err => console.log(err))
  .finally(()=>setIsLoading(false))




}


  return (
    <div className="border p-2 rounded-lg bg-gray-100 ">
      <form className="flex flex-col gap-4 mx-4">
        <Typography variant="h6" className="mb-4">
          Update Waste Water Emission Factors
        </Typography>
        <Select
          label="Select Survey Type"
          value={formType}
          onChange={handleFuelTypeChange}
        >
          <Option value="residential">Residential</Option>
          <Option value="commercial">Commercial</Option>
        </Select>


        {emissionFactors ? 
        
 

          <div className="flex flex-col w-full gap-5">
            <div>
              <div className="flex gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md">
                <div>
                  <InformationCircleIcon className="w-8 h-8" color="white" />
                </div>
                <Typography color="white" className="self-center" variant="h6">
                  General Waste Water Default and Custom Data
                </Typography>
              </div>

              <div className="mt-5 ml-2 gap- flex flex-col">
                <Typography variant="small" className="font-bold text-base">
                  Per capita BOD generation (per day)
                </Typography>
                <div className="flex gap-2">
                  <div className="basis-3/4 shrink-0">
                    <Input
                      value={emissionFactors.uncollected.percapitaBODgeneration_perday}
                      onChange={(e)=>handleFactorChange(e, ["uncollected","percapitaBODgeneration_perday"])}
                      type="number"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>
                  <div className="basis-1/6 self-end">
                    <Typography
                      variant="small"
                      className="font-extralight text-base"
                    >
                      gBOD/person/day
                    </Typography>
                  </div>
                </div>
                <Typography variant="small" className="font-bold text-base">
                  Per capita BOD generation (per year)
                </Typography>
                <div className="flex gap-2">
                  <div className="basis-3/4 shrink-0">
                    <Input
                    value={(emissionFactors.uncollected.percapitaBODgeneration_perday*365)/1000}
                  //    onChange={(e)=>handleFactorChange(e, "percapitaBODgeneration_peryear")}
                      type="number"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      disabled
                    />
                  </div>
                  <div className="basis-1/6 self-end">
                    <Typography
                      variant="small"
                      className="font-extralight text-base"
                    >
                      kgBOD/person/year
                    </Typography>
                  </div>
                </div>
                <Typography variant="small" className="font-bold text-base">
                  Correction factor for industrial BOD dischargers in sewers
                </Typography>
                <div className="flex gap-2">
                  <div className="basis-3/4 shrink-0">
                    <Input
                      value={emissionFactors.uncollected.cfi_BOD_dischargersSewer}
                      onChange={(e)=>handleFactorChange(e, ["uncollected","cfi_BOD_dischargersSewer"])}
                      type="number"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>
                  <div className="basis-1/6 self-end">
                    <Typography
                      variant="small"
                      className="font-extralight text-base"
                    >
                      index
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md">
                <div>
                  <InformationCircleIcon className="w-8 h-8" color="white" />
                </div>
                <Typography color="white" className="self-center" variant="h6">
                  Wastewater CH4 Emissions Factor Calculation
                </Typography>
              </div>

              <div className="flex-col flex mt-5">
                <Typography variant="small" className="font-bold text-base">
                  Max CH4 Production Capacity
                </Typography>
                <div className="flex gap-2">
                  <div className="basis-3/4 shrink-0">
                    <Input
                      value={emissionFactors.max_ch4Production}
                      onChange={(e)=>handleFactorChange(e, ["max_ch4Production"])}
                      type="number"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>
                  <div className="basis-1/6 self-end">
                    <Typography
                      variant="small"
                      className="font-extralight text-base"
                    >
                      kgCH4/kgBOD
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-around my-5">
                    <div>
                      <Typography variant="h1" className="font-bold text-base">
                        Methane Correction Factor
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h1" className="font-bold text-base">
                        Emmisison Factor
                      </Typography>
                    </div>
                  </div>

                  <div>
                    <Typography variant="small" className="font-bold text-base">
                      Septic Tanks
                    </Typography>

                    <div className="flex gap-2 w-full">
                      <div className="basis-1/2">
                        <Input
                          type="number"
                          value={emissionFactors.uncollected.methane_correction_factor.septic_tanks}
                          onChange={(e) => handleFactorChange(e, ["uncollected","methane_correction_factor","septic_tanks"])}
                          placeholder="Septic Tanks"
                          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                        />
                      </div>
                      <div className="basis-1/2 self-end">
                        <Typography
                          variant="small"
                          className="font-bold text-base text-center"
                        >
                          {isNaN(emissionFactors.max_ch4Production * emissionFactors.uncollected.methane_correction_factor.septic_tanks) ? 0 : (emissionFactors.max_ch4Production * emissionFactors.uncollected.methane_correction_factor.septic_tanks).toFixed(2)}

                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Open Pits / Latrines */}
                    <Typography
                      variant="small"
                      className="font-bold text-base mt-4"
                    >
                      Open Pits / Latrines
                    </Typography>

                    
                      {Object.entries(emissionFactors.uncollected.methane_correction_factor.openPits_latrines).map(
                        ([key, value]) => (
                          <Fragment  key={key}>
                              <Typography variant="small" className="text-gray-500">
                                  {key.toUpperCase()}
                              </Typography>

                              <div className="flex gap-2 w-full">
                                  <div className="basis-1/2 self-end">
                                      <Input
                                          type="number"
                                          value={value}
                                          onChange={(e) =>
                                          handleFactorChange(e, ["uncollected","methane_correction_factor", "openPits_latrines" ,key],)
                                          }
                                          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                          labelProps={{
                                          className:
                                              "before:content-none after:content-none",
                                          }}
                                      />
                                  
                                  </div>

                                  <div className="basis-1/2 self-end">
                                      <Typography
                                          variant="small"
                                          className="font-bold text-base text-center"
                                      >
                                          {isNaN(emissionFactors.max_ch4Production * value) ? 0 : (emissionFactors.max_ch4Production * value).toFixed(2)}
                                      </Typography>
                                  </div>

                              </div>
                            
                          

                          
                          </Fragment>
                        )
                      )}
                  
                  </div>


                  <div>
                    {/*River Discharge  */}
                    <Typography
                      variant="small"
                      className="font-bold text-base mt-4"
                    >
                      River Discharge 
                    </Typography>

                    
                      {Object.entries(emissionFactors.uncollected.methane_correction_factor.riverDischarge).map(
                        ([key, value]) => (
                          <Fragment  key={key}>
                              <Typography variant="small" className="text-gray-500">
                                  {key.toUpperCase()}
                              </Typography>

                              <div className="flex gap-2 w-full">
                                  <div className="basis-1/2 self-end">
                                      <Input
                                          type="number"
                                          value={value}
                                          onChange={(e) =>
                                            handleFactorChange(e, ["uncollected","methane_correction_factor", "riverDischarge", key],)
                                          }
                                          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                          labelProps={{
                                          className:
                                              "before:content-none after:content-none",
                                          }}
                                      />
                                  
                                  </div>

                                  <div className="basis-1/2 self-end">
                                      <Typography
                                          variant="small"
                                          className="font-bold text-base text-center"
                                      >
                                        {isNaN(emissionFactors.max_ch4Production * value) ? 0 : (emissionFactors.max_ch4Production * value).toFixed(2)}
                                      </Typography>
                                  </div>

                              </div>
                            
                          

                          
                          </Fragment>
                        )
                      )}
                  
                  </div>
                
                </div>
              </div>
            </div>
          </div>
          :<Skeleton/>
        }

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
          <LockClosedIcon className="-mt-0.5 h-4 w-4" /> Press submit to apply
          changes.
        </Typography>
      </form>
    </div>
  );
}
