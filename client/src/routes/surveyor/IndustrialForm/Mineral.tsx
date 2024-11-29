import { Typography, Input, Button } from "@material-tailwind/react"
import {useIndustrialBaseData} from './IndustrialForm';
import {useEffect, useState } from "react";

import DialogBox from "../../../Components/DialogBox";
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import useUserInfo from "../../../custom-hooks/useUserType";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import { useLocation, useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import useInputValidation from "../../../custom-hooks/useInputValidation";



type MineralData = {
  cpp : number;
  cpb : number;
  lp : number;
  gp : number;
}


const Mineral = () => {

    const industrialBaseData = useIndustrialBaseData();
    const params = useParams();
    const {state} = useLocation();
    const [searchParams] = useSearchParams();
    
    const [isLoading, set_isLoading] = useState<boolean>(false);
    const [openDialogBox, setOpenDialogBox] = useState(false);

    const user_info = useUserInfo();
    const {submitForm, updateForm, acceptFormUpdate, finishForm} = useSurveyFormActions();
    const handleChange = useHandleChange;

    const [mineralData, setMineralData] = useState<MineralData>({
      cpb : 0,
      cpp : 0,
      gp : 0,
      lp : 0
    });

    useInputValidation(mineralData, setMineralData, 999);


    useEffect(()=>{
      const {action} = params 
      if(action !== "submit"){
        setMineralData(state)
        
      } else {
        clearForm()
      }
    },[searchParams])


    
  const submitValidation = () => {

      const {brgy, dsi, type_ofData, setAlertMsg, setOpenAlert, } = industrialBaseData
const isDataFilled = Object.values(mineralData).some(value => value && value.toString().trim() !== '');

    if (!isDataFilled) {
      set_isLoading(false);
      setAlertMsg("You haven't input anything yet. Kindly fill-up the form.");
      setOpenAlert(true);
      return;
    }
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
        ...mineralData,
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
    setMineralData({
      cpb : 0,
      cpp : 0,
      gp : 0,
      lp : 0,
    })

  }


  const submitHandler = () =>{
   const payload = preparePayLoad();
   const {setAlertMsg, setOpenAlert} = industrialBaseData
   set_isLoading(true);

   submitForm({payload, form_category : "industrial-mineral"})
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

    updateForm({payload, form_id : form_id as string, form_category : "industrial-mineral"})
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

    acceptFormUpdate({form_id : form_id as string, form_category : "industrial-mineral"})
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

  finishForm({form_id : form_id as string, form_category : "industrial-mineral"})
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





  


    return(
      <>
        
      <DialogBox isLoading = {isLoading} open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
        params.action === "submit" ? submitHandler
        : params.action === "update" ? updateHandler
        :params.action === "view" ? acceptUpdateHandler
        : finishHandler
      } />

      <div className="flex flex-col h-full justify-around gap-5">
        <div className="flex justify-around flex-wrap">

        <div className="w-full lg:w-2/5 flex flex-col gap-3">
          <Typography className="">
            Cement Production - Portland (tons)
          </Typography>
          <Input 
            disabled = {params.action === "view" || params.action === "finish"}
            name = "cpp"
            onChange={(e)=>{handleChange({event : e, setFormStateData  : setMineralData})}}
            value={mineralData.cpp || ""}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            min={0}
          />
          <Typography className="">
            Cement Production - Portland (blended)
          </Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name="cpb"
            onChange={(e)=>{handleChange({event : e, setFormStateData  : setMineralData})}}
            value={mineralData.cpb || ""}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900 "
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <div className="w-full lg:w-2/5 flex flex-col gap-3">
          <Typography>
            Lime Production (tons)
          </Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name="lp"
            onChange={(e)=>{handleChange({event : e, setFormStateData  : setMineralData})}}
            value={mineralData.lp || ""}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 placeholder:opacity-100 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />

          <Typography>
            Glass Production (tons)
          </Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name = "gp"
            onChange={(e)=>{handleChange({event : e, setFormStateData  : setMineralData})}}
            value={mineralData.gp || ""}
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
      </>
    )
}



export default Mineral