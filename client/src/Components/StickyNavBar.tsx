import React, { Fragment, useEffect, useState } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";


import { NavLink } from "react-router-dom";
// import ProfileMenu from "./ProfileMenu";
import NavListMenu from "./NavListMenu";
import ProfileMenu from "./ProfileMenu";
import Cookies from "js-cookie";
import { useAuth } from "../custom-hooks/auth_hooks/useAuth";
//==========================FOR OUTER COMPONENTS======================================


const navListMenuItems = [
  {
    title: "Stationary Fuel Combustion",
    description: "Fill up form for Fuel Combustion Inventory",
    href: "/surveyor/forms/fuel",
  },
];

//========================================================================



export function StickyNavbar() {
  const userInfo = Cookies.get("user_info");
  const [municipality_name, set_municipality_name] = useState("");
  const [openNav, setOpenNav] = useState(false);

  const [nav, setNav] = useState([
    {
      name: "",
      url: "",
    },
  ]);

  const [u_type, set_uType] = useState('');
  const auth = useAuth();
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  useEffect(() => {
    
    if (userInfo) {
      const { user_type, municipality_name} = JSON.parse(userInfo);
      console.log("user_type : ", user_type)
      set_municipality_name(municipality_name);

      if (user_type === "s-admin") {
        set_uType("S-Admin");
        setNav([
          {
            name: "Dashboard",
            url: `/${user_type}/dashboard`,
          },
          {
            name: "Register",
            url: `/${user_type}/register`,
          },
          {
            name: "Audit Log",
            url: `/${user_type}/audit-log`,
          },
          {
            name: "Accounts",
            url: `/${user_type}/accounts`,
          },
        ]);

      } else if (user_type === "lgu_admin") {
        set_uType("Admin");
        setNav([
          {
            name: "Register",
            url: `/${user_type}/register`,
          },
          {
            name: "Dashboard",
            url: `/${user_type}/dashboard`,
          },
        ])

      } else {
        set_uType("Surveyor");
        setNav([
          {
            name: "Home",
            url: `/${user_type}/home`,
          },
        ]);
      }
    }
  }, [auth.token, userInfo]);



  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
    {nav.map((navItem, index) => (
      <Fragment key={index}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal lg:hover:scale-110 ease-in-out duration-100 text-white"
        >
          <NavLink
            className={({ isActive, isPending }) =>
              isPending ? "" : isActive ? "font-extrabold" : ""
            }
            to={navItem.url}
          >
            {navItem.name}
          </NavLink>
        </Typography>
      </Fragment>
    ))}
    {u_type === "Surveyor" &&
      <Fragment>
        <NavListMenu navListMenuItems={navListMenuItems} />
      </Fragment>
    }
  </ul>
  );

  return (
    <>
    {
      auth.token ?
        <div className="max-h-[768px] w-full sticky top-0 z-20 bg-darkgreen ">
        <Navbar className="h-max max-w-full bg-darkgreen rounded-none px-4 py-2 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between text-blue-gray-900">
            <Typography
              as="a"
              href="#"
              className="mr-4 cursor-pointer py-1.5 font-bold text-white"
            >
              {`Welcome, ${u_type === "S-Admin" ? "":municipality_name } ${u_type}`}
            </Typography>
            <div className="flex items-center gap-4 ">
              <div className="mr-4 hidden lg:block ">{navList}</div>
              
              <ProfileMenu/>

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

          <Collapse open={openNav}>
            {navList}
          </Collapse>
        </Navbar>
      </div> : null
    }
   
    </>

  );
}