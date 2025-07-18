import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  ChevronDownIcon,
  
} from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";
interface NavListItem {
  title: string;
  href: string;
}

interface NavListMenuProps {
  navListMenuItems: NavListItem[];
  navName : string;
  setOpenNav: React.Dispatch<React.SetStateAction<boolean>>; 

}



function NavListMenu(props: NavListMenuProps) {
  const { navListMenuItems, navName, setOpenNav } = props;

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(({ title, href }) => (
    <Link to={href} key={title}>
      <MenuItem onClick={() => setOpenNav(false)}>
        <Typography className="mb-1 text-sm">
          {title}
        </Typography>
        {/* <Typography variant="small" className="font-normal">
          {description}
        </Typography> */}
      </MenuItem>
    </Link>
  ));

  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem className="hidden items-center gap-2 font-medium lg:flex lg:rounded-full text-white">
              <Square3Stack3DIcon className="h-[18px] w-[18px]" />{" "}
              {navName}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden w-[20rem] whitespace-nowrap grid-cols-7 gap-3 overflow-visible lg:grid">
          {/* <Card color="green" shadow={false} variant="gradient" className="col-span-3 grid h-full w-full place-items-center rounded-md">
           
            <img src="./../public/img/logo/LCCAOlogo2.png" className="h-28 w-28"/>
          </Card> */}
          <ul className="col-span-8 flex w-full flex-col gap-1">
            {renderItems} {/* Ensure the correct links are rendered */}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 font-medium text-white lg:hidden">
        <Square3Stack3DIcon className="h-[18px]" />{" "}
        {navName} {" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 text-white lg:hidden">
        {renderItems} {/* Ensure correct links are rendered */}
      </ul>
    </React.Fragment>
  );
}

export default NavListMenu;