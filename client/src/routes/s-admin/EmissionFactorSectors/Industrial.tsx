import { Button, Select, Option, Typography, Input } from '@material-tailwind/react';
import { useState } from 'react';
import { axiosPivate } from '../../../api/axios';
import { LockClosedIcon } from '@heroicons/react/24/solid';

type IndustrialEmissionFactor = {
    CO2: number;
    CH4: number;
    CF4: number;
    C2F6_1st: number;
    CHF3: number;
    C3F8: number;
    C2F6_2nd: number;
    NF3: number;
    SF6: number;
    C6F14: number;
};

type IndustrialSector = 'chemical' | 'metal' | 'electronics' | 'others' | 'mineral';

const defaultEmissionFactors: Record<IndustrialSector, IndustrialEmissionFactor | IndustrialEmissionFactor[]> = {
    chemical: {
        CO2: 3,
        CH4: 3,
        CF4: 0,
        C2F6_1st: 0,
        CHF3: 0,
        C3F8: 0,
        C2F6_2nd: 0,
        NF3: 0,
        SF6: 0,
        C6F14: 0,
    },
    metal: {
        CO2: 4,
        CH4: 4,
        CF4: 0,
        C2F6_1st: 0,
        CHF3: 0,
        C3F8: 0,
        C2F6_2nd: 0,
        NF3: 0,
        SF6: 0,
        C6F14: 0,
    },
    electronics: [
        {
            CO2: 0,
            CH4: 0,
            CF4: 2,
            C2F6_1st: 2,
            CHF3: 2,
            C3F8: 2,
            C2F6_2nd: 2,
            NF3: 2,
            SF6: 2,
            C6F14: 0,
        },
        {
            CO2: 0,
            CH4: 0,
            CF4: 2,
            C2F6_1st: 0,
            CHF3: 0,
            C3F8: 0,
            C2F6_2nd: 0,
            NF3: 2,
            SF6: 2,
            C6F14: 2,
        },
        {
            CO2: 0,
            CH4: 0,
            CF4: 2,
            C2F6_1st: 2,
            CHF3: 0,
            C3F8: 0,
            C2F6_2nd: 0,
            NF3: 0,
            SF6: 0,
            C6F14: 0,
        },
        {
            CO2: 0,
            CH4: 0,
            CF4: 0,
            C2F6_1st: 0,
            CHF3: 0,
            C3F8: 0,
            C2F6_2nd: 0,
            NF3: 0,
            SF6: 0,
            C6F14: 2,
        },
    ],
    others: {
        CO2: 6,
        CH4: 0,
        CF4: 0,
        C2F6_1st: 0,
        CHF3: 0,
        C3F8: 0,
        C2F6_2nd: 0,
        NF3: 0,
        SF6: 0,
        C6F14: 0,
    },
    mineral: {
        CO2: 2,
        CH4: 0,
        CF4: 0,
        C2F6_1st: 0,
        CHF3: 0,
        C3F8: 0,
        C2F6_2nd: 0,
        NF3: 0,
        SF6: 0,
        C6F14: 0,
    },
};

export default function IndustrialEmissions() {

    const factorLabels: Record<string, string> = {
        1: "Cement Production - Portland (tons)",
        2: "Lime Production (tons)",
        3: "Cement Production - Portland (blended)",
        4: "Glass Production (tons)",
    };
    
    const [isLoading, setIsLoading] = useState(false);
    const [sector, setSector] = useState<IndustrialSector>('chemical');
    const [emissionFactors, setEmissionFactors] = useState<IndustrialEmissionFactor | IndustrialEmissionFactor[]>(
        defaultEmissionFactors[sector]
    );

    const handleSectorChange = (value: string | undefined) => {
        const validSector: IndustrialSector = (value as IndustrialSector) || 'chemical';
        setSector(validSector);
        setEmissionFactors(defaultEmissionFactors[validSector]);
    };

    const handleFactorChange = (index: number | null, name: string, value: string) => {
        if (Array.isArray(emissionFactors)) {
            setEmissionFactors((prev) => {
                if (Array.isArray(prev)) {
                    const updated = [...prev];
                    if (index !== null) {
                        updated[index] = {
                            ...updated[index],
                            [name]: Number(value),
                        };
                    }
                    return updated;
                }
                return prev; 
            });
        } else {
            setEmissionFactors((prev) => {
                if (!Array.isArray(prev)) { 
                    return {
                        ...prev,
                        [name]: Number(value),
                    };
                }
                return prev; 
            });
        }
    };
    

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await axiosPivate.post(``, { sector, emissionFactors });
            alert('Emission factors updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update emission factors.');
        } finally {
            setIsLoading(false);
        }
    };

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
                {Array.isArray(emissionFactors)
                    ? emissionFactors.map((factor, index) => (
                          <div key={index} className="flex flex-col gap-4">
                              <Typography variant="small" className="mb-2 font-bold">
                              {factorLabels[index + 1] }
                              </Typography>
                              
                              {Object.entries(factor).map(([key, value]) => (
                                  <Input
                                      key={key}
                                      label={key.toUpperCase()}
                                      type="number"
                                      value={value}
                                      onChange={(e) => handleFactorChange(index, key, e.target.value)}
                                      className="" 
                                      />
                              ))}
                             
                          </div>
                      ))
                      
                    : Object.entries(emissionFactors).map(([key, value]) => (
                        
                          <Input
                              key={key}
                              label={key.toUpperCase()}
                              type="number"
                              value={value}
                              onChange={(e) => handleFactorChange(null, key, e.target.value)}
                            
                          />
                      ))}
            
            </div>
            <Button onClick={handleSubmit} disabled={isLoading} className="mt-4 w-full">
                {isLoading ? 'Submitting...' : 'Submit'}
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
