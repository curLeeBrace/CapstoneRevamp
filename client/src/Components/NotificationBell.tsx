import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
  Avatar,
} from "@material-tailwind/react";
import { BellIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import useUserInfo from "../custom-hooks/useUserType";
import Skeleton from "./Skeleton";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../custom-hooks/auth_hooks/useAxiosPrivate";

const NotificationBell = () => {
  const axiosPrivate = useAxiosPrivate();
  const {user_type, municipality_code} = useUserInfo();
  const [notificationList, setNotificationList] = useState<any[]>();
  const [isLoading, set_isLoading] = useState(false);
  const [openNotiff, setOpenNotiff] = useState(false);
  const [notiffCount, setNotiffCount] = useState(0);
  const action = user_type === "lgu_admin" ? "view" : "finish"

  useEffect(() => {
    getNotiffication().then((lenth) => setNotiffCount(lenth));

    // const intervalId = setInterval(() => {
    //   getNotiffication().then((lenth) => setNotiffCount(lenth));
    // }, 120000);

    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (openNotiff) {
      setNotiffCount(0);
      getNotiffication();
    }
  }, [openNotiff]);




  const getNotiffication = async (): Promise<number> => {
    let notiffLength = 0;
    set_isLoading(true);
    const nottiff_data = await axiosPrivate.get("/notiff/get-notification", {
      params: {
        municipality_code : municipality_code,
        user_type
      },
    });
    notiffLength = nottiff_data.data.length;
    setNotificationList(nottiff_data.data);
    set_isLoading(false);

    return notiffLength;
  };




  const notiffLink = (state : {}, url : string, surveyorName : string) => {
    return (
      <Link
        className="h-full gap-1 flex flex-col"
        to={url}
        state={state}
      >
        <div className="font-bold tex-black">{surveyorName}</div>
        <div className="text-sm text-nowrap">
          {user_type === "lgu_admin" ? "Request an Survey Update!" : "Update Accepted!"}
        </div>
      </Link>
    );
  };

  return (
    <div>
      <Menu open={openNotiff} handler={setOpenNotiff}>
        <Badge
          content={notiffCount}
          overlap="circular"
          invisible={notiffCount == 0}
        >
          <MenuHandler>
            <IconButton className="bg-transparent shadow-none">
              <BellIcon className="h-full w-full" />
            </IconButton>
          </MenuHandler>
        </Badge>
        <MenuList className="h-auto max-h-64 w-72">
          {!isLoading ? (
            notificationList ? (
              notificationList.map(({
                form_category,
                full_name,
                img_id,
                form_id,
                survey_data,}) => (
                <MenuItem className="h-16 flex">
                  <div className="h-full w-3/12">
                    <Avatar
                      variant="circular"
                      size="sm"
                      className="border border-gray-900 w-11 h-11"
                      src={`https://drive.google.com/thumbnail?id=${img_id}&sz=w1000`}
                    />
                  </div>
                  {
                    form_category === "mobile-combustion" ? 
                    notiffLink(
                      {
                        brgy_name: survey_data.brgy_name,
                        vehicle_type: survey_data.vehicle_type,
                        vehicle_age: survey_data.vehicle_age,
                        fuel_type: survey_data.fuel_type,
                        liters_consumption: survey_data.liters_consumption,
                        form_type: survey_data.form_type,
                      }, 
                      `/surveyor/forms/${action}/${form_category}?form_id=${form_id}`,
                        full_name
                    ) : form_category === "waste-water" ?
                    notiffLink(
                      {
                        brgy_name: survey_data.brgy_name,
                        form_type: survey_data.form_type,
                        septic_tanks: survey_data.septic_tanks,
                        openPits_latrinesCat1:
                          survey_data.openPits_latrines.cat1,
                        openPits_latrinesCat2:
                          survey_data.openPits_latrines.cat2,
                        openPits_latrinesCat3:
                          survey_data.openPits_latrines.cat3,
                        openPits_latrinesCat4:
                          survey_data.openPits_latrines.cat4,
                        riverDischargeCat1: survey_data.riverDischarge.cat1,
                        riverDischargeCat2: survey_data.riverDischarge.cat2,
                      },
                      `/surveyor/forms/${action}/${form_category}?form_id=${form_id}`,
                    full_name
                  ) 
                  :form_category === "industrial-mineral" ?
                    notiffLink({
                      brgy_name : survey_data.brgy_name,
                      dsi : survey_data.dsi,
                      type_ofData : survey_data.type_ofData,
                      cpp : survey_data.cpp,
                      lp : survey_data.lp,
                      cpb : survey_data.cpb,
                      gp : survey_data.gp,
                    },`/surveyor/forms/industrial/${action}/0/mineral?form_id=${form_id}`,full_name)
                  
                  :form_category === "industrial-chemical" ?
                    notiffLink({
                      brgy_name : survey_data.brgy_name, 
                      dsi : survey_data.dsi, 
                      type_ofData : survey_data.type_ofData,
                      ap : survey_data.ap,
                      sap : survey_data.sap,
                      pcbp_M : survey_data.pcbp_M,
                      pcbp_E : survey_data.pcbp_E,
                      pcbp_EDVCM : survey_data.pcbp_EDVCM,
                      pcbp_EO : survey_data.pcbp_EO,
                      pcbp_A : survey_data.pcbp_A,
                      pcbp_CB : survey_data.pcbp_CB,
                    },`/surveyor/forms/industrial/${action}/1/chemical?form_id=${form_id}`,full_name)
                  :form_category === "industrial-metal" ?
                    notiffLink({
                      brgy_name : survey_data.brgy_name,
                      dsi : survey_data.dsi,
                      type_ofData : survey_data.type_ofData,
                      ispif : survey_data.ispif,
                      ispnif : survey_data.ispnif,
                    },`/surveyor/forms/industrial/${action}/2/metal?form_id=${form_id}`,full_name)
                    
                  :form_category === "industrial-electronics" ?
                    notiffLink({
                    brgy_name : survey_data.brgy_name, 
                    dsi : survey_data.dsi, 
                    type_ofData : survey_data.type_ofData,
                    ics : survey_data.ics,
                    photovoltaics : survey_data.photovoltaics,
                    tft_FPD : survey_data.tft_FPD,
                    htf : survey_data.htf,
                    },`/surveyor/forms/industrial/${action}/3/electronics?form_id=${form_id}`,full_name)
                  :form_category === "industrial-others" ?
                    notiffLink({
                      brgy_name : survey_data.brgy_name,
                      dsi : survey_data.dsi,
                      type_ofData : survey_data.type_ofData,
                      ppi : survey_data.ppi,
                      other : survey_data.other,
                      fbi : survey_data.fbi,
                    },`/surveyor/forms/industrial/${action}/4/others?form_id=${form_id}`,full_name)
                  :form_category === "agriculture-crops" ?
                    notiffLink({
                      brgy_name : survey_data.brgy_name,
                      rdsi : survey_data.crops.rdsi,
                      rdsr : survey_data.crops.rdsr,
                      rwsi : survey_data.crops.rwsi,
                      rwsr : survey_data.crops.rwsr,
                      crop_residues : survey_data.crops.crop_residues,
                      dol_limestone : survey_data.crops.dol_limestone,
                    },`/surveyor/forms/agriculture/${action}/0/crops?form_id=${form_id}`,full_name)
                  :form_category === "agriculture-livestocks" ?
                    notiffLink({
                      brgy_name : survey_data.brgy_name,
                      buffalo : survey_data.live_stock.buffalo,
                      cattle : survey_data.live_stock.cattle,
                      goat : survey_data.live_stock.goat,
                      horse : survey_data.live_stock.horse,
                      poultry : survey_data.live_stock.poultry,
                      swine : survey_data.live_stock.swine,
                      non_dairyCattle : survey_data.live_stock.non_dairyCattle,
                    },`/surveyor/forms/agriculture/${action}/1/livestocks?form_id=${form_id}`,full_name)
                  :null
                
                }
                </MenuItem>
              ))
            ) : (
              <MenuItem> No Available Notification</MenuItem>
            )
          ) : (
            <Skeleton />
          )}
        </MenuList>
      </Menu>
    </div>
  );
};

export default NotificationBell;
