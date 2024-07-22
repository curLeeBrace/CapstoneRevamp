import { Option, Select } from "@material-tailwind/react";
import useFilterAddress, { AddressReturnDataType } from "./useFilterAddrress"
import { useEffect, useState } from "react";


interface BrgyMenuyProps {
    setBrgys : React.SetStateAction<any>;
    disabled? : boolean;
    municipality_code : string;
  }
const BrgyMenu = ({setBrgys, municipality_code ,disabled = false}:BrgyMenuyProps)=>{
    const filterADddress = useFilterAddress
    const brgys = filterADddress({parent_code : municipality_code, address_type : "brgy"})
    const [brgy_opt, set_brgy_opt] = useState<string[]>();

    

    useEffect(()=>{
        set_brgy_opt(brgys.map(brgy => brgy.address_name));
    },[])

    const onChangeHandler = (value:string|undefined) => {
        console.log("VALUE : ", value)
        let brgysMenu: AddressReturnDataType = {} as AddressReturnDataType;

       
        brgys.forEach((data) => {
            
          if (data.address_name === value) {
            console.log("brgysMenu : ", brgysMenu)
            brgysMenu = {
              address_name: data.address_name,
              address_code: data.address_code,
              parent_code: data.parent_code,
            };
          }
        });

        setBrgys(brgysMenu);

    }




    return (
        <>  
            <Select onChange={(value)=>{onChangeHandler(value)}} disabled = {disabled} label="Choose Brgy">
                {
                    brgy_opt ? 
                    brgy_opt.map((brgy, index) => (<Option key={index} value= {brgy}>{brgy}</Option>))
                    : 
                    <Option>{" "}</Option>
                }
            
            </Select>
        
        </>
    )
}

export default BrgyMenu