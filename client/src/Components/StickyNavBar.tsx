import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

import {
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

import { NavLink } from "react-router-dom";
// import ProfileMenu from "./ProfileMenu";
import NavListMenu from "./NavListMenu";
import ProfileMenu from "./ProfileMenu";

const profileMenuItems = [
  // {
  //   label: "My Profile",
  //   icon: UserCircleIcon,
  // },
  {
    label: "Change Password",
    icon: Cog6ToothIcon,
    to: "/change-pass",
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
    to: "",
  },
];

const navListMenuItems = [
  {
    title: "Stationary Fuel Combustion",
    description: "Fill up form for Fuel Combustion Inventory",
    href: "/stationary-fuel",
  },
  
  
];
 
export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  // const [isNavOpen, setIsNavOpen] = React.useState(false);
 
  // const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
 


  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal lg:hover:scale-110 ease-in-out duration-100"
      >
        <NavLink className={
          ({ isActive, isPending }) =>
            isPending ? "" : isActive ? "font-extrabold" : ""
          } to={'/dashboard'}>
          DashBoard
        </NavLink>
  
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal lg:hover:scale-110 ease-in-out duration-100"
      >
        <NavLink className={
          ({ isActive, isPending }) =>
            isPending ? "" : isActive ? "font-extrabold" : ""
          } to={'/account'}>
          Account
        </NavLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal lg:hover:scale-110 ease-in-out duration-100"
      >
          <NavLink className={
          ({ isActive, isPending }) =>
            isPending ? "" : isActive ? "font-extrabold" : ""
          } to={'/home'}>
          Home
        </NavLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal lg:hover:scale-110 ease-in-out duration-100"
      >
         <NavLink className={
          ({ isActive, isPending }) =>
            isPending ? "" : isActive ? "font-extrabold" : ""
          } to={'/form'}>
          <NavListMenu navListMenuItems={navListMenuItems} />
        </NavLink>
        
      </Typography>
    </ul>
  );







 
  return (
    <div className="max-h-[768px] w-full sticky top-0 z-20">
      <Navbar className="h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            LCCAO - (Dito na lang display ung user type)
          </Typography>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="flex items-center gap-x-1">
              

              <NavLink className={
          ({ isActive, isPending }) =>
            isPending ? "" : isActive ? "font-extrabold" : ""
          } to={'/login'}>
          <Button
                variant="text"
                size="sm"
                className="hidden lg:inline-block"
                
              >
                <span>Log In</span>
                
              </Button>
        </NavLink>
            <NavLink to="/sign-up">
              <Button
                variant="gradient"
                size="sm"
                className="hidden lg:inline-block"
              >
                <span>Sign up</span>
              </Button>
              </NavLink>
            </div>
            

            <ProfileMenu menuItems={profileMenuItems} />

            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        
        <MobileNav open={openNav}>
          {navList}
          
          <div className="flex items-center gap-x-1">
            <NavLink to="login" className="w-full">
            <Button fullWidth variant="text" size="sm" className="">
              <span>Log In</span>
            </Button>
            </NavLink>
            <NavLink to="sign-up" className="w-full">
            <Button fullWidth variant="gradient" size="sm" className="">
              <span>Sign Up</span>
            </Button>
            </NavLink>
          </div>
          
        </MobileNav>
        
      </Navbar>
    </div>
  );
}