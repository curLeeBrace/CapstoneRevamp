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
import axios from "../api/axios";
import useUserInfo from "../custom-hooks/useUserType";
import Skeleton from "./Skeleton";

const NotificationBell = () => {
  const userInfo = useUserInfo();
  const [notificationList, setNotificationList] = useState<any[]>();
  const [isLoading, set_isLoading] = useState(false);
  const [openNotiff, setOpenNotiff] = useState(false)


    // const openNotiff = () => {

    // }


  useEffect(() => {
    if(openNotiff) {
        set_isLoading(true);
        axios
          .get("/notiff/get-mobile-combustion/req-update-notification", {
            params: {
              municipality_code: userInfo.municipality_code,
            },
          })
          .then((res) => {
            setNotificationList(res.data)
            // console.log("NOTIFICATION ! ", res.data);
          })
          .catch((err) => console.log(err))
          .finally(()=>set_isLoading(false));

    }
  }, [openNotiff]);

  return (
    <div>
      <Menu open = {openNotiff} handler={setOpenNotiff}>
        <Badge content="5" overlap="circular">
          <MenuHandler>
            <IconButton className="bg-transparent shadow-none">
              <BellIcon className="h-full w-full" />
            </IconButton>
          </MenuHandler>
        </Badge>
        <MenuList className="h-auto max-h-64 w-72">
            {
                !isLoading ? 
                    notificationList ? (
                        notificationList.map((notiff) => (
                        <MenuItem className="h-16 flex">
                            <div className="h-full w-3/12">
                            <Avatar
                                variant="circular"
                                size="sm"
                                className="border border-gray-900 w-11 h-11"
                                src={`https://drive.google.com/thumbnail?id=${notiff.img_id}&sz=w1000`}
                            />
                            </div>
                            <div className="h-full gap-1 flex flex-col">
                            <div className="font-bold tex-black">{notiff.surveyor_name}</div>
                            <div className="text-sm text-nowrap">
                                Request an Survey Update!
                            </div>
                            </div>
                        </MenuItem>
                        ))
                    ) : (
                        <MenuItem> No Available Notification</MenuItem>
                    )
                :<Skeleton/>
            }
          
        </MenuList>
      </Menu>
    </div>
  );
};

export default NotificationBell;
