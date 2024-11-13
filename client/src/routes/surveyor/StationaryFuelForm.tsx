import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
// import AlertBox from "../../Components/Forms/AlertBox";
import useUserInfo from "../../custom-hooks/useUserType";
import BrgyMenu from "../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import useHandleChange from "../../custom-hooks/useHandleChange";
import useSurveyFormActions from "../../custom-hooks/useSurveyFormActions";
import DialogBox from "../../Components/DialogBox";
import AlertBox from "../../Components/Forms/AlertBox";



type StationaryDataTypes = {
  cooking_charcoal: number;
  cooking_diesel: number;
  cooking_kerosene: number;
  cooking_propane: number;
  cooking_wood: number;

  generator_motor_gasoline: number;
  generator_diesel: number;
  generator_kerosene: number;
  generator_residual_fuelOil: number;

  lighting_kerosene: number;
  form_type: string;
};



type Payload = {
  survey_data: {
    form_type: string;
    cooking : {
      charcoal : number,
      diesel : number,
      kerosene : number,
      propane : number,
      wood : number,
    },

    generator : {
      motor_gasoline : number,
      diesel : number,
      kerosene : number,
      residual_fuelOil : number,
    },

    lighting : {
      kerosene : number
    },

    brgy_name : any;
    brgy_code : any;
    status? : string;
  }
  surveyor_info: {
    email : string;
    full_name : string;
    municipality_name : string;
    municipality_code : string;
    province_code : string;
    img_id : string;
  }
  dateTime_created: Date

}

export function StationaryFuelForm() {
  const [stationaryData, setStationaryData] = useState<StationaryDataTypes>({
    cooking_charcoal: 0,
    cooking_diesel: 0,
    cooking_kerosene: 0,
    cooking_propane: 0,
    cooking_wood: 0,
    generator_motor_gasoline: 0,
    generator_diesel: 0,
    generator_kerosene: 0,
    generator_residual_fuelOil: 0,
    lighting_kerosene: 0,
    form_type: "residential",
  });

  const params = useParams();
  // const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);


  const user_info = useUserInfo();
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const { state } = useLocation();
  const handleChange = useHandleChange;
  const [searchParams] = useSearchParams();

  const {submitForm, updateForm, acceptFormUpdate, finishForm} = useSurveyFormActions();

  useEffect(()=>{
    const {action} = params
    if(action !== "submit"){
      setStationaryData(state)
    } else {
      clearForm()
    }
  },[searchParams])




  const submitHandler = () => {
    const payload = preparePayLoad();
    set_isLoading(true);
    submitForm({payload, form_category : "stationary"})
    .then(res => {
            if(res.status === 201){
              
              setOpenAlert(true);
              setAlertMsg("Sucsessfully Submitted!");
              clearForm();
            }
    
          set_isLoading(false);
        })
        .catch(err => {
          console.log(err)
          set_isLoading(false);
          setOpenAlert(true);
          setAlertMsg("Server Error!");
    })
    .finally(()=>{
      setOpenDialogBox(false)
    })
  
  }


  



  //EMPTY FUNCTION
  const updateHandler = () => {
    const payload = preparePayLoad();
    const form_id = searchParams.get("form_id");
  
    // alert(`FORM ID ${form_id}`)
    set_isLoading(true)
    updateForm({payload, form_id : form_id as string, form_category : "stationary"})
    .then(res => {
      if(res.status === 204){
            alert("can't request update because form data not found!");
          } else if(res.status === 200){
            setOpenAlert(true);
            setAlertMsg(res.data);
            setOpenDialogBox(false)
          }
    })
    .catch(err => {
      console.log(err)
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Server Error!");
    })
    .finally(()=>{
      set_isLoading(false)
      setOpenDialogBox(false)
      
    })
  
  }
  const acceptUpdateHandler = () => {
    const form_id = searchParams.get("form_id");
    set_isLoading(true)
    acceptFormUpdate({form_id : form_id as string, form_category : "stationary"})
    .then((res) => {
      if(res.status === 204){
        alert("can't accept request update because form data not found!");
      } else if(res.status === 200){
        setOpenAlert(true);
        setAlertMsg(res.data);
      }
     
    })
    .catch(err => {
      console.log(err)
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Server Error!");
    })
    .finally(()=>{
      set_isLoading(false)
      setOpenDialogBox(false)
    })
  
  }



const finishHandler = () => {

  const form_id = searchParams.get("form_id");
  set_isLoading(true)
  finishForm({form_id : form_id as string, form_category : "stationary"})
  .then((res) => {
    if(res.status === 204){
      alert("Error Occured! because form data not found!!");
    } else if(res.status === 200){
      setOpenAlert(true);
      setAlertMsg(res.data);
    }
   
  })
  .catch(err => {
    console.log(err)
    set_isLoading(false);
    setOpenAlert(true);
    setAlertMsg("Server Error!");
  })
  .finally(()=>{
    set_isLoading(false)
    setOpenDialogBox(false)
  })


}










const clearForm = () => {
  setStationaryData({
    cooking_charcoal: 0,
    cooking_diesel: 0,
    cooking_kerosene: 0,
    cooking_propane: 0,
    cooking_wood: 0,
    generator_motor_gasoline: 0,
    generator_diesel: 0,
    generator_kerosene: 0,
    generator_residual_fuelOil: 0,
    lighting_kerosene: 0,
    form_type: "residential",
  })
}


  const preparePayLoad = () : Payload => {
    const {email, full_name, municipality_name, municipality_code, province_code, img_id} = user_info;
    const {
      cooking_charcoal,
      cooking_diesel,
      cooking_kerosene,
      cooking_propane,
      cooking_wood,
      generator_motor_gasoline,
      generator_diesel,
      generator_kerosene,
      generator_residual_fuelOil,
      lighting_kerosene,
      form_type

    } = stationaryData
    const payload:Payload = {
      survey_data : {
          form_type : form_type,
          cooking : {
            charcoal : cooking_charcoal,
            diesel : cooking_diesel,
            kerosene : cooking_kerosene,
            propane : cooking_propane,
            wood : cooking_wood,
          },
          generator : {
            motor_gasoline : generator_motor_gasoline,
            diesel : generator_diesel,
            kerosene : generator_kerosene,
            residual_fuelOil : generator_residual_fuelOil,
          },
          lighting : {
            kerosene : lighting_kerosene
          },
         
          brgy_name : brgy?.address_name, 
          brgy_code : brgy?.address_code,
          
      },

      surveyor_info : {
        email,
        full_name,
        municipality_name,
        municipality_code,
        province_code,
        img_id,
      },
      dateTime_created : new Date(),
    }
    return payload
  }






  const submitValidation = () => {
    // validation logic here
    const {
      cooking_charcoal,
      cooking_diesel,
      cooking_kerosene,
      cooking_propane,
      cooking_wood,
      generator_motor_gasoline,
      generator_diesel,
      generator_kerosene,
      generator_residual_fuelOil,
      lighting_kerosene,
    } = stationaryData



    if(
      (user_info.user_type !== 'lu_admin' && brgy?.address_name === undefined) ||
      cooking_charcoal == 0 && cooking_diesel == 0 &&
      cooking_kerosene == 0 && cooking_propane == 0 &&
      cooking_wood == 0 && generator_motor_gasoline == 0 &&
      generator_diesel == 0 && generator_kerosene == 0 &&
      generator_residual_fuelOil == 0 && lighting_kerosene == 0
    ){
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Some field are empty!");
    } else {
      setOpenDialogBox(true);
    }
  };


  

  return (
    <div className="flex justify-center min-h-screen px-4 py-2 overflow-x-hidden">
      <AlertBox openAlert={openAlert} setOpenAlert={setOpenAlert} message={alert_msg} />


      <DialogBox isLoading = {isLoading} open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
          params.action === "submit" ? submitHandler
        : params.action === "update" ? updateHandler
        : params.action === "view" ? acceptUpdateHandler
        :finishHandler
      } />

      
      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-2/3 px-6 py-6 shadow-black shadow-2xl rounded-xl">
        <Typography variant="h4" color="blue-gray" className="text-center text-xl text-white bg-darkgreen rounded-lg py-2">
          Stationary Fuel Consumption Survey
        </Typography>

        <form className="mt-8 mb-2 max-w-screen-lg w-full">
          <Typography className="text-md font-bold text-lg">
            Form Type
          </Typography>
          <Checkbox
            disabled={params.action === "view" || params.action === "finish"}
            name="form_type"
            value={"residential"}
            checked={stationaryData.form_type === "residential"}
            onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
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
            disabled={params.action === "view" || params.action === "finish"}
            name="form_type"
            value={"commercial"}
            checked={stationaryData.form_type === "commercial"}
            onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
            label={
              <Typography
                variant="small"
                color="gray"
                className="font-normal mr-4"
              >
                Commercial
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          {/* Barangay Menu */}
          <div className="my-6 w-56">
            <BrgyMenu
              disabled={params.action === "view" || params.action === "finish"}
              municipality_code={user_info.municipality_code}
              setBrgys={user_info.user_type === 'lu_surveyor' 
                ? () => setBrgy({ address_code: '043426003', address_name: 'Laguna University', parent_code: '0434' }) 
                : setBrgy} 
              deafult_brgyName={user_info.user_type === 'lu_surveyor' ? 'Laguna University' : (state && state.brgy_name) }
              user_info={user_info}
            />
          </div>

          {/* COOKING Section */}
          <Typography className="text-md font-bold mb-4 text-lg">
            Cooking
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Charcoal (Kilogram)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "cooking_charcoal"
                value={stationaryData.cooking_charcoal}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Diesel (Liters)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "cooking_diesel"
                value={stationaryData.cooking_diesel}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Kerosene (Liters)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "cooking_kerosene"
                value={stationaryData.cooking_kerosene}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Propane/LPG (Kilogram)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "cooking_propane"
                value={stationaryData.cooking_propane}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Wood or Wood Waste (Kilogram)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "cooking_wood"
                value={stationaryData.cooking_wood}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}

                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* GENERATOR Section */}
          <Typography className="text-md font-bold mb-4 text-lg mt-8">
            Generator
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Motor Gasoline (Liters)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "generator_motor_gasoline"
                value={stationaryData.generator_motor_gasoline}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Diesel (Liters)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "generator_diesel"
                value={stationaryData.generator_diesel}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Kerosene (Liters)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "generator_kerosene"
                value={stationaryData.generator_kerosene}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Residual Fuel Oil (Liters)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "generator_residual_fuelOil"
                value={stationaryData.generator_residual_fuelOil}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* LIGHTING Section */}
          <Typography className="text-md font-bold mb-4 text-lg mt-8">
            Lighting
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Kerosene (Liters)</Typography>
              <Input
                disabled={params.action === "view" || params.action === "finish"}
                name = "lighting_kerosene"
                value={stationaryData.lighting_kerosene}
                onChange={(e)=>handleChange({event : e, setFormStateData : setStationaryData})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
          <Button 
                  fullWidth 
                  className="mt-6 flex justify-center"
                  loading = {isLoading}
                  onClick={submitValidation}
               
                
                  >
                    {
                      params.action === "submit" ?
                      "Submit"
                      : params.action === "update" ?
                      "Request Update"
                      : params.action === "view" ?
                        "Accept Update"
                      : "Okay"
                    }
                  </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
