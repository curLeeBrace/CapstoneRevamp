import { Typography, Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import { useIndustrialBaseData } from "./IndustrialForm";
import { useParams } from "react-router-dom";
import useUserInfo from "../../../custom-hooks/useUserType";
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import DialogBox from "../../../Components/DialogBox";

type MetalData = {
  ispif: number;
  ispnif: number;
};

const Metal = () => {
  const industrialBaseData = useIndustrialBaseData();
  const params = useParams();
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);

  const user_info = useUserInfo();
  const {updateForm, acceptFormUpdate, submitForm} = useSurveyFormActions();
  const handleChange = useHandleChange;

  const [metalData, setMetalData] = useState<MetalData>({
    ispif : 0,
    ispnif :0,
  })

  const submitValidation = () => {

    const {brgy, dsi, type_ofData, setAlertMsg, setOpenAlert, } = industrialBaseData

    if(brgy && dsi && type_ofData){

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
 })


 }


 const updateHandler = () => {

 }

 const acceptUpdateHandler = ()=>{

 }



  return (
    <div className="flex flex-col justify-around h-full">
      <DialogBox open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
        params.action === "submit" ? submitHandler
        : params.action === "update" ? updateHandler
        :acceptUpdateHandler
      } />
      <div>
        <Typography className=" text-md whitespace-normal">
          Iron and Steel Production from Integrated Facilities (tons)
        </Typography>
        <Input
          name="ispif"
          value = {metalData.ispif}
          onChange={(e) => handleChange({event : e, setFormStateData : setMetalData})}
          size="lg"
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
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
        name="ispnif"
        value={metalData.ispnif}
        onChange={(e) => handleChange({event : e, setFormStateData : setMetalData})}
        size="lg"
        type="number"
        placeholder="0"
        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
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
                      : "Accept Update"
                    }
                  </Button>
  
          </div>
    </div>
  );
};

export default Metal;
