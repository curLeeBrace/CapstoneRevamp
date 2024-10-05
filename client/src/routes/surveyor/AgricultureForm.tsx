import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AlertBox from "../../Components/Forms/AlertBox";
import useUserInfo from "../../custom-hooks/useUserType";
import BrgyMenu from "../../custom-hooks/BrgyMenu";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import useHandleChange from "../../custom-hooks/useHandleChange";
import useSurveyFormActions from "../../custom-hooks/useSurveyFormActions";
import DialogBox from "../../Components/DialogBox";






type AgricultureCropsType = {

    rdsi : number
    rdsr : number
    rwsi : number
    rwsr : number
    crop_residues : number
    dol_limestone : number

}


type AgricultureLiveStockType = {

    buffalo : number
    cattle : number
    goat : number
    horse : number
    poultry : number
    swine : number
    non_dairyCattle : number
  
}





export function AgricultureForm() {
  const params = useParams();
  const user_info = useUserInfo();
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const { state } = useLocation();
  const handlechange = useHandleChange;
  const {submitForm} = useSurveyFormActions()






  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState("");
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [crops, setCrops] = useState<AgricultureCropsType>(
    {
     
        rdsi : 0,
        rdsr : 0,
        rwsi : 0,
        rwsr : 0,
        crop_residues : 0,
        dol_limestone : 0,
      
    }
  );
  const [liveStock, setLiveStock] = useState<AgricultureLiveStockType>({
 
      buffalo : 0,
      cattle : 0,
      goat : 0,
      horse : 0,
      non_dairyCattle : 0,
      poultry : 0,
      swine : 0
    
  });




  const preparePayload = () : {} => {
    const {email, full_name, municipality_name, municipality_code, province_code} = user_info;
    let payload = {
      survey_data : {
        crops : crops,
        live_stock : liveStock,
        brgy_name : brgy?.address_name, brgy_code : brgy?.address_code
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
    if(brgy?.address_name){
 
      setOpenDialogBox(true);
    } else {
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Some field are empty!");
    }
  }



  const clearForm = () => {
    setLiveStock({
      buffalo : 0,
      cattle : 0,
      goat : 0,
      horse : 0,
      non_dairyCattle : 0,
      poultry : 0,
      swine :0
    })

    setCrops({
      crop_residues : 0,
      dol_limestone : 0,
      rdsi : 0,
      rdsr : 0,
      rwsi : 0,
      rwsr : 0
    })
  }



  
  const submitHandler = () => {
    const payload = preparePayload();
    
    submitForm({payload, form_category : "agriculture"})
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
    /////////////!!!!!!!!!!!!!!!!!!!!!!!!EMPTYYYY
  }


  const acceptUpdateHandler = () => {
    /////////////!!!!!!!!!!!!!!!!!!!!!!!!EMPTYYYY
  }









  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden">
        <DialogBox open = {openDialogBox} setOpen={setOpenDialogBox} message = 'Please double check the data before submitting' label='Confirmation' submit={
        params.action === "submit" ? submitHandler
        : params.action === "update" ? updateHandler
        :acceptUpdateHandler
      } />
      <AlertBox openAlert={openAlert} setOpenAlert={setOpenAlert} message={alert_msg} />

      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-2/3 px-6 py-6 shadow-black shadow-2xl rounded-xl">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Agriculture Survey
        </Typography>

        <form className="mt-8 mb-2 max-w-screen-lg w-full">
          {/* Barangay Menu */}
          <div className="mb-6 w-56">
            <BrgyMenu
              disabled={params.action === "view"}
              municipality_code={user_info.municipality_code}
              setBrgys={setBrgy}
              deafult_brgyName={state && state.brgy_name}
            />
          </div>

          {/* Crops Section */}   
          <Typography className="text-md font-bold mb-4 text-lg">
            Crops
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Dry Season, Irrigated (Has)</Typography>
              <Input
                name="rdsi"
                value={crops.rdsi}
                onChange={(e)=>handlechange({event : e, setFormStateData : setCrops})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Dry Season, Rainfed (Has)</Typography>
              <Input
                name="rdsr"
                value={crops.rdsr}
                onChange={(e)=>handlechange({event : e, setFormStateData : setCrops})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Wet Season, Irrigated (Has)</Typography>
              <Input
                value={crops.rwsi}
                name="rwsi"
                onChange={(e)=>handlechange({event : e, setFormStateData : setCrops})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Wet Season, Rainfed (Has)</Typography>
              <Input
                name="rwsr"
                value={crops.rwsr}
                onChange={(e)=>handlechange({event : e, setFormStateData : setCrops})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Crops Residue (Tons)</Typography>
              <Input
                name="crop_residues"
                value={crops.crop_residues}
                onChange={(e)=>handlechange({event : e, setFormStateData : setCrops})}

                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>
                Dolomite and/or Limestone Consumption (Kg)
              </Typography>
              <Input
                name="dol_limestone"
                value={crops.dol_limestone}
                onChange={(e)=>handlechange({event : e, setFormStateData : setCrops})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* Livestock Section */}
          <Typography className="text-md font-bold mb-4 text-lg mt-8">
            Livestock
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Typography>Buffalo (Heads)</Typography>
              <Input
                name="buffalo"
                value={liveStock.buffalo}
                onChange={(e)=>handlechange({event : e, setFormStateData : setLiveStock})}
              
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography>Dairy Cattle (Heads)</Typography>
              <Input
                name="cattle"
                value={liveStock.cattle}
                onChange={(e)=>handlechange({event : e, setFormStateData : setLiveStock})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography>Goat (Heads)</Typography>
              <Input
                name="goat"
                value={liveStock.goat}
                onChange={(e)=>handlechange({event : e, setFormStateData : setLiveStock})}

                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography>Horse (Heads)</Typography>
              <Input
                name="horse"
                value={liveStock.horse}
                onChange={(e)=>handlechange({event : e, setFormStateData : setLiveStock})}

                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography>Non-Dairy Cattle (Heads)</Typography>
              <Input
                name="non_dairyCattle"
                value={liveStock.non_dairyCattle}
                onChange={(e)=>handlechange({event : e, setFormStateData : setLiveStock})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Typography>Poultry (Heads)</Typography>
              <Input
                name="poultry"
                value={liveStock.poultry}
                onChange={(e)=>handlechange({event : e, setFormStateData : setLiveStock})}
                type="number"
                placeholder="0"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div>
              <Typography>Swine (Heads)</Typography>
              <Input
               name="swine"
               value={liveStock.swine}
               onChange={(e)=>handlechange({event : e, setFormStateData : setLiveStock})}
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
              className="w-64 md:w-full"
              loading={isLoading}
              onClick={submitValidation}
            >
              {params.action === "submit"
                ? "Submit"
                : params.action === "update"
                ? "Request Update"
                : "Accept Update"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
