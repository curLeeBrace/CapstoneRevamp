import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Button, Input, Option, Select, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import { axiosPivate } from '../../../api/axios';

type EmissionFactors = {
    co2: number;
    ch4: number;
    n2o: number;
};

// Define the valid fuel types as a union type
type FuelType = "Diesel" | "Gasoline";

export default function MobileCombustionEmissions() {
    const [isLoading, setIsLoading] = useState(false);
    const [fuelType, setFuelType] = useState<FuelType>("Diesel");

    // Define the emission factors for each fuel type, with proper types
    const defaultEmissionFactors: Record<FuelType, EmissionFactors> = {
        Diesel: { co2: 2.66, ch4: 4.0e-4, n2o: 2.18e-5 },
        Gasoline: { co2: 2.07, ch4: 3.2e-4, n2o: 1.9e-4 },
    };
    const [emissionFactors, setEmissionFactors] = useState<EmissionFactors>(defaultEmissionFactors[fuelType]);

    // Handle fuel type change and update emission factors
    const handleFuelTypeChange = (value: string | undefined) => {
        const fuel = value === "Diesel" || value === "Gasoline" ? value : "Diesel";
        setFuelType(fuel);
        setEmissionFactors(defaultEmissionFactors[fuel]);
    };

    // Handle emission factor changes
    const handleFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmissionFactors((prev) => ({ ...prev, [name]: parseFloat(value) }));
    };

    // Handle form submission and validation
    const submitValidation = async () => {
        if (!emissionFactors.co2 || !emissionFactors.ch4 || !emissionFactors.n2o) {
            alert("Please fill in all emission factors.");
            return;
        }

        setIsLoading(true);
        try {
            await axiosPivate.put('/', { fuelType: fuelType.toLowerCase(), factors: emissionFactors });
            alert('Emission factors updated successfully');
        } catch (error) {
            console.error('Error updating emission factors', error);
            alert('Error updating emission factors');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='border p-2 rounded-lg bg-gray-100 '>
            <form className="mt-12 flex flex-col gap-4 mx-4">
            <Typography variant="h6" className="mb-4">
                Update Mobile Combustion Emission Factors
            </Typography>
                <Select label="Select Fuel Type" value={fuelType} onChange={handleFuelTypeChange}>
                    <Option value="Diesel">Diesel</Option>
                    <Option value="Gasoline">Gasoline</Option>
                </Select>
                
                <div className="my-4 md:grid md:grid-cols-3 gap-10">
                    {Object.entries(emissionFactors).map(([key, value]) => (
                        <div key={key}>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {key.toUpperCase()} Factor
                            </Typography>
                            <Input
                                type="number"
                                name={key}
                                value={value}
                                onChange={handleFactorChange}
                                placeholder={key.toUpperCase()}
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{ className: "before:content-none after:content-none" }}
                            />
                        </div>
                    ))}
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
