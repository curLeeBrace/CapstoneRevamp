import { Typography, Input, Button } from "@material-tailwind/react"
import { useState } from "react"
import useHandleChange from "../../../custom-hooks/useHandleChange"
import { useIndustrialBaseData } from "./IndustrialForm"
import { useParams } from "react-router-dom"
import useUserInfo from "../../../custom-hooks/useUserType"
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions"
import DialogBox from "../../../Components/DialogBox"


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
  const {updateForm, acceptFormUpdate, submitForm} = useSurveyFormActions();
    const handleChange = useHandleChange;
    const [othersData, setOthersData] = useState<OthersData>({
      fbi : 0,
      ppi : 0,
      other : 0
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


  submitForm({payload, form_category : "industrial-electronics"})
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