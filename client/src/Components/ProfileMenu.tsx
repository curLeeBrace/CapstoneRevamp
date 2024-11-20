  import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  Avatar,
} from "@material-tailwind/react";
import { ChevronDownIcon, PencilIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import {Cog6ToothIcon, PowerIcon, FaceSmileIcon} from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../custom-hooks/auth_hooks/useAuth";
import useUserInfo from "../custom-hooks/useUserType";


interface ProfileMenuItem {
  label: string;
  icon: React.ComponentType<any>;
  onClick? : ()=>any;
}



const ProfileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const [menuItems, setMenuItems] = useState<ProfileMenuItem[]>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user_info = useUserInfo();
  
  // console.log(JSON.parse(Cookies.get('user_info') as string))
  //`https://drive.google.com/thumbnail?id=${detail.img_id}&sz=w1000`

  useEffect(()=>{



    setMenuItems([
      {
        label: user_info.full_name,
        icon: FaceSmileIcon,
        // onClick: ()=> navigate(`/${user_type}/dashboard`),
      },
      {
        label: "Change Password",
        icon: Cog6ToothIcon,
        onClick: ()=> navigate(`/${user_info.user_type}/change-pass`),
      },
      ...(user_info.user_type === 'lu_admin' || user_info.user_type === 's-admin'
        ? [
            {
              label: "Update Emission Factor",
              icon: PencilIcon,
              onClick: () => navigate(`/${user_info.user_type}/emission-factor`),
            },
          ]
        : []),
      {
        label: "Sign Out",
        icon: PowerIcon,
        onClick: ()=>{
          navigate(`/`, {replace:true})
          Cookies.remove('user_info');
          navigate(`/`);
          window.location.reload();
          logout();
        }
      },
     
    ])
  },[])


// console.log(JSON.parse(Cookies.get('user_info') as string));




  return (

    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto text-white"
        >
          {user_info.user_type === "s-admin" ? <UserCircleIcon className="h-full w-10"/>:
          
            <Avatar
              variant="circular"
              size="sm"
              className="border border-white p-0.5"
              src={`https://drive.google.com/thumbnail?id=${user_info.img_id}&sz=w1000`}
            />
          }
          
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {menuItems  &&  menuItems.map(({ label, icon, onClick}, key) => {
          const isLastItem = key === menuItems.length - 1;
          const Icon = icon; // Capitalize component name

          return (
            <Button
              variant="text"
              size="sm"
              key={label}
              onClick={()=>{
                closeMenu();
                onClick && onClick()
              }}
              className={`flex items-center gap-2 rounded w-full ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isLastItem ? "text-red-500" : ""}`}
                strokeWidth={2}
              />
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </Button>
           
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
