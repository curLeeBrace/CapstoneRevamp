import { Typography, Input, Button } from "@material-tailwind/react";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import { useEffect, useState } from "react";
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import useUserInfo from "../../../custom-hooks/useUserType";
import { useIndustrialBaseData } from "./IndustrialForm";
import { useLocation, useParams } from "react-router-dom";
import DialogBox from "../../../Components/DialogBox";
import { useSearchParams } from "react-router-dom";
import useInputValidation from "../../../custom-hooks/useInputValidation";





type ChemicalData = {
  ap : number;
  sap : number;
  pcbp_M : number;
  pcbp_E : number;
  pcbp_EDVCM : number;
  pcbp_EO : number;
  pcbp_A : number;
  pcbp_CB : number;

}








const Chemical = () => {
  const handleChange = useHandleChange;
  const industrialBaseData = useIndustrialBaseData();
  const params = useParams();
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const user_info = useUserInfo();
  const {submitForm, updateForm, acceptFormUpdate, finishForm} = useSurveyFormActions();
  const {state} = useLocation();
  const [searchParams] = useSearchParams();




  const [chemicalData, setChemicalData] = useState({
    ap : 0,
    sap : 0,
    pcbp_A : 0,
    pcbp_CB : 0,
    pcbp_E : 0,
    pcbp_EDVCM : 0,
    pcbp_EO : 0,
    pcbp_M : 0,

  } as ChemicalData);

  useInputValidation(chemicalData, setChemicalData, 999);

  useEffect(()=>{

    const {action} = params 
    if(action !== "submit"){
      setChemicalData(state)
      
    } else {
      clearForm()
    }
  },[searchParams])







  

  const clearForm = () => {
    setChemicalData({
      ap : 0,
      pcbp_A : 0,
      pcbp_CB : 0,
      pcbp_E : 0,
      pcbp_EDVCM : 0,
      pcbp_EO : 0,
      pcbp_M : 0,
      sap : 0,
    })
  }

  const preparePayLoad = () => {
    const {email, full_name, municipality_name, municipality_code, province_code} = user_info;
    const {brgy, dsi, type_ofData } = industrialBaseData

    let payload = {
      survey_data : {
        ...chemicalData,
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
    const { brgy, dsi, type_ofData, setAlertMsg, setOpenAlert } = industrialBaseData;
    const isDataFilled = Object.values(chemicalData).some(value => value && value.toString().trim() !== '');

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
    const {setAlertMsg, setOpenAlert} = industrialBaseData
 
    set_isLoading(true);
    submitForm({payload, form_category : "industrial-chemical"})
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
    set_isLoading(true);
    updateForm({payload, form_id : form_id as string, form_category : "industrial-chemical"})
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
    acceptFormUpdate({form_id : form_id as string, form_category : "industrial-chemical"})
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
    finishForm({form_id : form_id as string, form_category : "industrial-chemical"})
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
      <div className="flex  flex-wrap justify-around">
        <div className="w-full lg:w-52">
          <Typography>Ammonia Production (tons)</Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name="ap"
            value={chemicalData.ap}
            onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <div className="w-full lg:w-52">
          <Typography>Soda Ash Production (tons)</Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name = "sap"
            value={chemicalData.sap}
            onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <div className="w-full lg:w-96">
          <Typography>Dichloride and Vinyl Chloride Monomer (tons)</Typography>
          <Input
            disabled = {params.action === "view" || params.action === "finish"}
            name="pcbp_EDVCM"
            value={chemicalData.pcbp_EDVCM}
            onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
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

      <Typography className=" text-md mt-14 font-bold mb-4">
        Petrochemical and Carbon Black Production
      </Typography>

      <div className="md:grid md:grid-rows-4 md:grid-flow-col md:mt-2 md:gap-2 flex flex-col justify-around">
        <Typography className=" text-md whitespace-nowrap mt-2 mr-2">
          Methanol (tons)
        </Typography>
        <Input
          disabled = {params.action === "view" || params.action === "finish"}
          name="pcbp_M"
          value={chemicalData.pcbp_M}
          onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Ethylene (tons)
        </Typography>
        <Input
          disabled = {params.action === "view" || params.action === "finish"}
          name="pcbp_E"
          value={chemicalData.pcbp_E}
          onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Ethylene oxide (tons)
        </Typography>
        <Input
          disabled = {params.action === "view" || params.action === "finish"}
          name="pcbp_EO"
          value={chemicalData.pcbp_EO}
          onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Acrylonitrile (tons)
        </Typography>
        <Input
          disabled = {params.action === "view" || params.action === "finish"}
          name="pcbp_A"
          value={chemicalData.pcbp_A}
          onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Carbon black (tons)
        </Typography>
        <Input
          disabled = {params.action === "view" || params.action === "finish"}
          name = "pcbp_CB"
          value={chemicalData.pcbp_CB}
          onChange={(e) => handleChange({event:e, setFormStateData : setChemicalData})}
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-10 mt-2 w-52"
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
                     : params.action === "update" ?
                       "Accept Update"
                     : "Okay"
                    }
                  </Button>
  
          </div>
    </div>
  );
};

export default Chemical;
