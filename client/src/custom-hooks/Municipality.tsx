import { useState, useEffect } from "react";
import useFilterAddress, { AddressReturnDataType } from "./useFilterAddrress";
import { Select, Option } from "@material-tailwind/react";
import useUserInfo from "./useUserType";

interface MunicipalityProps {
  setAddress : React.SetStateAction<any>;
}

const Municipality = ({setAddress}:MunicipalityProps) => {
  const [city_opt, set_city_opt] = useState<string[]>();
  const filterADddress = useFilterAddress;
  const userInfo = useUserInfo();

  useEffect(() => {
 
      if (userInfo.user_type === "s-admin") {
          const address = filterADddress({
            address_type: "mucipality",
          }) as AddressReturnDataType[];
          set_city_opt(address.map((addr) => addr.address_name));
      } else {
        setAddress({
          address_name : userInfo.municipality_name,
          address_code : userInfo.municipality_code,
          parent_code  : userInfo.province_code
        })
      }
  
  }, []);






  return (
    <>
      {userInfo.user_type !== "lgu_admin" ? (
        <Select
          onChange={(value) => {
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
          {city_opt ? (
            city_opt.map((city, index) => (
              <Option value={city} key={index}>
                {city}
              </Option>
            ))
          ) : (
            <Option value=""> </Option>
          )}
        </Select>
      ) : (
        <div className="w-11/12 h-full p-1">
          <div className="h-full border-solid border-black/20 border-2 flex justify-center items-center rounded-md">
           {userInfo.municipality_name}

          </div>
        </div>
      )}
    </>
  );
};

export default Municipality;
