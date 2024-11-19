import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Button, Input, Option, Select, Typography } from '@material-tailwind/react';
import { useState } from 'react';

type EmissionFactors = {
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
};

type FuelType = "residential" | "commercial";

export default function WasteWaterEmissions() {
    const [isLoading, ] = useState(false);
    const [fuelType, setFuelType] = useState<FuelType>("residential");

    const defaultEmissionFactors: Record<FuelType, EmissionFactors> = {
        residential: {
            septic_tanks: 0.30,
            openPits_latrines: { cat1: 0.06, cat2: 0.00, cat3: 0.42, cat4: 0.06 },
            riverDischarge: { cat1: 0.00, cat2: 0.00 },
        },
        commercial: {
            septic_tanks: 0.13,
            openPits_latrines: { cat1: 0.03, cat2: 0.00, cat3: 0.18, cat4: 0.03 },
            riverDischarge: { cat1: 0.00, cat2: 0.00 },
        },
    };

    const [emissionFactors, setEmissionFactors] = useState<EmissionFactors>(defaultEmissionFactors[fuelType]);

    const handleFuelTypeChange = (value: string | undefined) => {
        const formType = value === "residential" || value === "commercial" ? value : "residential";
        setFuelType(formType);
        setEmissionFactors(defaultEmissionFactors[formType]);
    };

    const handleFactorChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        category: keyof EmissionFactors,
        subCategory?: string
    ) => {
        const { value } = e.target;
        const parsedValue = parseFloat(value);
    
        setEmissionFactors((prev) => {
            if (subCategory) {
                // Ensure the property being spread is an object
                const nestedCategory = prev[category] as Record<string, number>;
    
                return {
                    ...prev,
                    [category]: {
                        ...nestedCategory,
                        [subCategory]: parsedValue,
                    },
                };
            }
            return {
                ...prev,
                [category]: parsedValue,
            };
        });
    };
    


    return (
        <div className='border p-2 rounded-lg bg-gray-100 '>
            <form className="flex flex-col gap-4 mx-4">
            <Typography variant="h6" className="mb-4">
                Update Waste Water Emission Factors
            </Typography>
                <Select label="Select Survey Type" value={fuelType} onChange={handleFuelTypeChange}>
                    <Option value="residential">Residential</Option>
                    <Option value="commercial">Commercial</Option>
                </Select>

                <div className="mt-4 grid gap-6">
                    {/* Septic Tanks */}
                        <Typography variant="small" className="font-bold text-base">Septic Tanks</Typography>
                        <div className='grid grid-cols-3 gap-6 -mt-4'>

                        <Input
                            type="number"
                            value={emissionFactors.septic_tanks}
                            onChange={(e) => handleFactorChange(e, 'septic_tanks')}
                            placeholder="Septic Tanks"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{ className: "before:content-none after:content-none" }} />
                    </div>

                    {/* Open Pits / Latrines */}
                        <Typography variant="small" className="font-bold text-base mt-4">Open Pits / Latrines</Typography>
                        <div className='md:grid md:grid-cols-3 gap-6'>
                        {Object.entries(emissionFactors.openPits_latrines).map(([key, value]) => (
                            <div key={key} className="-mt-4">
                                <Typography variant="small" className="text-gray-500">{key.toUpperCase()}</Typography>
                                <Input
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleFactorChange(e, 'openPits_latrines', key)}
                                    placeholder={key.toUpperCase()}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{ className: "before:content-none after:content-none" }} />
                            </div>
                        ))}
                    </div>

                    {/* River Discharge */}
                  
                        <Typography variant="small" className="font-bold text-base mt-4">River Discharge</Typography>
                        <div className='md:grid md:grid-cols-3 gap-6'>
                        {Object.entries(emissionFactors.riverDischarge).map(([key, value]) => (
                            <div key={key} className="mb-2 -mt-4">
                                <Typography variant="small" className="text-gray-500">{key.toUpperCase()}</Typography>
                                <Input
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleFactorChange(e, 'riverDischarge', key)}
                                    placeholder={key.toUpperCase()}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{ className: "before:content-none after:content-none" }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button fullWidth className="w-full md:w-11/12" disabled={isLoading} >
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
