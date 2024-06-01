import { useEffect, useState } from 'react';
import { Select, Option } from "@material-tailwind/react";
import useFilterAddress from '../../custom-hooks/useFilterAddrress';

export interface Address { 
    municipality_name: string;
}

interface InputAddressProps {
    setState: (municipality: string) => void;
}

function FilterMunicipality({ setState }: InputAddressProps) {
    const filter_address = useFilterAddress({ address_type: "mucipality" }); // Pass the required argument here
    const [municipalityList, setMunicipalityList] = useState<string[]>([]);

    useEffect(() => {
        const municipality_data = filter_address;
        setMunicipalityList(municipality_data.map(data => data.address_name));
    }, [filter_address]);

    return (
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
            <Select label="Select Municipality" onChange={(value) => setState(value ?? '')}>
                {municipalityList.map((municipality, index) => (
                    <Option key={index} value={municipality}>{municipality}</Option>
                ))}
            </Select>
        </div>
    );
}

export default FilterMunicipality;
