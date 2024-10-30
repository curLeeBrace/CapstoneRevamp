import { useEffect, useState } from "react";
import FilterComponent from "../../Components/FilterComponent";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import { Typography } from "@material-tailwind/react";
import Table from "../../Components/Table";
import useUserInfo from "../../custom-hooks/useUserType";
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";

const StationarySummary = () => {
  const [municipality, setMunicipality] = useState<AddressReturnDataType>();
  const [formType, setFormType] = useState<"residential" | "commercial">(
    "residential"
  );
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const [yearState, setYearState] = useState<string | undefined>(new Date().getFullYear().toString());

  const userInfo = useUserInfo();
  const axiosPrivate = useAxiosPrivate();
//   const [loading, setIsLoading] = useState(false);
  
  const tb_head =[
    "ID",
    "Email",
    "Municipality",
    "Brgy",
    "Form Type",
    "Charcoal - (Cooking)",
    "Diesel - (Cooking)",
    "Kerosene - (Cooking)",
    "Propane - (Cooking)",
    "Wood - (Cooking)",
    "Motor Gasoline - (Generator)",
    "Diesel - (Generator)",
    "Kerosene - (Generator)",
    "Residual Oil - (generator)",
    "Kerosene - (Lighting)",
    "GHGe",
    "DateTime",
    
  ];
  const [tb_data, set_tbData] = useState<any[][]>();

  





  useEffect(()=>{
    // setIsLoading(true);
    axiosPrivate.get("/summary-data/stationary/raw-data", {params : {
        user_type : userInfo.user_type,
        form_type : formType,
        year : yearState,
        municipality_name : municipality?.address_name,
        brgy_name : brgy?.address_name,
    }})
    .then((res) => {
        const responseData = res.data;
        set_tbData(responseData.map((data:any)=>{
            const {
                form_id,
                email,
                municipality_name,
                brgy_name,
                form_type,
                cooking,
                generator,
                lighting,
                ghge,
                date_Time,
            } = data
        const dateTime = new Date(date_Time).toLocaleDateString() + " " + new Date(date_Time).toLocaleTimeString();



            return [
                form_id,
                email,
                municipality_name,
                brgy_name,
                form_type,
                cooking.charcoal,
                cooking.diesel,
                cooking.kerosene,
                cooking.propane,
                cooking.wood,
                generator.motor_gasoline,
                generator.diesel,
                generator.kerosene,
                generator.residual_fuelOil,
                lighting.kerosene,
                ghge,
                dateTime
            ]
        }))
    })
    .catch(err => console.log(err))
    // .finally(()=>setIsLoading(false));




  },[formType, municipality?.address_code, brgy?.address_code, yearState])








  return (
    <div className="w-full flex flex-col px-20 gap-5 mt-5">
      <div className="flex self-center mt-3">
        <Typography className="font-bold text-white text-2xl text-center mb-4 bg-darkgreen py-2 px-10 rounded-lg">
          {" "}
          Stationary Summary
        </Typography>
      </div>
      <div>
        <div className="bg-gray-300 w-full">
          <div className="w-full text-nowrap 2xl:w-4/5">
            <FilterComponent
              municipalityState={{
                state: municipality,
                setState: setMunicipality,
              }}
              formTypeState={{
                state: formType,
                setState: setFormType,
              }}
              brgyState={{
                state: brgy,
                setState: setBrgy,
              }}
              yearState={{
                state: yearState,
                setState: setYearState,
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between">    
              <div>Donut 1</div>
              <div>Donut 2</div>
              <div>Donut 3</div>
      </div>

        <div>
            {tb_data ? <Table tb_head={tb_head} tb_datas={tb_data}/> :"Empty    "}
        </div>
    </div>
  );
};

export default StationarySummary;
