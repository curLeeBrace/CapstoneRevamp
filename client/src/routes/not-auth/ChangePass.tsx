import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import useHandleChange from "../../custom-hooks/useHandleChange";
import AlertBox from "../../Components/Forms/AlertBox";
import Cookies from "js-cookie";
import { user_info } from "./LogIn";
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import CryptoJS from "crypto-js";

export function ChangePass() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alert_msg, setAlertMsg] = useState<string>("");
  const [isLoading, set_isLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();



  const [formData, setFormData] = useState({
    new_pass : "",
    re_newPass : ""
  });
  const handle_change = useHandleChange;


  const changePass = (e:React.FormEvent) => {
    e.preventDefault();
    const {new_pass, re_newPass} = formData;
    const user_info = JSON.parse(Cookies.get('user_info') as string) as user_info;
    if(new_pass === ""){
      setAlertMsg("Field is Empty!");
      setOpenAlert(true);
    }else if(new_pass !== re_newPass){
      setAlertMsg("Password are not the same!");
      setOpenAlert(true);
    }else if(new_pass.length < 8){
      setAlertMsg("Password must atleast greater than 8 characters");
      setOpenAlert(true);
    } else {
      set_isLoading(true);
      const {email} = user_info;
      const secret_key : string = process.env.SECRET_KEY as string;
      const encrypt_pass =  CryptoJS.AES.encrypt(formData.new_pass, secret_key);

      axiosPrivate.post('/account/change-pass', {
        newPass : encrypt_pass.toString(),
        email,
      })
      .then(res => {
        if(res.status === 200){
          setAlertMsg("Password Changed!");
          setOpenAlert(true);
          setFormData({new_pass :"", re_newPass : ""});
        } else {
          setAlertMsg(res.statusText);
          setOpenAlert(true);
        }
        set_isLoading(false);
      })

      .catch(err => {
        console.error(err);
        set_isLoading(false);
        setAlertMsg("Server Error!");
        setOpenAlert(true);
      })


    }

  }


  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gradient-to-t from-green-400 via-green-200 to-slate-50">
      <div className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 shadow-2xl bg-white rounded-xl relative">
        <AlertBox message={alert_msg} openAlert = {openAlert} setOpenAlert={setOpenAlert}/>
        <Typography variant="h3" color="blue-gray" className="mb-2 text-center">
          Change your Password
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px] text-center">
          Enter your password
        </Typography>
        <form onSubmit={changePass} className="mx-auto max-w-[24rem] text-left">
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
              name = "new_pass"
              value={formData.new_pass}
              onChange={(event)=>handle_change({event, setFormStateData : setFormData})}
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
              name="re_newPass"
              onChange={(event)=>handle_change({event, setFormStateData : setFormData})}
              value={formData.re_newPass}
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
          <Button color="gray" size="lg" className="mt-6" fullWidth type="submit" loading = {isLoading}>
            Submit
          </Button>

         
        </form>
      </div>
    </div>
  );
}

export default ChangePass;
