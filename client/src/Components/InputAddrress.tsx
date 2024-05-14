import { useEffect, useState } from 'react'
import {
    Select,
    Option,
  } from "@material-tailwind/react";
import useFilterAddress from "../custom-hooks/useFilterAddrress";

export interface Address { 
    municipality_name : string;
    brgy_name : string;
}

interface InputAddrressProps {
    setState : React.SetStateAction<any>;

}

function InputAddrress({setState} : InputAddrressProps) {
    
    const filter_address = useFilterAddress;
    const [mucipality_list, setMunicipaltyList] = useState<string[]>();
    const [brgy_list, setBrgyList] = useState<string[]>();

    const [municipality, setMunicipalty] = useState<string>();
    const [brgy, setBrgy] = useState<string>();

    // const [address, setAddress] = useState<Address>();


    useEffect(()=>{

        const mucipality_data= filter_address({address_type : "mucipality"});
        setMunicipaltyList(mucipality_data.map(data => data.address_name));

    },[])


    useEffect(()=>{
        const mucipality_data= filter_address({address_type : "mucipality"});
        let parent_code : string = "";

        mucipality_data.forEach((data)=>{
            if(data.address_name === municipality){
                parent_code = data.address_code;
                const brgy_data = filter_address({address_type : "brgy", parent_code})
                setBrgyList(brgy_data.map(data => data.address_name))

                setState((prev : any) => {
                    return {
                        ...prev, ["address"]:{
                            brgy_name : brgy as string,
                            municipality_name : municipality,
                        } as Address
                      }
                
                })
            }
        })

    },[municipality, brgy])


    return (
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
                <Select label="Select Municipality" onChange={(value)=>setMunicipalty(value)}>
                    {
                    mucipality_list ? mucipality_list.map((municipality, index)=>(
                        
                        <Option key={index} value={municipality}>{municipality}</Option>
                        
                    )) : <></>
                    }
                    
                </Select>

                <Select label="Select Brgy" disabled = {municipality === undefined} onChange={(value)=>setBrgy(value)}>
                    {
                        brgy_list ? brgy_list.map((brgy, index) => (
                            <Option key={index} value={brgy}>{brgy}</Option>
                        )) : <></>
                    }
                </Select>
        </div>
    )

}

export default InputAddrress