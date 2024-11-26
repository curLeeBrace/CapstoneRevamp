import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Button, Input, Option, Select, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../custom-hooks/auth_hooks/useAxiosPrivate';
import Skeleton from '../../../Components/Skeleton';

type EmissionFactors = Record<string, number>;

type CategoryType = "Wood and Wood Products Harvesting" | "Changes in the Use of the Forestlands";


export default function Forestry() {
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState<CategoryType>("Wood and Wood Products Harvesting");

    // Define the emission factors for each category, with proper types
    // const defaultEmissionFactors: Record<CategoryType, EmissionFactors> = {
    //     "Wood and Wood Products Harvesting": {
    //         "Fuelwood CO2": 1.80,
    //         "Charcoal CO2": 1.80,
    //         "Construction CO2": 1.80,
    //         "Novelties CO2": 1.80,
    //     },
    //     "Changes in the Use of the Forestlands": {
    //         "Used for Agriculture CO2": 14.03,
    //         "Used as Grasslands CO2": 14.03,
    //         "Left as Barren Areas CO2": 14.03,
    //     },
    // };
    const [emissionFactors, setEmissionFactors] = useState<EmissionFactors>();
    const axiosPrivate = useAxiosPrivate();



    useEffect(()=>{

        axiosPrivate.get(`/efactor/forest-landuse/get-efactor/${category ==='Wood and Wood Products Harvesting' ? "falu-wood" : "falu-forestland"}`)
        .then((res) => {
            const efactor = res.data.efactor;
            if(category === "Wood and Wood Products Harvesting") {
                const {fuelwood_co2, charcoal_co2, construction_co2, novelties_co2} = efactor
                setEmissionFactors({
                    "Fuelwood CO2" : fuelwood_co2,
                    "Charcoal CO2" :charcoal_co2,
                    "Construction CO2" : construction_co2,
                    "Novelties CO2" : novelties_co2,
                })
            } else {
                const {ufA_co2, uaG_co2, laBA_co2} = efactor
                setEmissionFactors({
                    "Used for Agriculture CO2" : ufA_co2,
                    "Used as Grasslands CO2" : uaG_co2,
                    "Left as Barren Areas CO2" : laBA_co2
                })
            }
        })
        .catch(err => console.log(err))
        .finally(()=>setIsLoading(false));

    },[category])


















    const handleCategoryChange = (value: string | undefined) => {
        const selectedCategory = value === "Wood and Wood Products Harvesting" || value === "Changes in the Use of the Forestlands"
            ? value
            : "Wood and Wood Products Harvesting";
        setCategory(selectedCategory);
        // setEmissionFactors(defaultEmissionFactors[selectedCategory]);
    };

    const handleFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmissionFactors((prev) => ({ ...prev, [name]: parseFloat(value) }));
    };

    const submitValidation = async () => {
        if(emissionFactors){

            if (Object.values(emissionFactors).some((factor) => isNaN(factor) || factor <0)) {
                alert("Please fill in all emission factors.");
                return;
            }
            setIsLoading(true);
            const falu_type = category === 'Wood and Wood Products Harvesting' ? "falu-wood" : "falu-forestland";
            
                axiosPrivate.put('/efactor/forest-landuse/update-efactor/',{
                    falu_type : falu_type,
                
                e_factor : category === "Wood and Wood Products Harvesting" ? {
                    fuelwood_co2 : emissionFactors["Fuelwood CO2"],
                    charcoal_co2 : emissionFactors["Charcoal CO2"],
                    construction_co2 : emissionFactors["Construction CO2"],
                    novelties_co2 : emissionFactors["Novelties CO2"]
                } : {
                    ufA_co2 : emissionFactors["Used for Agriculture CO2"],
                    uaG_co2 : emissionFactors["Used as Grasslands CO2"],
                    laBA_co2 : emissionFactors["Left as Barren Areas CO2"]
                }
            })
            .then((res) => alert(res.data))
            .catch(err => console.log(err))
            .finally(()=>setIsLoading(false))
        }
    };
    console.log("FALU_Efactors : ", emissionFactors);
    return (
        <div className='border p-2 rounded-lg bg-gray-100'>
            <form className="mt-12 flex flex-col gap-4 mx-4">
                <Typography variant="h6" className="mb-4">
                    Update Land Use Emission Factors
                </Typography>
                <Select label="Select Category" value={category} onChange={handleCategoryChange}>
                    <Option value="Wood and Wood Products Harvesting">Wood and Wood Products Harvesting</Option>
                    <Option value="Changes in the Use of the Forestlands">Changes in the Use of the Forestlands</Option>
                </Select>

                <div className="my-4 md:grid md:grid-cols-3 gap-10">
                    {emissionFactors && !isLoading ?Object.entries(emissionFactors).map(([key, value]) => (
                        <div key={key}>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {key}
                            </Typography>
                            <Input
                                type="number"
                                name={key}
                                value={value}
                                onChange={handleFactorChange}
                                placeholder={key}
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{ className: "before:content-none after:content-none" }}
                            />
                        </div>
                    )) : <Skeleton/>}
                </div>

                <div className="flex justify-center">
                    <Button fullWidth className="w-full md:w-11/12" disabled={isLoading} onClick={submitValidation}>
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
            </form>
        </div>
    );
}
