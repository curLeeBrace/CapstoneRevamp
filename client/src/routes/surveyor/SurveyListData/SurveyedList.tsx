import { Checkbox, Input, Typography} from "@material-tailwind/react";
import Table from "../../../Components/Table";
import { Link, useLocation } from "react-router-dom";
import useUserInfo from "../../../custom-hooks/useUserType";
import BrgyMenu from "../../../custom-hooks/BrgyMenu";
import { useEffect, useState } from "react";
import { AddressReturnDataType } from "../../../custom-hooks/useFilterAddrress";
import useAxiosPrivate from "../../../custom-hooks/auth_hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import useSearchFilter from "../../../custom-hooks/useSearchFilter";
import SimpleCard from "../../../Components/Dashboard/SimpleCard";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const SurveyedList = () => {
  const axiosPrivate = useAxiosPrivate();
  const user_info = useUserInfo();
  // const [survey_category, setSurveyCategory] = useState<string>("mobile-combustion");
  const [surveyType, setSurveyType] = useState<"residential" | "commercial">(
    "residential"
  );
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const [tb_data, setTbData] = useState<any[]>();
  const [tb_head, set_tbHead] = useState<string[]>()
  const {survey_category} = useParams();
  const {state} = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const filteredData = useSearchFilter(tb_data, searchQuery); 
  
  // console.log("survey_category : ", survey_category)
  useEffect(()=>{
    const {user_type} = user_info
      if(brgy){
          console.log("brgy.address_code" , brgy.address_code)
          axiosPrivate.get(`/forms/${survey_category}/surveyed-data`, {params : {
              user_type,
              municipality_code : user_info.municipality_code,
              brgy_name : brgy.address_name,
              brgy_code : brgy.address_code,
              surveyType
          }})
          .then(res => {
              const form_data = res.data;

              const preparedData = prepare_tbData(survey_category as string, form_data);
              setTbData(preparedData);

          })
          .catch((err)=> console.log("SURVEY LIST : ", err))

      }

      if(survey_category === "mobile-combustion"){
        set_tbHead([ 
          "ID",
          "Brgy",
          "Vehicle Type",
          "Vehicle Age",
          "Fuel Type",
          "Liters Consumption",
          "Survey Type",
          "Status",
          "DateTime",
          "Action",])
      } else if(survey_category === "waste-water"){
        set_tbHead([ 
          "ID",
          "Brgy",
          
          "Septik Tank (Poso Negro)",
          "Dry climate, ground water table lower than latrine, small family (2-5 people)",
          "Dry climate, ground water table lower than latrine, communal",
          "Wet climate/flush water use, ground water table than latrine",
          "Regular sedimentremoval for fertilizer",
          "River Discharge/Walang pagdaloy at kulang sa oxygen na ilog (Stagnant oxygen deficient rivers and lakes)",
          "River Discharge/ilog, lawa, at estero (Rivers, lakes, estuaries)",

        
         
          "Survey Type",
          "Status",
          "DateTime",
          "Action",])
      } else {
        set_tbHead([
          "ID",
          "Brgy",
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
          "DateTime",
          "Action",
        ])
      }

  },[brgy, surveyType, survey_category])

  const prepare_tbData = (
    survey_category: string,
    form_data: any[]
  ): any[] => {
    let tb_data: any[] = [];
    if (survey_category === "mobile-combustion") {
      tb_data = form_data.map((data: any) => {
        const {
          
          brgy_name,
          vehicle_type,
          vehicle_age,
          fuel_type,
          liters_consumption,
          status,
          form_type,
        } = data.survey_data;
        const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();
        const LinkComponent = (
          <Link
            to={`/surveyor/forms/update/mobile-combustion?form_id=${data.form_id}`}
            state={{
              brgy_name,
              vehicle_type,
              vehicle_age : new Date().getFullYear() - vehicle_age,
              fuel_type,
              liters_consumption,
              form_type,
            }}
          >
            <div className="text-green-700">Update</div>
          </Link>
        );

        return [
          data.form_id,
          brgy_name,
          vehicle_type,
          vehicle_age,
          fuel_type,
          liters_consumption,
          form_type,
          status,
          dateTime,
          LinkComponent,
        ];
      });
    } else if(survey_category === "waste-water"){
      tb_data = form_data.map((data: any) => {
        const {
          septic_tanks,
          openPits_latrines,
          riverDischarge,
          brgy_name,
          status,
          form_type,
        } = data.survey_data;
        const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();
        const form_id = data.form_id;

        
        const LinkComponent = (
          <Link
            to={`/surveyor/forms/update/waste-water?form_id=${form_id}`}
            state={{
              brgy_name,
              form_type,
              septic_tanks,
              openPits_latrinesCat1 : openPits_latrines.cat1,
              openPits_latrinesCat2 :openPits_latrines.cat2,
              openPits_latrinesCat3 : openPits_latrines.cat3,
              openPits_latrinesCat4 : openPits_latrines.cat4,
              riverDischargeCat1 : riverDischarge.cat1,
              riverDischargeCat2 : riverDischarge.cat2,
              
            }}
          >
            <div className="text-green-700">Update</div>
          </Link>
        );
        return [
          data.form_id,
          brgy_name,
          septic_tanks,
          openPits_latrines.cat1,
          openPits_latrines.cat2,
          openPits_latrines.cat3,
          openPits_latrines.cat4,
          riverDischarge.cat1,
          riverDischarge.cat2,
          form_type,
          status,
          dateTime,
          LinkComponent,
        ];



      })
    } else {
      tb_data = form_data.map((data: any) => {
        const {
          cooking,
          generator,
          lighting,
          brgy_name,
          form_type,
        } = data.survey_data;
        const dateTime = new Date(data.dateTime_created).toLocaleDateString() + " " + new Date(data.dateTime_created).toLocaleTimeString();
        const form_id = data.form_id;

        
        const LinkComponent = (
          <Link
            to={`/surveyor/forms/update/stationary?form_id=${form_id}`}
            state={{
              brgy_name,
              form_type,
              cooking_charcoal: cooking.charcoal,
              cooking_diesel: cooking.diesel,
              cooking_kerosene: cooking.kerosene,
              cooking_propane: cooking.propane,
              cooking_wood: cooking.wood,
              generator_motor_gasoline: generator.motor_gasoline,
              generator_diesel: generator.diesel,
              generator_kerosene: generator.kerosene,
              generator_residual_fuelOil: generator.residual_fuelOil,
              lighting_kerosene: lighting.kerosene,
              
            }}
          >
            <div className="text-green-700">Update</div>
          </Link>
        );
        return [
          data.form_id,
          brgy_name,
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


          // form_type,
          // status,
          dateTime,
          LinkComponent,
        ];



      })
    }

    return tb_data;
  };

  return (
    <div className="flex flex-col items-center py-3 gap-5 max-h-screen">
      <div className="text-2xl self-center rounded-lg bg-darkgreen text-white px-2 py-2">{
        survey_category === "mobile-combustion" ? "Mobile Combustion Data" : 
        survey_category === "waste-water" ? "Waste Water Data" : "Stationary Data"
      }</div>

      <div className="w-4/5 flex bg-blue-gray-100 px-3 py-1 rounded-lg shadow-lg items-center flex-wrap gap-3">

        {/* <div className="w-full lg:w-auto">
          <Select value={survey_category} label="Survey Category" onChange={(value)=>setSurveyCategory(value as string)}>
            <Option value="mobile-combustion">Mobile Combustion</Option>
            <Option value="waste-water">Waste Water</Option>
          </Select>
        </div> */}

        <div className="w-full lg:w-36 my-4">
          <BrgyMenu
            municipality_code={user_info.municipality_code}
            setBrgys={setBrgy}
            user_info={user_info}
            deafult_brgyName={user_info.user_type === 'lu_surveyor' ? 'Laguna University' : (state && state.brgy_name) }/>
          
          <div className="my-2">  
         <Input
                    type="search"
                    label="Search ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className=' bg-none'
                />
                </div>
        </div>
     

        <div className="lg:ml-16">
          <Typography variant="h6" color="gray">
            Survey Type
          </Typography>
          <Checkbox
            name="form_type"
            value={"residential"}
            checked={surveyType === "residential"} // Checked if this is selected
            onChange={(event: any) => setSurveyType(event.target.value)} // Handler for selection
            label={
              <Typography
                variant="small"
                color="gray"
                className="font-normal mr-4"
              >
                Residential
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Checkbox
            name="form_type"
            value={"commercial"}
            checked={surveyType === "commercial"} // Checked if this is selected
            onChange={(event: any) => setSurveyType(event.target.value)} // Handler for selection
            label={
              <Typography variant="small" color="gray" className="font-normal">
                Commercial
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
        </div>

      </div>


      <div className="w-4/5">
        {
        tb_head && filteredData.length ? 
        <Table tb_datas={filteredData} tb_head={tb_head} /> :
        <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
        }
      </div>
    </div>
  );
};

export default SurveyedList;
