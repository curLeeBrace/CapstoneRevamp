import { Typography, Input, Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import { useIndustrialBaseData } from "./IndustrialForm";
import { useParams } from "react-router-dom";
import useUserInfo from "../../../custom-hooks/useUserType";
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import DialogBox from "../../../Components/DialogBox";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useInputValidation from "../../../custom-hooks/useInputValidation";

type MetalData = {
  ispif: number;
  ispnif: number;
};

const Metal = () => {
  const industrialBaseData = useIndustrialBaseData();
  const params = useParams();
  const {state} = useLocation()
  const [searchParams] = useSearchParams();


  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);

  const user_info = useUserInfo();
  const {submitForm, updateForm, acceptFormUpdate, finishForm} = useSurveyFormActions();
  const handleChange = useHandleChange;

  const [metalData, setMetalData] = useState<MetalData>({
    ispif : 0,
    ispnif :0,
  })

  useInputValidation(metalData, setMetalData, 999);

  useEffect(()=>{
    const {action} = params 
    if(action !== "submit"){
      setMetalData(state)
      
    } else {
      clearForm()
    }
  },[searchParams])

  
  const submitValidation = () => {

    const {brgy, dsi, type_ofData, setAlertMsg, setOpenAlert, } = industrialBaseData
    const isDataFilled = Object.values(metalData).some(value => value && value.toString().trim() !== '');

    if (!isDataFilled) {
      set_isLoading(false);
      setAlertMsg("You haven't input anything yet. Kindly fill-up the form.");
      setOpenAlert(true);
      return;
    }
    if(brgy && dsi && type_ofData && isDataFilled){

      setOpenDialogBox(true);
    } else {
      set_isLoading(false);
      setOpenAlert(true)
      setAlertMsg("Some field are empty!");
    }
}


const preparePayLoad = () => {
  const {email, full_name, municipality_name, municipality_code, province_code} = user_info;
  const {brgy, dsi, type_ofData } = industrialBaseData

  let payload = {
    survey_data : {
      ...metalData,
      dsi,
      type_ofData,
      brgy_name : brgy?.address_name,
      brgy_code : brgy?.address_code
    },
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

const clearForm = ()=>{
  setMetalData({
    ispif : 0,
    ispnif : 0,
  })

}


const submitHandler = () =>{
  const payload = preparePayLoad();
  const {setAlertMsg, setOpenAlert} = industrialBaseData
  set_isLoading(true);

  submitForm({payload, form_category : "industrial-metal"})
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
   set_isLoading(false);
 })


 }


 const updateHandler = () => {

  const payload = preparePayLoad();
  const form_id = searchParams.get("form_id");
  const {setAlertMsg, setOpenAlert} = industrialBaseData
  set_isLoading(true);
  updateForm({payload, form_id : form_id as string, form_category : "industrial-metal"})
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
  const {setAlertMsg, setOpenAlert} = industrialBaseData
  set_isLoading(true);
  acceptFormUpdate({form_id : form_id as string, form_category : "industrial-metal"})
  .then((res) => {
    if(res.status === 204){
      alert("can't accep request update because form data not found!");
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
  const {setAlertMsg, setOpenAlert} = industrialBaseData
  set_isLoading(true);
  finishForm({form_id : form_id as string, form_category : "industrial-metal"})
  .then((res) => {
    if(res.status === 204){
      alert("can't accep request update because form data not found!");
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





  return (
    <div className="flex flex-col justify-around h-full">
      <DialogBox isLoading = {isLoading} open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
        params.action === "submit" ? submitHandler
        : params.action === "update" ? updateHandler
        :params.action === "view" ? acceptUpdateHandler
        : finishHandler
      } />
      <div>
        <Typography className=" text-md whitespace-normal">
          Iron and Steel Production from Integrated Facilities (tons)
        </Typography>
        <Input
          disabled = {params.action === "view" || params.action === "finish"}
          name="ispif"
          value = {metalData.ispif || ""}
          onChange={(e) => handleChange({event : e, setFormStateData : setMetalData})}
          size="lg"
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

      </div>


      <div>

      <Typography className=" text-md whitespace-normal">
        Iron and Steel Production from Non-integrated Facilities (tons)
      </Typography>
      <Input
        disabled = {params.action === "view" || params.action === "finish"}
        name="ispnif"
        value={metalData.ispnif || ""}
        onChange={(e) => handleChange({event : e, setFormStateData : setMetalData})}
        size="lg"
        type="number"
        placeholder="0"
        className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />

      </div>



            <div className=" flex justify-center">
                <Button 
                  fullWidth 
                  className="w-full md:w-11/12"
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
  );
};

export default Metal;
