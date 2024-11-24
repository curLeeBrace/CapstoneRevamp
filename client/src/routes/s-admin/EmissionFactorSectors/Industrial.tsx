import { Button, Select, Option, Typography, Input } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../custom-hooks/auth_hooks/useAxiosPrivate';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import Skeleton from '../../../Components/Skeleton';

type IndustrialEmissionFactor = {
    CO2?: number;
    CH4?: number;
    CF4?: number;
    C2F6_1st?: number;
    CHF3?: number;
    C3F8?: number;
    C2F6_2nd?: number;
    NF3?: number;
    SF6?: number;
    C6F14?: number;
};



type IndustrialSector = 'chemical' | 'metal' | 'electronics' | 'others' | 'mineral';

// const defaultEmissionFactors: Record<IndustrialSector, IndustrialEmissionFactor[]> = {
    
//     // chemical: {
//     //     CO2: 3,
//     //     CH4: 3,
//     //     CF4: 0,
//     //     C2F6_1st: 0,
//     //     CHF3: 0,
//     //     C3F8: 0,
//     //     C2F6_2nd: 0,
//     //     NF3: 0,
//     //     SF6: 0,
//     //     C6F14: 0,
//     // },
//     // metal: {
//     //     CO2: 4,
//     //     CH4: 4,
//     //     CF4: 0,
//     //     C2F6_1st: 0,
//     //     CHF3: 0,
//     //     C3F8: 0,
//     //     C2F6_2nd: 0,
//     //     NF3: 0,
//     //     SF6: 0,
//     //     C6F14: 0,
//     // },
//     electronics: [
//         {
//             CO2: 0,
//             CH4: 0,
//             CF4: 2,
//             C2F6_1st: 2,
//             CHF3: 2,
//             C3F8: 2,
//             C2F6_2nd: 2,
//             NF3: 2,
//             SF6: 2,
//             C6F14: 0,
//         },
//         {
//             CO2: 0,
//             CH4: 0,
//             CF4: 2,
//             C2F6_1st: 0,
//             CHF3: 0,
//             C3F8: 0,
//             C2F6_2nd: 0,
//             NF3: 2,
//             SF6: 2,
//             C6F14: 2,
//         },
//         {
//             CO2: 0,
//             CH4: 0,
//             CF4: 2,
//             C2F6_1st: 2,
//             CHF3: 0,
//             C3F8: 0,
//             C2F6_2nd: 0,
//             NF3: 0,
//             SF6: 0,
//             C6F14: 0,
//         },
//         {
//             CO2: 0,
//             CH4: 0,
//             CF4: 0,
//             C2F6_1st: 0,
//             CHF3: 0,
//             C3F8: 0,
//             C2F6_2nd: 0,
//             NF3: 0,
//             SF6: 0,
//             C6F14: 2,
//         },
//     ],
//     // others: {
//     //     CO2: 6,
//     //     CH4: 0,
//     //     CF4: 0,
//     //     C2F6_1st: 0,
//     //     CHF3: 0,
//     //     C3F8: 0,
//     //     C2F6_2nd: 0,
//     //     NF3: 0,
//     //     SF6: 0,
//     //     C6F14: 0,
//     // },
//     // mineral: {
//     //     CO2: 2,
//     //     CH4: 0,
//     //     CF4: 0,
//     //     C2F6_1st: 0,
//     //     CHF3: 0,
//     //     C3F8: 0,
//     //     C2F6_2nd: 0,
//     //     NF3: 0,
//     //     SF6: 0,
//     //     C6F14: 0,
//     // },
// };










export default function IndustrialEmissions() {

    // const factorLabels: Record<string, string> = {
    //     1: "Cement Production - Portland (tons)",
    //     2: "Lime Production (tons)",
    //     3: "Cement Production - Portland (blended)",
    //     4: "Glass Production (tons)",
    // };


    
    const [isLoading, setIsLoading] = useState(false);
    const [sector, setSector] = useState<IndustrialSector>('chemical');
    const [emissionFactors, setEmissionFactors] = useState<IndustrialEmissionFactor[]>();
    const [operation, setOperation] = useState<string[]>();
    const axiosPrivate = useAxiosPrivate();




    useEffect(()=>{
        setIsLoading(true)
        if(sector == "mineral") {
            setOperation(["Cement Production - Portland", "Cement Production - Blended", "Lime Production", "Glass Production"])
        } else if (sector == "chemical") {
            setOperation([
                "Ammonia Production", "Soda Ash Production", 
                "Petrochemical and Carbon Black Production - Methanol", 
                "Petrochemical and Carbon Black Production - Ethylene",
                "Petrochemical and Carbon Black Production - Ethylene Dichloride and Vinyl Chloride Monomer",
                "Petrochemical and Carbon Black Production - Ethylene Oxide",
                "Petrochemical and Carbon Black Production - Acrylonitrile",
                "Petrochemical and Carbon Black Production - Carbon Black",
            ])
        } else if (sector == "metal"){
            setOperation(["Iron and Steel Production from Integrated Facilities", "Iron and Steel Production from Non-integrated Facilities"])
        } else if (sector == "electronics") {
            setOperation(["Integrated Circuit or Semiconductor", "TFT Flat Panel Display", "Photovoltaics", "Heat Transfer Fluid"])
        } else if (sector == "others") {
            setOperation(["Pulp and Paper Industry", "Food and Beverages Industry", "Other"])
        }



        //getEmmsion Factor
        axiosPrivate.get(`efactor/industrial/get-efactor/${sector}`)
        .then(res => {

            setEmissionFactors(res.data as IndustrialEmissionFactor[]);


        })
        .catch(err => console.log(err))
        .then(()=> setIsLoading(false))




        
    },[sector])


















    const handleSectorChange = (value: string | undefined) => {
        const validSector: IndustrialSector = (value as IndustrialSector) || 'chemical';
        setSector(validSector);
        // setEmissionFactors(defaultEmissionFactors[validSector]);
    };

    const handleFactorChange = (index: number | null, name: string, value: string) => {
        
        const value_toNum = Number(value);

        if(isNaN(value_toNum)){
            alert("Invalid Input!");
        } else {

            setEmissionFactors((prev) => {
                if (Array.isArray(prev)) {
                    const updated = [...prev];
                    if (index !== null) {
                        updated[index] = {
                            ...updated[index],
                            [name]: value,
                        };
                    }
                    return updated;
                }
                return prev; 
            });
        }

    };
    

    
    const handleSubmit = () => {
        setIsLoading(true);
        axiosPrivate.put('efactor/industrial/update-efactor', {industry_type : sector, emissionFactors : emissionFactors})
        .then((res) => alert(res.data))
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false))

   
    };

    // console.log("Industrial Efactor : ", emissionFactors);
    return (
        <div className="border p-4 rounded-lg bg-gray-100 ">
            <Typography variant="h6" className="mb-4">
                Industrial Emission Factors
            </Typography>
            <Select
                label="Select Industrial Sector"
                value={sector}
                onChange={(value) => handleSectorChange(value)}
                className="mb-4"
            >
                <Option value="chemical">Chemical</Option>
                <Option value="metal">Metal</Option>
                <Option value="electronics">Electronics</Option>
                <Option value="others">Others</Option>
                <Option value="mineral">Mineral</Option>
            </Select>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {/* Render emission factor inputs */}
                {
                    emissionFactors && operation ? emissionFactors.map((factor, index) => (
                          <div key={index} className="flex flex-col gap-4">
                              <Typography variant="small" className="mb-2 font-bold">
                              {operation[index] }
                              </Typography>
                              
                              {Object.entries(factor).map(([key, value]) => (

                                key !== "_id" && (
                                    value !== 0? (
                                        <Input
                                            key={key}
                                            label={key.toUpperCase()}
                                            type="text"
                                            value={value}
                                            onChange={(e) => handleFactorChange(index, key, e.target.value)}
                                            
                                          />
                                      ) : null
                                )
                              ))}
                             
                          </div>
                      )) : <Skeleton/>
                 
                }
            
            </div>
            <Button onClick={handleSubmit} disabled={isLoading} className="mt-4 w-full" loading = {isLoading}>
                {isLoading ? 'Updating...' : 'Submit'}
            </Button>
            <Typography
                    variant="small"
                    color="gray"
                    className="mt-2 flex items-center justify-center gap-2 font-medium opacity-60"
                >
                    <LockClosedIcon className="-mt-0.5 h-4 w-4" /> Press submit to apply changes.
                </Typography>
        </div>
    );
}
