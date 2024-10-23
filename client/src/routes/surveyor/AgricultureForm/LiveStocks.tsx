import { Button, Input, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import useUserInfo from "../../../custom-hooks/useUserType";
import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import { useAgricultureContextData } from "./AgricultureForm";
import DialogBox from "../../../Components/DialogBox";
import useInputValidation from "../../../custom-hooks/useInputValidation";

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
  const { submitForm, acceptFormUpdate, finishForm, updateForm} = useSurveyFormActions();
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
  const [searchParams] = useSearchParams();
  const { state } = useLocation();

  useInputValidation(liveStock, setLiveStock, 999);


  useEffect(() => {
    const { action } = params;
    if (action !== "submit") {
      setLiveStock(state);
    } else {
      clearForm();
    }
  }, [searchParams]);

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
    const isDataFilled = Object.values(liveStock).some(value => value && value.toString().trim() !== '');
    const {brgy, setAlertMsg, setOpenAlert} = agricultureData

    if (!isDataFilled) {
      set_isLoading(false);
      setAlertMsg("You haven't input anything yet. Kindly fill-up the form.");
      setOpenAlert(true);
      return;
    }
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
    const payload = preparePayload();
    const form_id = searchParams.get("form_id");
    const { setAlertMsg, setOpenAlert } = agricultureData;

    updateForm({
      payload,
      form_id: form_id as string,
      form_category: "agriculture-livestocks",
    })
      .then((res) => {
        if (res.status === 204) {
          alert("can't request update because form data not found!");
        } else if (res.status === 200) {
          setOpenAlert(true);
          setAlertMsg(res.data);
          setOpenDialogBox(false);
        }
      })
      .catch((err) => {
        console.log(err);
        set_isLoading(false);
        setOpenAlert(true);
        setAlertMsg("Server Error!");
      })
      .finally(() => {
        set_isLoading(false);
        setOpenDialogBox(false);
      });
  };

  const acceptUpdateHandler = () => {
    const form_id = searchParams.get("form_id");
    const { setAlertMsg, setOpenAlert } = agricultureData;
    acceptFormUpdate({
      form_id: form_id as string,
      form_category: "agriculture-livestocks",
    })
      .then((res) => {
        if (res.status === 204) {
          alert("can't accep request update because form data not found!");
        } else if (res.status === 200) {
          setOpenAlert(true);
          setAlertMsg(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        set_isLoading(false);
        setOpenAlert(true);
        setAlertMsg("Server Error!");
      })
      .finally(() => {
        set_isLoading(false);
        setOpenDialogBox(false);
      });
  };


  const finishHandler = () => {
    const form_id = searchParams.get("form_id");
    const { setAlertMsg, setOpenAlert } = agricultureData;
    finishForm({
      form_id: form_id as string,
      form_category: "agriculture-livestocks",
    })
      .then((res) => {
        if (res.status === 204) {
          alert("can't accep request update because form data not found!");
        } else if (res.status === 200) {
          setOpenAlert(true);
          setAlertMsg(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
        set_isLoading(false);
        setOpenAlert(true);
        setAlertMsg("Server Error!");
      })
      .finally(() => {
        set_isLoading(false);
        setOpenDialogBox(false);
      });
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
              : params.action === "view"
              ? acceptUpdateHandler
              : finishHandler
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
            disabled={params.action === "view" || params.action === "finish"}
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
            disabled={params.action === "view" || params.action === "finish"}
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
            disabled={params.action === "view" || params.action === "finish"}
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
            disabled={params.action === "view" || params.action === "finish"}
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
            disabled={params.action === "view" || params.action === "finish"}
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
            disabled={params.action === "view" || params.action === "finish"}
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
            disabled={params.action === "view" || params.action === "finish"}
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

export default LiveStocks;
