import { useState } from "react";

import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

export function ChangePass() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const togglePasswordVisiblity2 = () => setPasswordShown2((cur) => !cur);


  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gradient-to-t from-green-400 via-green-200 to-slate-50">
      <div className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 shadow-2xl bg-white rounded-xl">
        <Typography variant="h3" color="blue-gray" className="mb-2 text-center">
          Change your Password
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px] text-sm text-center">
        Password must be at least 8 characters long and contains
          atleast One (1) <br/> Upper and Lower Case, Digit and Special characters.
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
        <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Confirm Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              type={passwordShown2 ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity2}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>
          <Button color="gray" size="lg" className="mt-6" fullWidth>
            Submit
          </Button>

         
        </form>
      </div>
    </div>
  );
}

export default ChangePass;
