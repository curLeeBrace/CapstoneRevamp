
import { useEffect, useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { NavLink, useNavigate} from "react-router-dom";
import useHandleChange from "../../custom-hooks/useHandleChange";
import axios from "../../api/axios";
import cookie from 'js-cookie'
import { useAuth } from "../../custom-hooks/auth_hooks/useAuth";
import CryptoJS from "crypto-js";


export type user_info  = {

  email : string;
  hash_pass : string;
  municipality_code : string;
  municipality_name : string;
  province_code : string;
  access_token : string;
  refresh_token : string;
  verified : boolean;
  user_type : string;
  username : string;
  full_name : string;

}


export function LogIn() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, set_isLoading] = useState(false);
  const [formData, setFormData] = useState({
    email : "",
    password : ""
  });
  const handleChange = useHandleChange; // handle input field when chaning value
  const auth = useAuth();
  const navigate = useNavigate();



  const login = (encrypt_pass : string, email : string) => {
    set_isLoading(true);


    axios.post(`/account/login`, {email, encrypt_pass})
    .then(res => {
      set_isLoading(false);
      const {
        access_token,
        verified,
        user_type
    
      } = res.data
    
      if(res.status === 200){
        if(verified){

            auth.setToken(access_token); // store acces_token in a glbal variable
            cookie.set('user_info', JSON.stringify(res.data as user_info))

            if(user_type === "surveyor"){
              //userPage
              // alert("surveyor")
              navigate("/surveyor", {replace : true})

            } else if(user_type == "lgu_admin") {
              //AdminPage..
              alert("lgu_admin")
         
            } else {
              //SuperAdmin Page
              navigate("/s-admin", {replace : true})

             
            }
            
        } 
        
       
      }

    })
    .catch((err) => {

      if(err.response.status === 500){
        alert("Server Error!")
      } else {
        alert("Invalid Credential!")

      }
      set_isLoading(false);
     
    });
    

  }


  const onClickhandler = () =>{
    // alert("ASD")
    const secret_key : string = process.env.SECRET_KEY as string;
    const encrypt_pass = CryptoJS.AES.encrypt(formData.password, secret_key);
    console.log("encrypt", encrypt_pass.toString());
    login(encrypt_pass.toString(), formData.email);


  }

  //for auto login when page refreshed
  useEffect(()=>{
    let user_info:string = cookie.get("user_info") as string;

    if(user_info !== undefined){
      const {hash_pass, email} = JSON.parse(user_info);
      login(hash_pass, email);
    }
  },[])



  

  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gradient-to-t from-green-400 via-green-200 to-slate-50">
      <div className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-1/2 px-6 py-6 shadow-2xl bg-white rounded-xl">
        <Typography variant="h3" color="blue-gray" className="mb-2 text-center">
          Sign In
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px] text-center">
          Enter your email and password to sign in
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
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
              placeholder="name@gmail.com"
              className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
            //   "!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "hidden",
              }}
              onChange={(event)=>handleChange({event : event, setFormStateData : setFormData})}
            />
          </div>

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
              name="password"
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={()=>setPasswordShown(!passwordShown)}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }

              onChange={(event)=>handleChange({event : event, setFormStateData : setFormData})}
            />
          </div>
          <Button color="gray" size="lg" className="mt-6 flex justify-center" fullWidth onClick={onClickhandler} loading = {isLoading}>
            Login
          </Button> 
          <div className="!mt-4 flex justify-end">
          <NavLink className={
          ({ isActive, isPending }) =>
            isPending ? "" : isActive ? "font-extrabold" : ""
          } to={'/forgot-pass'}>
           <Typography
              as="a"
              href="forgot-pass"
              color="blue-gray"
              variant="small"
              className="font-medium hover:scale-110 ease-in-out duration-100"
            >
              Forgot password
            </Typography>
        </NavLink>

          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
