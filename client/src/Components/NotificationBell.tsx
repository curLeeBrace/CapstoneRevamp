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
import { Link } from "react-router-dom";


const NotificationBell = () => {
  const userInfo = useUserInfo();
  const [notificationList, setNotificationList] = useState<any[]>();
  const [isLoading, set_isLoading] = useState(false);
  const [openNotiff, setOpenNotiff] = useState(false)
  const [notiffCount, setNotiffCount] = useState(0);

    

  useEffect(()=>{
    getNotiffication()
    .then((lenth)=> setNotiffCount(lenth));

    const intervalId = setInterval(()=>{
      getNotiffication()
    .then((lenth)=> setNotiffCount(lenth));
    }, 120000);


    
    return () => clearInterval(intervalId);

  },[])





  useEffect(() => {
      if(openNotiff){
        setNotiffCount(0)
        getNotiffication();
      }

  }, [openNotiff]);



  const getNotiffication = async () : Promise<number> =>{

    let notiffLength = 0;
    set_isLoading(true);
    const nottiff_data = await axios.get("/notiff/get-mobile-combustion/req-update-notification", {
      params: {
        municipality_code: userInfo.municipality_code,
      },
    });
    notiffLength = nottiff_data.data.length;
    setNotificationList(nottiff_data.data);
    set_isLoading(false);

    return notiffLength
   
  }




  return (
    <div>
      <Menu open = {openNotiff} handler={setOpenNotiff}>
        <Badge content={notiffCount} overlap="circular" invisible = {notiffCount == 0}>
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
                            <Link className="h-full gap-1 flex flex-col" to = {`/surveyor/forms/view/mobile-combustion?form_id=${notiff.form_id}`}>
                                <div className="font-bold tex-black">{notiff.surveyor_name}</div>
                                    <div className="text-sm text-nowrap">
                                        Request an Survey Update!
                                </div>
                            </Link>
                      
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
