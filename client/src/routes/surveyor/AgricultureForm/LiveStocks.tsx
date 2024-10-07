import { Button, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import { useParams } from "react-router-dom";
import useUserInfo from "../../../custom-hooks/useUserType";
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import { useAgricultureContextData } from "./AgricultureForm";
import DialogBox from "../../../Components/DialogBox";

type AgricultureLiveStockType = {
  buffalo: number;
  cattle: number;
  goat: number;
  horse: number;
  poultry: number;
  swine: number;
  non_dairyCattle: number;
};

const LiveStocks = () => {
  const params = useParams();
  const user_info = useUserInfo();
  const handlechange = useHandleChange;
  const { submitForm } = useSurveyFormActions();
  const agricultureData = useAgricultureContextData();

  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);

  const [liveStock, setLiveStock] = useState<AgricultureLiveStockType>({
    buffalo: 0,
    cattle: 0,
    goat: 0,
    horse: 0,
    non_dairyCattle: 0,
    poultry: 0,
    swine: 0,
  });

  const preparePayload = (): {} => {
    const { brgy } = agricultureData;
    const {
      email,
      full_name,
      municipality_name,
      municipality_code,
      province_code,
    } = user_info;
    let payload = {
      survey_data: {
        live_stock : liveStock,
        brgy_name: brgy?.address_name,
        brgy_code: brgy?.address_code,
      },

      surveyor_info: {
        email,
        full_name,
        municipality_name,
        municipality_code,
        province_code,
        img_id: user_info.img_id,
      },
      dateTime_created: new Date(),
      dateTime_edited: null,
    };

    return payload;
  };

  const submitValidation = () => {
    const { brgy, setAlertMsg, setOpenAlert } = agricultureData;
    if (brgy?.address_name) {
      setOpenDialogBox(true);
    } else {
      set_isLoading(false);
      setOpenAlert(true);
      setAlertMsg("Some field are empty!");
    }
  };

  const clearForm = () => {
   setLiveStock({
        buffalo : 0,
        cattle : 0,
        goat : 0,
        horse : 0,
        non_dairyCattle : 0,
        poultry : 0,
        swine : 0,
   })
  };

  const submitHandler = () => {
    const payload = preparePayload();
    const { setAlertMsg, setOpenAlert } = agricultureData;

    submitForm({ payload, form_category: "agriculture-livestocks" })
      .then((res) => {
        if (res.status === 201) {
          setOpenAlert(true);
          setAlertMsg("Sucsessfully Submitted!");
          clearForm();
        }

        set_isLoading(false);
      })
      .catch((err) => {
        console.log(err);
        set_isLoading(false);
        setOpenAlert(true);
        setAlertMsg("Server Error!");
      })
      .finally(() => {
        setOpenDialogBox(false);
      });
  };

  const updateHandler = () => {
    /////////////!!!!!!!!!!!!!!!!!!!!!!!!EMPTYYYY
  };

  const acceptUpdateHandler = () => {
    /////////////!!!!!!!!!!!!!!!!!!!!!!!!EMPTYYYY
  };



  
  return (
    <div>
        <DialogBox
            open={openDialogBox}
            setOpen={setOpenDialogBox}
            message="Please double check the data before submitting"
            label="Confirmation"
            submit={
            params.action === "submit"
                ? submitHandler
                : params.action === "update"
                ? updateHandler
                : acceptUpdateHandler
            }
        />
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
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setLiveStock })
            }
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
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setLiveStock })
            }
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
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setLiveStock })
            }
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
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setLiveStock })
            }
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
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setLiveStock })
            }
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
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setLiveStock })
            }
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
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setLiveStock })
            }
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
    </div>
  );
};

export default LiveStocks;
