import {
  Button,
  Card,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import useUserInfo from "../../custom-hooks/useUserType";
import { useEffect, useState } from "react";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import BrgyMenu from "../../custom-hooks/BrgyMenu";
import useHandleChange from "../../custom-hooks/useHandleChange";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import DialogBox from "../../Components/DialogBox";
import AlertBox from "../../Components/Forms/AlertBox";

import useSurveyFormActions from "../../custom-hooks/useSurveyFormActions";







type wasteWaterFormTypes = {
  form_type: string;
  septic_tanks : number | undefined
  openPits_latrinesCat1 : number | undefined;
  openPits_latrinesCat2 : number | undefined;
  openPits_latrinesCat3 : number | undefined;
  openPits_latrinesCat4 : number | undefined;
  riverDischargeCat1 : number | undefined;
  riverDischargeCat2 : number | undefined;
};





type Payload = {
  survey_data: {
    form_type: string;
    septic_tanks: number | undefined;
    openPits_latrines : {
      cat1 : number | undefined,
      cat2 : number | undefined,
      cat3 : number | undefined,
      cat4 : number | undefined,
    }
    riverDischarge : {
      cat1 : number | undefined,
      cat2 : number | undefined,
    }
    brgy_name : any;
    brgy_code : any;
    status : string;
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
  dateTime_edited:  Date | null
}



const WasteWaterForm = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const {state} = useLocation();

  const user_info = useUserInfo();
  const handleChange = useHandleChange;
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const [formData, setFormData] = useState<wasteWaterFormTypes>({
    form_type :"residential",
  } as wasteWaterFormTypes);
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alert_msg, setAlertMsg] = useState("");




  const {updateForm, acceptFormUpdate, submitForm, finishForm} = useSurveyFormActions()

 
  useEffect(()=>{
    const {action} = params
    if(action !== "submit"){
      setFormData(state)
    } else {
      clearForm()
    }
  },[searchParams])

  const submitValidation = () => {
    console.log("Submit Form Data : ", formData);
    console.log("BRGY : ", brgy);
  
    // Check if any form field is undefined or empty
    const isDataFilled = Object.values({
      openPits_latrinesCat1: formData.openPits_latrinesCat1,
      openPits_latrinesCat2: formData.openPits_latrinesCat2,
      openPits_latrinesCat3: formData.openPits_latrinesCat3,
      openPits_latrinesCat4: formData.openPits_latrinesCat4,
      riverDischargeCat1: formData.riverDischargeCat1,
      septic_tanks: formData.septic_tanks
    }).some(value => value && value.toString().trim() !== '') && brgy?.address_code !== undefined;
  
    // If validation fails
    if (!isDataFilled) {
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Some fields are empty! Kindly check the form.");
    } else {
      // If validation passes
      setOpenDialogBox(true);
    }
  };
  


  
  const clearForm = () => {
    setFormData({
      form_type : "residential",
      openPits_latrinesCat1 : 0,
      openPits_latrinesCat2 : 0,
      openPits_latrinesCat3 : 0,
      openPits_latrinesCat4 : 0,
      riverDischargeCat1 : 0,
      riverDischargeCat2 : 0,
      septic_tanks : 0,
    })
  }

  const submitHandler = () => {
    const payload = preparePayLoad();
    set_isLoading(true)
    submitForm({payload, form_category : "waste-water"})
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
      set_isLoading(false)
    })
  

  }






  const updateHandler = () => {
    const payload = preparePayLoad();
    const form_id = searchParams.get("form_id");
    set_isLoading(true)
    updateForm({payload, form_id : form_id as string, form_category : "waste-water"})
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
    .finally(()=>set_isLoading(false))
  
  }


console.log("Form Data : ", formData)



  
const acceptUpdateHandler = () => {
  const form_id = searchParams.get("form_id");
  set_isLoading(true)
  acceptFormUpdate({form_id : form_id as string, form_category : "waste-water"})
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
  set_isLoading(true)
  finishForm({form_id : form_id as string, form_category : "waste-water"})
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



  const preparePayLoad = () : Payload => {
    const {email, full_name, municipality_name, municipality_code, province_code} = user_info;
    let payload : Payload = {
      survey_data : {
        form_type : formData.form_type,
        septic_tanks : formData.septic_tanks,
        openPits_latrines : {
          cat1 : formData.openPits_latrinesCat1,
          cat2 : formData.openPits_latrinesCat2,
          cat3 : formData.openPits_latrinesCat3,
          cat4 : formData.openPits_latrinesCat4
        },
        riverDischarge : {
          cat1 : formData.riverDischargeCat1,
          cat2 : formData.riverDischargeCat2

        },
        brgy_name : brgy?.address_name, 
        brgy_code : brgy?.address_code,
        status : "0",
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
      dateTime_edited : null
    }
  
    return payload 
  }




  return (
    <>
      <AlertBox openAlert = {openAlert}  setOpenAlert={setOpenAlert}  message={alert_msg}/>
    
  
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden">
       <DialogBox isLoading = {isLoading} open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
        params.action === "submit" ? submitHandler
        : params.action === "update" ? updateHandler
        :params.action === "view" ? acceptUpdateHandler
        :finishHandler
      } />
      
      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-2/3 px-6 py-6 -mt-10 shadow-black shadow-2xl rounded-xl relative gap-5">
        
        <Typography variant="h4" color="blue-gray" className="text-center">
          Waste Water Form
        </Typography>

        <div>
          <BrgyMenu
            disabled = {params.action === "view" || params.action === "finish"}
            municipality_code={user_info.municipality_code}
            setBrgys={setBrgy}
            deafult_brgyName={state && state.brgy_name}
          />
        </div>

        <div>
          <Typography variant="h6" color="blue-gray">
            Form Type
          </Typography>

          <Checkbox
            disabled = {params.action === "view" || params.action === "finish"}
            name="form_type"
            value={"residential"}
            checked={formData.form_type === "residential"} // Checked if this is selected
            onChange={(event) =>
              handleChange({ event, setFormStateData: setFormData })
            } // Handler for selection
            label={
              <Typography
                variant="small"
                color="gray"
                className="font-normal mr-4"
              >
                Residential
              </Typography>
            }
            // containerProps={{ className: "-ml-2.5" }}
          />
          <Checkbox
            disabled = {params.action === "view" || params.action === "finish"}
            name="form_type"
            value={"commercial"}
            checked={formData.form_type === "commercial"} // Checked if this is selected
            onChange={(event) =>
              handleChange({ event, setFormStateData: setFormData })
            } // Handler for selection
            label={
              <Typography variant="small" color="gray" className="font-normal">
                Commercial
              </Typography>
            }
            // containerProps={{ className: "-ml-2.5" }}
          />
        </div>

          


        <div className="flex gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md">
          <div>
            <InformationCircleIcon className="w-8 h-8" color="white" />
          </div>
          <Typography color="white" className="self-center">
            Lagyan ng bilang ang alinman sa mga sumusunod ang inyong ginagamit{" "}
            <br /> na daluyan ng basurang tubig (waste water)
          </Typography>
        </div>

        <div className="w-full">
          <Checkbox
            disabled = {params.action === "view" || params.action === "finish"}
            name="septic_tanks"
            value={formData.septic_tanks == 1 ? 0 : 1}
            checked = {formData.septic_tanks == 1}
            onChange={(event) =>
              handleChange({ event, setFormStateData: setFormData })
            } // Handler for selection
            label={
              <Typography variant="h6" color="blue-gray">
                Poso Negro (Septic Tank)
              </Typography>
            }
            // containerProps={{ className: "-ml-2.5" }}
          />

          
        
              {/* <Typography variant="h6" color="blue-gray">
                Poso Negro (Septic Tank)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="septic_tanks"
                value = {formData.septic_tanks}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              /> */}
          </div>

          <div className="flex gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md">
          <div>
            <InformationCircleIcon className="w-8 h-8" color="white" />
          </div>
            <Typography color="white" className="self-center">
            Open Pits/latrines
            </Typography>
        </div>



        <div className="flex flex-col gap-2 justify-around">
          <div className="w-full flex flex-wrap xl:flex-nowrap">
            <div className="xl:w-1/2 w-full">
              <Checkbox
                disabled = {params.action === "view" || params.action === "finish"}
                name="openPits_latrinesCat1"
                value={formData.openPits_latrinesCat1 == 1 ? 0 : 1}
                checked = {formData.openPits_latrinesCat1 == 1}
                onChange={(event) =>
                  handleChange({ event, setFormStateData: setFormData })
                } // Handler for selection
                label={
                  <Typography variant="h6" color="blue-gray">
                    dry climate, ground water table lower than latrine, small family (2-5 people)	
                  </Typography>
                }
                // containerProps={{ className: "-ml-2.5" }}
                className="shrink-0"
              />
              {/* <Typography variant="h6" color="blue-gray">
                dry climate, ground water table lower than latrine, small family (2-5 people)		
              </Typography>
              <Input
                disabled={params.action === "view"}
                name='openPits_latrinesCat1'
                value = {formData.openPits_latrinesCat1}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              /> */}
            </div>
            <div className="xl:w-1/2 w-full">

              <Checkbox
                disabled = {params.action === "view" || params.action === "finish"}
                name="openPits_latrinesCat2"
                value={formData.openPits_latrinesCat2 == 1 ? 0 : 1}
                checked = {formData.openPits_latrinesCat2 == 1}
                onChange={(event) =>
                  handleChange({ event, setFormStateData: setFormData })
                } // Handler for selection
                label={
                  <Typography variant="h6" color="blue-gray">
                    dry climate, ground water table lower than latrine, communal
                  </Typography>
                }
                // containerProps={{ className: "-ml-2.5" }}
                className="shrink-0"
              />

              {/* <Typography variant="h6" color="blue-gray">
              dry climate, ground water table lower than latrine, communal
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="openPits_latrinesCat2"
                value = {formData.openPits_latrinesCat2}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              /> */}
            </div>
          </div>

          <div className="w-full flex  flex-wrap xl:flex-nowrap">
            <div className="xl:w-1/2 w-full">

              <Checkbox
                disabled = {params.action === "view" || params.action === "finish"}
                name="openPits_latrinesCat3"
                value={formData.openPits_latrinesCat3 == 1 ? 0 : 1}
                checked = {formData.openPits_latrinesCat3 == 1}
                onChange={(event) =>
                  handleChange({ event, setFormStateData: setFormData })
                } // Handler for selection
                label={
                  <Typography variant="h6" color="blue-gray">
                    wet climate/flush water use, ground water table than latrine	
                  </Typography>
                }
                className="shrink-0"
                // containerProps={{ className: "-ml-2.5" }}
              />

              {/* <Typography variant="h6" color="blue-gray">
              wet climate/flush water use, ground water table than latrine		

              </Typography>
              <Input
                disabled={params.action === "view"}
                name="openPits_latrinesCat3"
                value = {formData.openPits_latrinesCat3}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              /> */}
            </div>

            <div className="xl:w-1/2 w-full">

                
              <Checkbox
                disabled = {params.action === "view" || params.action === "finish"}
                name="openPits_latrinesCat4"
                value={formData.openPits_latrinesCat4 == 1 ? 0 : 1}
                checked = {formData.openPits_latrinesCat4 == 1}
                onChange={(event) =>
                  handleChange({ event, setFormStateData: setFormData })
                } // Handler for selection
                label={
                  <Typography variant="h6" color="blue-gray">
                    regular sedimentremoval for fertilizer	
                  </Typography>
                }
                className="shrink-0"
                // containerProps={{ className: "-ml-2.5" }}
              />

              {/* <Typography variant="h6" color="blue-gray">
                regular sedimentremoval for <br/> fertilizer				
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="openPits_latrinesCat4"
                value = {formData.openPits_latrinesCat4}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              /> */}
            </div>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md">
          <div>
            <InformationCircleIcon className="w-8 h-8" color="white" />
          </div>
          <Typography color="white">River Discharge</Typography>
        </div>



        <div className="flex gap-2 justify-around flex-wrap xl:flex-nowrap">
        <div className="w-full flex flex-wrap xl:flex-nowrap">
            <div className="xl:w-1/2 w-full ">
              <Checkbox
                disabled = {params.action === "view" || params.action === "finish"}
                name="riverDischargeCat1"
                value={formData.riverDischargeCat1 == 1 ? 0 : 1}
                onChange={(event) =>
                  handleChange({ event, setFormStateData: setFormData })
                } // Handler for selection
                checked = {formData.riverDischargeCat1 == 1}
                label={
                  <Typography variant="h6" color="blue-gray">
                    Walang pagdaloy at kulang sa oxygen na ilog 
                    (Stagnant oxygen deficient rivers and lakes)
                  </Typography>
                }
                className="shrink-0"
               
              />

              {/* <Typography variant="h6" color="blue-gray">
                Walang pagdaloy at kulang sa oxygen na ilog <br/>
                (Stagnant oxygen deficient rivers and lakes)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="riverDischargeCat1"
                value = {formData.riverDischargeCat1}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              /> */}
              
            </div>
            <div className="xl:w-1/2 w-full">

              <Checkbox
                disabled = {params.action === "view" || params.action === "finish"}
                name="riverDischargeCat2"
                value={formData.riverDischargeCat2 == 1 ? 0 : 1}
                onChange={(event) =>
                  handleChange({ event, setFormStateData: setFormData })
                } // Handler for selection
                checked = {formData.riverDischargeCat2 == 1}
                label={
                  <Typography variant="h6" color="blue-gray">
                    ilog, lawa, at estero 
                    (Rivers, lakes, estuaries)
                  </Typography>
                }
                className="shrink-0"
                // containerProps={{ className: "-ml-2.5" }}
              />
              {/* <Typography variant="h6" color="blue-gray">
                ilog, lawa, at estero <br/>
                (Rivers, lakes, estuaries)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="riverDischargeCat2"
                value = {formData.riverDischargeCat2}
                onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              /> */}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
              <Button 
                  fullWidth 
                  className="flex justify-center"
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

      </Card>
    </div>
    </>
  );
};

export default WasteWaterForm;
