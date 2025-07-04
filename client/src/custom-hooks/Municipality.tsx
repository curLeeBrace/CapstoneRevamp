import { useState, useEffect } from "react";
import useFilterAddress, { AddressReturnDataType } from "./useFilterAddrress";
import { Select, Option } from "@material-tailwind/react";
import useUserInfo from "./useUserType";

interface MunicipalityProps {
  setAddress: React.Dispatch<React.SetStateAction<AddressReturnDataType | undefined>>;
  deafult_municipalityName? : string;
  disabled? : boolean
}

const Municipality = ({setAddress, disabled, deafult_municipalityName}:MunicipalityProps) => {
  const [city_opt, set_city_opt] = useState<string[]>();
  const filterADddress = useFilterAddress;
  const userInfo = useUserInfo();
  const [selectedMunicipality, setSelectedMunicipality] = useState<string|undefined>(deafult_municipalityName);

  useEffect(() => {
    

      if (userInfo.user_type === "s-admin") {
        
          const address = filterADddress({
            address_type: "mucipality",
          }) as AddressReturnDataType[];
          // setSelectedMunicipality(address[0].address_name)
          set_city_opt(address.map((addr) => addr.address_name));
          // setAddress({
          //   address_name : address[0].address_name,
          //   address_code : address[0].address_code,
          //   parent_code  : address[0].parent_code
          // })
        } else if (userInfo.user_type === "lu_admin") {
          // For "lu_admin", directly set the address
          setAddress({
            address_name: "Laguna University",
            address_code: "043426",
            parent_code: "0434", 
          });
        } else {
        setAddress({
          address_name : userInfo.municipality_name,
          address_code : userInfo.municipality_code,
          parent_code  : userInfo.province_code
        })
      }
  
  }, []);






  return (
    <div className="w-full xl:w-36">
      {city_opt && userInfo.user_type !== "lgu_admin" ? (
        <Select
          className=" w-full"
          label="Choose Municipality"
          disabled = {disabled}
          value={selectedMunicipality}
          onChange={(value) => {
          
            value && setSelectedMunicipality(value);
            let lgu_municipality: AddressReturnDataType = {} as AddressReturnDataType;

            const mucipality_data = filterADddress({
              address_type: "mucipality",
            });
            mucipality_data.forEach((data) => {
              if (data.address_name === value) {
                lgu_municipality = {
                  address_name: data.address_name,
                  address_code: data.address_code,
                  parent_code: data.parent_code,
                };
              }
            });

            setAddress(lgu_municipality);
          }}
        >
          {

            city_opt.map((city, index) => (
              <Option value={city} key={index}>
                {city}
              </Option>
            ))
          }
        
        </Select>
      ) : (
        <div className="h-10 ">
          <div className="h-full border-solid border-black/20 border-2 flex justify-center items-center rounded-md px-5 w-full">
           {userInfo.municipality_name}

          </div>
        </div>
      )}
    </div>
  );
};

export default Municipality;