import {useEffect, useState } from 'react';
import { Card, Input, Checkbox, Button, Typography} from "@material-tailwind/react";
import useHandleChange from '../../custom-hooks/useHandleChange';
import AlertBox from '../../Components/Forms/AlertBox';
import DialogBox from "../../Components/DialogBox";
import {useLocation, useParams, useSearchParams } from 'react-router-dom';
import BrgyMenu from '../../custom-hooks/BrgyMenu';
import useUserInfo from '../../custom-hooks/useUserType';
import { AddressReturnDataType} from '../../custom-hooks/useFilterAddrress';
import useSurveyFormActions from '../../custom-hooks/useSurveyFormActions';
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';
import SurveyInformation from '../ScheduleSurvey/SurveyInformation';

type formDataTypes = {
  form_type : string,
  vehicle_type : string,
  vehicle_age : number,
  fuel_type : string,
  liters_consumption : number,
  brgy_name : string

}

type Payload = {
  survey_data : any
  surveyor_info : any
  dateTime_created:Date
  dateTime_edited:Date|null
}

export function MobileCombustionForm() {

const handleChange = useHandleChange; 
const [formData, setFormData] = useState<formDataTypes>({
  form_type : "residential",
} as formDataTypes);


const [vehicleOptions, setVehicleOptions] = useState<string[]>();
const [isLoading, set_isLoading] = useState<boolean>(false);
const [openAlert, setOpenAlert] = useState<boolean>(false);
const [aler_msg, setAlertMsg] = useState<string>("");
const [openDialogBox, setOpenDialogBox] = useState(false);
const user_info = useUserInfo();
const [brgy, setBrgy] = useState<AddressReturnDataType>();


const [searchParams] = useSearchParams();
const params = useParams()
const {state} = useLocation();


const {updateForm, acceptFormUpdate, submitForm, finishForm} = useSurveyFormActions();

const axiosPrivate = useAxiosPrivate();


const [formSchedule, setFormSchedule] = useState<{
  start_date : Date,
  deadline : Date,
  status : string
}>();

useEffect(()=>{
  axiosPrivate.get('/survey-schedule/schedule-identifier', {params : {
    survey_type : "mobile-combustion",
    municipality_name : user_info.municipality_name
  }})
  .then(res => {

    if(res.status === 200){
        const {
        start_date,
        deadline,
        status,
        } = res.data
        setFormSchedule({
          start_date,
          deadline,
          status,
        });
    } else {
      setFormSchedule(undefined)
    }
  })
  .catch((err)=>console.log(err));
},[])



useEffect(() => {
  const vType_options = formData.form_type === "residential" || formData.form_type === "commercial" ? 
    [
      "Motorcycle",
      "Tricycle",
      "Sedan",
      "Hatchback",
      "Coupe",
      "Sports Utility Vehicle (SUV)",
      "Multi-Purpose Vehicle (MPV)",
      "Asian Utility Vehicle (AUV)",
      "Crossover",
      "Pick-Up Truck",
      "Bus",
      "Boat (bangka)"
    ] : undefined;

  setVehicleOptions(vType_options);
  console.log("State : ", state);

  // if (vType_options) {
  //   setFormData({ ...formData, vehicle_type: "" });
  // }

}, []);




useEffect(()=>{
  const {action} = params
  if(action !== "submit"){
    setFormData(state)
  } else {
    clearForm()
  }
},[searchParams])




useEffect(()=>{
    const {vehicle_age, liters_consumption} = formData

    const yearNow = new Date().getFullYear();
    if(vehicle_age && vehicle_age > yearNow){
      alert("Year Model Limit Exceeded")
      setFormData({...formData, vehicle_age : 0})
    }
  
    if(liters_consumption && liters_consumption > 999) {
  
      alert("Liters Limit Exceeded")
      setFormData({...formData, liters_consumption : 0})
  }

},[formData?.vehicle_age, formData?.liters_consumption])




const preparePayLoad = () : Payload => {
  const {email, full_name, municipality_name, municipality_code, province_code} = user_info;
  const yearNow = new Date().getFullYear();
  formData.vehicle_age = yearNow - formData.vehicle_age;
  let payload = {
    survey_data : {...formData, brgy_name : brgy?.address_name, brgy_code : brgy?.address_code},
    surveyor_info : {
      email,
      full_name,
      municipality_name,
      municipality_code,
      province_code,
      img_id : user_info.img_id

    },
    dateTime_created : new Date(),
    dateTime_edited : null,
  }

  return payload
}


const clearForm = () => {
  setFormData({
    form_type : "residential",
    vehicle_type : "",
    vehicle_age : 0,
    fuel_type : "",
    liters_consumption : 0,
    brgy_name : ""
  })
}



const submitHandler = () => {
  const payload = preparePayLoad();
  set_isLoading(true)
  submitForm({payload, form_category : "mobile-combustion"})
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



const updateHandler = () => {
  const payload = preparePayLoad();
  const form_id = searchParams.get("form_id");

  // alert(`FORM ID ${form_id}`)
  set_isLoading(true)
  updateForm({payload, form_id : form_id as string, form_category : "mobile-combustion"})
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
  acceptFormUpdate({form_id : form_id as string, form_category : "mobile-combustion"})
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
  finishForm({form_id : form_id as string, form_category : "mobile-combustion"})
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






const submitValidation = () => {
    const {form_type, fuel_type, liters_consumption, vehicle_age, vehicle_type} = formData

    const isVehicleAgeValid = (params.action === "view" || params.action === "finish" || vehicle_age) ? true : false;

    if(form_type && fuel_type &&  liters_consumption && isVehicleAgeValid && vehicle_type &&  (user_info.user_type !== 'lu_admin' ? brgy?.address_name : true))
    {
      setOpenDialogBox(true);
    } else {
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Some field are empty!");
    }
}

console.log("FormData ", formData)
// console.log("SELECTED VTYPE : ", formData.vehicle_type)


  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gray-200">

      {
        !formSchedule || formSchedule.status === "inactive" && params.action === "submit" ? <SurveyInformation form_schedInfo={formSchedule}/>
        :
        <>
          <DialogBox isLoading = {isLoading} open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
            params.action === "submit" ? submitHandler
            : params.action === "update" ? updateHandler
            : params.action === "view" ? acceptUpdateHandler
            :finishHandler
          } />
        
          <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 shadow-black -mt-8 shadow-2xl rounded-xl relative">
                
                <AlertBox openAlert = {openAlert}  setOpenAlert={setOpenAlert}  message={aler_msg}/>
                
            
            <Typography variant="h4" color="blue-gray" className="text-center text-xl text-white bg-darkgreen rounded-lg py-2">
              Mobile Combustion Form
            </Typography>
          

            <div className="mt-8 grid grid-cols-1 gap-6">
              {/* Column 1 */}
              <div className="flex flex-col gap-6">

                <BrgyMenu disabled = {params.action === "view" || params.action === "finish"}
                municipality_code= {user_info.municipality_code} 
                setBrgys={user_info.user_type === 'lu_surveyor' 
                ? () => setBrgy({ address_code: '043426003', address_name: 'Laguna University', parent_code: '0434' }) 
                : setBrgy }
                deafult_brgyName={user_info.user_type === 'lu_surveyor' ? 'Laguna University' : (state && state.brgy_name) }  user_info={user_info}/>
                
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Form Type
                  </Typography>
                  <Checkbox
                    disabled = {params.action === "view" || params.action === "finish"}
                    name='form_type'
                    value={'residential'}
                    checked={formData.form_type === "residential"} // Checked if this is selected
                    onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
                    label={
                      <Typography variant="small" color="gray" className="font-normal mr-4">
                        Residential
                      </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}

                  />
                  <Checkbox
                    
                    disabled = {params.action === "view" || params.action === "finish"}
                    name='form_type'
                    value={'commercial'}
                    checked={formData.form_type === "commercial"} // Checked if this is selected
                    onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
        
                    label={
                      <Typography variant="small" color="gray" className="font-normal">
                        Commercial
                      </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}
                  />
                  
                </div>


                <div className='h-20 flex flex-col gap-3'>
                  <Typography variant="h6" color="blue-gray">Vehicle Type</Typography>
                  {vehicleOptions && 
                    <select 
                      className='w-full h-full rounded-md border-blue-gray-100 border-2'
                      name = "vehicle_type"
                      onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                      value={formData.vehicle_type}
                      disabled = {params.action === "view" || params.action === "finish"}

                    >
                        <option value="" key = "default">Select Vehicle Type</option>
                      {
                        
                          vehicleOptions.map((v_type, index) => (
                              <option value={v_type} key={index}  selected>
                                {v_type}
                              </option>
                            ))
                          
                      }
                    </select>
                  
                  }
                </div>
                <div>
                <Typography variant="h6" color="blue-gray" className="mt-2">
                  {params.action === "view" || params.action === "finish" 
                    ? "Vehicle Age" 
                    : "Vehicle Year Model"}
                </Typography>
                  <Input
                  disabled = {params.action === "view" || params.action === "finish"}
                  name='vehicle_age'
                  value={formData.vehicle_age}
                  onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                    type="number"
                    size="lg"
                    placeholder="Example : 1990"
                    className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    maxLength={4}
                    min={1500}
                    max={new Date().getFullYear()}
                  />
                </div>
                
            
              

              {/* Column 2 */}
              
                <div>
                  <Typography variant="h6" color="blue-gray">
                    Fuel Type
                  </Typography>
                  <Checkbox
                    disabled = {params.action === "view" || params.action === "finish"}
                    name='fuel_type'
                    value={'diesel'}
                    checked={formData?.fuel_type === "diesel"} // Checked if this is selected
                    onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
                    
                    label={
                      <Typography variant="small" color="gray" className="mr-4">
                        Diesel
                      </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}
                  />
                  <Checkbox
                  disabled = {params.action === "view" || params.action === "finish"}
                  name='fuel_type'
                  value={'gasoline'}
                  checked={formData?.fuel_type === "gasoline"} // Checked if this is selected
                  onChange={(event) => handleChange({event, setFormStateData : setFormData})} // Handler for selection
                    label={
                      <Typography variant="small" color="gray">
                        Gasoline
                      </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}
                  />
                </div>

                <div>
                  <Typography variant="h6" color="blue-gray">
                    Fuel Consumption in a whole day - (liters)
                  </Typography>
                  <Input
                    disabled = {params.action === "view" || params.action === "finish"}
                    name='liters_consumption'
                    value = {formData.liters_consumption || ""}
                    onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                      type="number"
                      size="lg"
                      placeholder="Example: 3"
                      className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      min={0}
                      max={999}
                      maxLength={3}
                  />
                </div>

                </div>

              
              

              {/* Full-width elements */}
              <div className="md:col-span-2">
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
            </div>
          </Card>
        </>
      }


    </div>
  );
}