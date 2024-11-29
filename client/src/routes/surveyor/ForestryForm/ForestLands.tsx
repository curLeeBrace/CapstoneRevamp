import { Typography, Input, Button } from "@material-tailwind/react";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import { useEffect, useState } from "react";
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import useUserInfo from "../../../custom-hooks/useUserType";
import { useLocation, useParams } from "react-router-dom";
import DialogBox from "../../../Components/DialogBox";
import { useSearchParams } from "react-router-dom";
import useInputValidation from "../../../custom-hooks/useInputValidation";
import { useForestryBaseData } from "./ForestryForm";



type ForestLandsData = {
  ufA : number;
  uaG : number;
  laBA : number;
}







const Wood = () => {
  const handleChange = useHandleChange;
  const forestryBaseData = useForestryBaseData();
  const params = useParams();
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const user_info = useUserInfo();
  const {submitForm, updateForm, acceptFormUpdate, finishForm} = useSurveyFormActions();
  const {state} = useLocation();
  const [searchParams] = useSearchParams();


  const [forestLandsData, setforestLandsData] = useState({
    ufA : 0,
    uaG : 0,
    laBA : 0,
  } as ForestLandsData);

  useInputValidation(forestLandsData, setforestLandsData, 999);
  // console.log("forestryBaseData : ", forestryBaseData);
  // console.log("woodData : ", forestLandsData);
  useEffect(()=>{

    const {action} = params 
    if(action !== "submit"){
        setforestLandsData(state)
      
    } else {
      clearForm()
    }
  },[searchParams])







  

  const clearForm = () => {
    setforestLandsData({
        ufA : 0,
        uaG : 0,
        laBA : 0,
    })
  }

  const preparePayLoad = () => {
    const {email, full_name, municipality_name, municipality_code, province_code} = user_info;
    const {brgy, dsi, type_ofData } = forestryBaseData

    let payload = {
      survey_data : {
        ...forestLandsData,
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

     
  const submitValidation = () => {
    const { brgy, dsi, type_ofData, setAlertMsg, setOpenAlert } = forestryBaseData;
    const isDataFilled = Object.values(forestLandsData).some(value => value && value.toString().trim() !== '');

 
    if (brgy && dsi && type_ofData && isDataFilled) {
      setOpenDialogBox(true);
    } else {
      set_isLoading(false);
      setAlertMsg("Some field are empty!");
      setOpenAlert(true);
    }
    if (!isDataFilled) {
      set_isLoading(false);
      setAlertMsg("You haven't input anything yet. Kindly fill-up the form.");
      setOpenAlert(true);
      return;
    }
  };



  const submitHandler = () =>{
    const payload = preparePayLoad();
    const {setAlertMsg, setOpenAlert} = forestryBaseData
 
    set_isLoading(true);
    submitForm({payload, form_category : "falu-forestland"})
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
    const {setAlertMsg, setOpenAlert} = forestryBaseData
    set_isLoading(true);
    updateForm({payload, form_id : form_id as string, form_category : "falu-forestland"})
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
    const {setAlertMsg, setOpenAlert} = forestryBaseData
    set_isLoading(true);
    acceptFormUpdate({form_id : form_id as string, form_category : "falu-forestland"})
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
    const {setAlertMsg, setOpenAlert} = forestryBaseData
    set_isLoading(true);
    finishForm({form_id : form_id as string, form_category : "falu-forestland"})
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
    <div className="">
      <DialogBox isLoading = {isLoading} open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
        params.action === "submit" ? submitHandler
        : params.action === "update" ? updateHandler
        : params.action === "view" ? acceptUpdateHandler
        : finishHandler
      } />
      <div className="md:grid md:grid-rows-2 md:grid-flow-col md:mt-2 md:gap-2 flex flex-col justify-around mb-4">
      <div className="w-full lg:w-52">
          <Typography>Used For Agriculture (hectare)</Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name="ufA"
            value={forestLandsData.ufA || ""}
            onChange={(e) => handleChange({event:e, setFormStateData : setforestLandsData})}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <div className="w-full lg:w-52">
          <Typography>Used as Grasslands (hectare)</Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name = "uaG"
            value={forestLandsData.uaG || ""}
            onChange={(e) => handleChange({event:e, setFormStateData : setforestLandsData})}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <div className="w-full lg:w-52">
          <Typography>Left as Barren Areas (hectare)</Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name="laBA"
            value={forestLandsData.laBA || ""}
            onChange={(e) => handleChange({event:e, setFormStateData : setforestLandsData})}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>
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

export default Wood;
