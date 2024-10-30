import { Button, Input, Typography } from "@material-tailwind/react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import useUserInfo from "../../../custom-hooks/useUserType";
import { useEffect, useState } from "react";

import useSurveyFormActions from "../../../custom-hooks/useSurveyFormActions";
import useHandleChange from "../../../custom-hooks/useHandleChange";
import DialogBox from "../../../Components/DialogBox";

import { useAgricultureContextData } from "./AgricultureForm";
import useInputValidation from "../../../custom-hooks/useInputValidation";

type AgricultureCropsType = {
  rdsi: number;
  rdsr: number;
  rwsi: number;
  rwsr: number;
  crop_residues: number;
  dol_limestone: number;
};

const Crops = () => {
  const params = useParams();
  const user_info = useUserInfo();
  const handlechange = useHandleChange;
  const { submitForm, acceptFormUpdate, finishForm, updateForm } =
    useSurveyFormActions();
  const agricultureData = useAgricultureContextData();

  const [isLoading, set_isLoading] = useState<boolean>(false);
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [crops, setCrops] = useState<AgricultureCropsType>({
    rdsi: 0,
    rdsr: 0,
    rwsi: 0,
    rwsr: 0,
    crop_residues: 0,
    dol_limestone: 0,
  });

  const [searchParams] = useSearchParams();
  const { state } = useLocation();

  useInputValidation(crops, setCrops, 999);

  useEffect(() => {
    const { action } = params;
    if (action !== "submit") {
      setCrops(state);
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
        crops: crops,
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
    const isDataFilled = Object.values(crops).some(
      (value) => value && value.toString().trim() !== ""
    );
    const { brgy, setAlertMsg, setOpenAlert } = agricultureData;

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
    setCrops({
      crop_residues: 0,
      dol_limestone: 0,
      rdsi: 0,
      rdsr: 0,
      rwsi: 0,
      rwsr: 0,
    });
  };

  const submitHandler = () => {
    const payload = preparePayload();
    const { setAlertMsg, setOpenAlert } = agricultureData;
   set_isLoading(true);


    submitForm({ payload, form_category: "agriculture-crops" })
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
        set_isLoading(false);

      });
  };

  const updateHandler = () => {
    const payload = preparePayload();
    const form_id = searchParams.get("form_id");
    const { setAlertMsg, setOpenAlert } = agricultureData;

    updateForm({
      payload,
      form_id: form_id as string,
      form_category: "agriculture-crops",
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
   set_isLoading(true);

    acceptFormUpdate({
      form_id: form_id as string,
      form_category: "agriculture-crops",
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
   set_isLoading(true);

    finishForm({
      form_id: form_id as string,
      form_category: "agriculture-crops",
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
        isLoading = {isLoading}
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

      {/* Crops Section */}
      <Typography className="text-md font-bold mb-4 text-lg">Crops</Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Typography>Dry Season, Irrigated (Has)</Typography>
          <Input
            disabled={params.action === "view" || params.action === "finish"}
            name="rdsi"
            value={crops.rdsi}
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setCrops })
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
          <Typography>Dry Season, Rainfed (Has)</Typography>
          <Input
            disabled={params.action === "view" || params.action === "finish"}
            name="rdsr"
            value={crops.rdsr}
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setCrops })
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
          <Typography>Wet Season, Irrigated (Has)</Typography>
          <Input
            disabled={params.action === "view" || params.action === "finish"}
            value={crops.rwsi}
            name="rwsi"
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setCrops })
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
          <Typography>Wet Season, Rainfed (Has)</Typography>
          <Input
            disabled={params.action === "view" || params.action === "finish"}
            name="rwsr"
            value={crops.rwsr}
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setCrops })
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
          <Typography>Crops Residue (Tons)</Typography>
          <Input
            disabled={params.action === "view" || params.action === "finish"}
            name="crop_residues"
            value={crops.crop_residues}
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setCrops })
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
          <Typography>Dolomite and/or Limestone Consumption (Kg)</Typography>
          <Input
            disabled={params.action === "view" || params.action === "finish"}
            name="dol_limestone"
            value={crops.dol_limestone}
            onChange={(e) =>
              handlechange({ event: e, setFormStateData: setCrops })
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
            : params.action === "view"
            ? "Accept Update"
            : "Okay"}
        </Button>
      </div>
    </div>
  );
};

export default Crops;
