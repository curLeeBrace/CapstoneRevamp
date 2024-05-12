import React, { useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  Avatar,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

interface ProfileMenuItem {
  label: string;
  icon: React.ComponentType<any>;
  to: string;
}

interface ProfileMenuProps {
  menuItems: ProfileMenuItem[];
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ menuItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            className="border border-gray-900 p-0.5"
            src="http://www.gravatar.com/avatar/?d=mp"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {menuItems.map(({ label, icon, to }, key) => {
          const isLastItem = key === menuItems.length - 1;
          const Icon = icon; // Capitalize component name

          return (
            <NavLink
              to={to}
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              <Icon
                className={`h-4 w-4 ml-4 mb-2 ${isLastItem ? "text-red-500" : ""}`}
                strokeWidth={2}
              />
              <Typography
                as="span"
                variant="small"
                className="font-normal mb-2"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
              </NavLink>
           
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
