import { Typography, Input, Button } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import useHandleChange from "../../../custom-hooks/useHandleChange"
import { useIndustrialBaseData } from "./IndustrialForm"
import { useParams } from "react-router-dom"
import useUserInfo from "../../../custom-hooks/useUserType"
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions"
import DialogBox from "../../../Components/DialogBox"
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useInputValidation from "../../../custom-hooks/useInputValidation"


type OthersData = {
  ppi : number
  fbi : number
  other : number
}
const Others = () => {

  const industrialBaseData = useIndustrialBaseData();
  const params = useParams();
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  
  const user_info = useUserInfo();
  const {submitForm, updateForm, acceptFormUpdate} = useSurveyFormActions();
  const handleChange = useHandleChange;
  const [searchParams] = useSearchParams();
  const {state} = useLocation();
    const [othersData, setOthersData] = useState<OthersData>({
      fbi : 0,
      ppi : 0,
      other : 0
    })

    useInputValidation(othersData, setOthersData, 999);




    useEffect(()=>{
      const {action} = params 
      if(action !== "submit"){
        setOthersData(state)
        
      } else {
        clearForm()
      }
    },[searchParams])
  








  const submitValidation = () => {

    const {brgy, dsi, type_ofData, setAlertMsg, setOpenAlert, } = industrialBaseData
    const isDataFilled = Object.values(othersData).some(value => value && value.toString().trim() !== '');

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
      ...othersData,
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
  setOthersData({
    fbi : 0,
    other : 0,
    ppi : 0,
  })

}


const submitHandler = () =>{
  const payload = preparePayLoad();
  const {setAlertMsg, setOpenAlert} = industrialBaseData


  submitForm({payload, form_category : "industrial-others"})
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
  const {setAlertMsg, setOpenAlert} = industrialBaseData

  updateForm({payload, form_id : form_id as string, form_category : "industrial-others"})
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
  acceptFormUpdate({form_id : form_id as string, form_category : "industrial-others"})
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

      <div className="flex flex-col gap-5 h-full justify-around">


        <div className="flex flex-wrap justify-around">
            <DialogBox open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
              params.action === "submit" ? submitHandler
              : params.action === "update" ? updateHandler
              :acceptUpdateHandler
            } />
          
                  <div className="w-full lg:w-2/5 flex flex-col gap-3">
                    <Typography>
                      Pulp and paper industry (tons)
                    </Typography>
                    <Input
                      disabled = {params.action === "view"}
                      name = "ppi"
                      value = {othersData.ppi}
                      onChange={(e) => handleChange({event : e , setFormStateData : setOthersData})}
                      size="lg"
                      type="number"
                      placeholder="0"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                    <Typography>
                      Food and beverages industry (tons)
                    </Typography>
                    <Input
                      disabled = {params.action === "view"}
                      name="fbi"
                      value={othersData.fbi}
                      onChange={(e) => handleChange({event : e , setFormStateData : setOthersData})}
                      size="lg"
                      type="number"
                      placeholder="0"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>



                  <div className="w-full lg:w-2/5 flex flex-col gap-3">
                    <Typography>
                      Other carbon in pulp (tons)
                    </Typography>
                    <Input
                      disabled = {params.action === "view"}
                      name="other"
                      value={othersData.other}
                      onChange={(e) => handleChange({event : e , setFormStateData : setOthersData})}
                      size="lg"
                      type="number"
                      placeholder="0"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
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
                      : "Accept Update"
                    }
                  </Button>
  
          </div>
      </div>
    )

}


export default Others