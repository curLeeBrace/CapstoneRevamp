import { useEffect, useState } from "react";
import {useParams } from "react-router-dom"

import axios from "../../api/axios";
import InfoBox from "../../Components/InfoBox";
import { Spinner } from "@material-tailwind/react";

function AccountVerification() {
  const {acc_id, token} = useParams()
  const [verified, setVerified] = useState<boolean>();
  const [isLoading, set_isLoading] = useState<boolean>(false);
  
  useEffect(()=>{
    set_isLoading(true);
    axios.post('/account/verify', {acc_id, token})
    .then(res => {
      if(res.status === 200){
        setVerified(true);
        // return to login Page
      } else{
        
        setVerified(false);

      }
      
    })
    .catch((error) => {
     
      console.log(error)
     
    })
    .finally(()=>{
        set_isLoading(false);
    })

  }, [])

  
  return (
    <>
      {
        isLoading === true ?
          <div className="absolute w-full h-full flex justify-center items-center">
              <Spinner/>

          </div>
        :  
        verified
          ?  <InfoBox type="sucsess" message="Account Verified!" link="/login" info="Press 'Go back' to sign in."/>
          :  <InfoBox type="failed" message="404 Token Not Found" link="/login" color="red" info=""/>
      }
     
      
    </>
  )
}
 
export default AccountVerification
