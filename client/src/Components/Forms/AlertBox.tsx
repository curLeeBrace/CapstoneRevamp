import { Alert } from "@material-tailwind/react";
import { Dispatch, useEffect } from "react";

interface AlertBoxProps {
  openAlert: boolean;
  message : string;
  setOpenAlert : Dispatch<React.SetStateAction<boolean>>;
}


function IconOutlined() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}


function AlertBox({openAlert, message, setOpenAlert}: AlertBoxProps) {
  

     useEffect(()=>{
      let setTimeOut = setTimeout(()=>{
        setOpenAlert(false)
      }, 2 * 1000)
      
      return () => {
        clearTimeout(setTimeOut);
      }

     },[openAlert])


  return (
    <>
          <Alert
            className="fixed top-20 z-10 w-1/2 flex left-1/4"
            icon = {<IconOutlined/>}
            onClose={()=>setOpenAlert(false)}
            open={openAlert}
          >
              {message}
          
          </Alert>

    </>
  );
}

export default AlertBox;
