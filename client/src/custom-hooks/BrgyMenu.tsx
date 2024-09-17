import { Option, Select } from "@material-tailwind/react";
import useFilterAddress, { AddressReturnDataType } from "./useFilterAddrress"
import { useEffect, useState } from "react";


interface BrgyMenuyProps {
    setBrgys : React.SetStateAction<any>;
    disabled? : boolean;
    municipality_code : string;
    deafult_brgyName? : string;
  }
const BrgyMenu = ({setBrgys, municipality_code ,disabled = false, deafult_brgyName}:BrgyMenuyProps)=>{
    const filterADddress = useFilterAddress
    const brgys = filterADddress({parent_code : municipality_code, address_type : "brgy"})
    const [brgy_opt, set_brgy_opt] = useState<string[]>();
    const [selectedBrgy, setSelectedBrgy] = useState<string|undefined>(deafult_brgyName);
    



    // console.log("BRGYS : ", brgys)

    
    useEffect(()=>{
      // console.log("SELECTED BRGY : ", deafult_brgyName)
        set_brgy_opt(brgys.map(brgy => brgy.address_name));

        // setSelectedBrgy(brgys[0].address_name)

        

  
                    let brgysMenu: AddressReturnDataType = {} as AddressReturnDataType;
                    brgys.forEach((data) => {
                          if (data.address_name === selectedBrgy) {
                            brgysMenu = {
                              address_name: data.address_name,
                              address_code: data.address_code,
                              parent_code: data.parent_code,
                            };
                        }
                       
                      });
                    setBrgys(brgysMenu);
    },[])



    const onChangeHandler = (value:string|undefined) => {

        value && setSelectedBrgy(value)
        let brgysMenu: AddressReturnDataType = {} as AddressReturnDataType;
       
        brgys.forEach((data) => {
            
          if (data.address_name === value) {
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
        <div className="w-full"> 
          
            {  brgy_opt ? 
            
                <Select value={selectedBrgy} onChange={(value)=>{onChangeHandler(value)}} disabled = {disabled} label="Choose Brgy">
                    {
                        brgy_opt.map((brgy, index) => (<Option key={index} value= {brgy}>{brgy}</Option>))
                    }
                </Select>
                : null
        
        
            }
            
        
        </div>
    )
}

export default BrgyMenu