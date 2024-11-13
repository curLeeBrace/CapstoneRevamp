import { useEffect, useState } from "react";
import FilterComponent from "../../Components/FilterComponent";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import { Typography } from "@material-tailwind/react";
import Table from "../../Components/Table";
import useUserInfo from "../../custom-hooks/useUserType";
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import DonutChart, {DonutState} from "../../Components/Dashboard/DonutChart";

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

 const [cookingDonut, setCookingDonut] = useState<DonutState>();
 const [generatorDonut, setGeneratorDonut] = useState<DonutState>();
 const [lightingDonut, setLightingDonut] = useState<DonutState>();

  
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



        let stationaryDonutSereisHandler = {
          cooking : {
            charcoal : 0,
            diesel : 0,
            kerosene : 0,
            propane : 0,
            wood : 0,
          },
          generator : {
            motor_gasoline : 0,
            diesel : 0,
            kerosene : 0,
            residual_fuelOil : 0,
          },

          lighting : {
            kerosene : 0
          }
        }
        

        responseData.forEach((data : any) => {

          const {
            cooking,
            generator,
            lighting,
          }= data

          stationaryDonutSereisHandler.cooking.charcoal += cooking.charcoal;
          stationaryDonutSereisHandler.cooking.diesel += cooking.diesel;
          stationaryDonutSereisHandler.cooking.kerosene += cooking.kerosene;
          stationaryDonutSereisHandler.cooking.propane += cooking.propane;
          stationaryDonutSereisHandler.cooking.wood += cooking.wood;

          stationaryDonutSereisHandler.generator.motor_gasoline += generator.motor_gasoline;
          stationaryDonutSereisHandler.generator.diesel += generator.diesel;
          stationaryDonutSereisHandler.generator.kerosene += generator.kerosene;
          stationaryDonutSereisHandler.generator.residual_fuelOil += generator.residual_fuelOil;

          stationaryDonutSereisHandler.lighting.kerosene += lighting.kerosene;
  

        })

        const {cooking, generator, lighting} = stationaryDonutSereisHandler
        setCookingDonut({
          labels : ["Charcoal(kg)", "Diesel(lt)", "Kerosene(lt)", "Propane(kg)", "Wood(kg)"],
          series : [cooking.charcoal, cooking.diesel, cooking.kerosene, cooking.propane, cooking.wood]
        })
        setGeneratorDonut({
          labels : ["Motor Gasoline(lt)", "Diesel(lt)", "Kerosene(lt)", "Residual Fuel Oil(lt)"],
          series : [generator.motor_gasoline, generator.diesel, generator.kerosene, generator.residual_fuelOil],
        })

        setLightingDonut({
          labels : ["Kerosene(lt)"],
          series : [lighting.kerosene]
        })




    })
    .catch(err => console.log(err))
    // .finally(()=>setIsLoading(false));




  },[formType, municipality?.address_code, brgy?.address_code, yearState])








  return (
    <div className="w-full flex flex-col px-20 gap-5 ">
      <div className="flex self-center mt-3">
        <Typography className="font-bold text-white text-2xl text-center bg-darkgreen py-2 px-10 rounded-lg">
          {" "}
          Stationary Fuel Use
        </Typography>
      </div>
      <div>
        <div className="border-green-400 border-2 rounded-lg py-2 px-2 w-full">
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
      <div className="px-10 rounded-lg text-xl py-2 -mb-5 bg-darkgreen text-white">Stationary Charts</div>

      <div className="md:flex w-full gap-5 border-2 rounded-lg my-2 mx-auto border-gray-300">
        
              <div className="basis-full my-4">
                <DonutChart  chart_meaning={`Overall collected data in
                ${userInfo.user_type === "s-admin" 
                ? municipality?.address_name || "Laguna Province"
                : userInfo.user_type|| "lgu_admin"
                ? `${brgy?.address_name|| userInfo.municipality_name}`: "Selected Area"}.`}
                  labels={cookingDonut?.labels} series={cookingDonut?.series} title={`Cooking (${formType})`}/>
              </div>

              <div className="basis-full my-4">
                <DonutChart chart_meaning={`Overall collected data in
                ${userInfo.user_type === "s-admin" 
                ? municipality?.address_name || "Laguna Province"
                : userInfo.user_type|| "lgu_admin"
                ? `${brgy?.address_name|| userInfo.municipality_name}`: "Selected Area"}.`}
                 labels={generatorDonut?.labels} series={generatorDonut?.series} title={`Generator (${formType})`}/>
              </div>
              <div className="basis-full my-4">
                <DonutChart chart_meaning={`Overall collected data in
                ${userInfo.user_type === "s-admin" 
                ? municipality?.address_name || "Laguna Province"
                : userInfo.user_type|| "lgu_admin"
                ? `${brgy?.address_name|| userInfo.municipality_name}`: "Selected Area"}.`}
                 labels={lightingDonut?.labels} series={lightingDonut?.series} title={`Lighting (${formType})`}/>
              </div>
      </div>

      <div className="px-10 rounded-lg text-xl py-2 bg-darkgreen -mb-4 mt-4 text-white">Stationary Survey Data</div>
      <div className="basis-full">
            {tb_data ? <Table tb_head={tb_head} tb_datas={tb_data}/> :"Empty"}
        </div>
    </div>
  );
};

export default StationarySummary;
