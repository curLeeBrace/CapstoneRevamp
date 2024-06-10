import { Typography, Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../../api/axios";
import AlertBox from "../../Components/Forms/AlertBox";
import useHandleChange from "../../custom-hooks/useHandleChange";
const ForgotPass = () => {
  const [formData, setFormData] = useState({email : ""});
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alert_msg, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = useHandleChange;
  const submitHandler = (e : React.FormEvent) => {
    e.preventDefault();
    if(formData.email !== ""){
      setIsLoading(true);
      axios.post('/account/recover', {email: formData.email})
      .then(res => {
        setIsLoading(false);
        setAlertMessage(res.data);
        setOpenAlert(true)
        setFormData({email : ""});
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        setAlertMessage("Error Occured!");
        setOpenAlert(true)
      })
    } else {
        setAlertMessage("Field is Empty!");
        setOpenAlert(true)
    }
  }
  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gradient-to-t from-green-400 via-green-200 to-slate-50">
      <div className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 shadow-2xl bg-white rounded-xl relative">
      <img src="/img/logo/LCCAOlogo2.png" className=" max-w-48 mx-auto"/>
        <AlertBox message={alert_msg} openAlert= {openAlert} setOpenAlert={setOpenAlert}/>
        <Typography variant="h3" color="blue-gray" className="mb-2 text-center">
          Retrieve Account
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px] text-center">
          Enter your email and you will receive an e-mail.
        </Typography>
        <form onSubmit={submitHandler} className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
              value={formData.email}
              placeholder="name@gmail.com"
              className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
            //   "!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
    
          <Button color="gray" size="lg" className="mt-6" fullWidth type="submit" loading = {isLoading}>
            Submit
          </Button>
          <div className="!mt-4 flex justify-end">
            <NavLink to={'/login'}>
            <Typography
              as="a"
              color="blue-gray"
              variant="small"
              className="font-medium hover:scale-110 ease-in-out duration-100"
            >
              Back to Login
            </Typography>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPass;
