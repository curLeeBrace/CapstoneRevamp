import Municipality from "../../custom-hooks/Municipality";
import { useState, useEffect, Fragment } from "react";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import { Avatar, Typography } from "@material-tailwind/react";
import Skeleton from "../Skeleton";
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../../custom-hooks/useUserType";




const TB_HEADER = ["Profile", "Name",  "Municipality","Mobile Combustion", "Waste Water", "Industrial", "Agriculture", "Stationary"]

const SurveyorInfo = () => {
  const [address, setAddress] = useState<AddressReturnDataType>();
  const [accs, setAccs] = useState<any[]>();

  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const userInfo = useUserInfo()
  
  useEffect(() => {
  const {user_type} = userInfo
  if(user_type === "s-admin") {
    setIsLoading(true)
    axiosPrivate
      .get(`dashboard/get-surveyor-info/${address?.address_code}/${user_type}`)
      .then((res) => {
        setAccs(res.data);
        // console.log("Sheeesh Accounts! : ", res.data);
      })
      .catch((err) => console.log(err))
      .finally(()=>setIsLoading(false))
  }

  }, [address]);

  useEffect(() => {
    const {user_type, municipality_code} = userInfo;

    if(user_type === "lgu_admin"){
      axiosPrivate
      .get(`dashboard/get-surveyor-info/${municipality_code}/${user_type}`)
      .then((res) => {
        setAccs(res.data);
        // console.log("Sheeesh Accounts! : ", res.data);
      })
      .catch((err) => console.log(err))
      .finally(()=>setIsLoading(false))
    }

  },[])



  // console.log("Accs : ", accs);

 
  return (
    <div className="h-full flex flex-col gap-5 w-full px-2">
      <Typography
        className="self-center text-2xl font-semibold text-gray-800"
        color="black"
      >
        {`Surveyor Information`}
      </Typography>
      <div className="flex gap-5 sticky top-0 z-10 text-nowrap">
        <div> 
          <Municipality setAddress={setAddress}/>
        </div>
        
      </div>
      {
        !isLoading?
        <div className="overflow-auto bg-gray-500/10 h-full px-5 rounded-md">
            <div className={`grid grid-flow-col py-2 grid-cols-4 gap-8 min-w-96 font-bold text-sm`}>
                {
                  TB_HEADER.map((head, index) => (
                    <div className="text-normal" key={index}>
                        {head}
                    </div>
                  ))
                }
  
            </div>
            {accs ? accs.map((acc, index) => (
                    <Fragment key={index}>
                    <div className="shadow-md bg-white rounded-md p-2 my-2 min-w-96">
                        <div className={`grid grid-flow-col items-center grid-cols-8 text-center text-sm`}>
                          <Avatar
                              variant="circular"
                              size="md"
                              className="border border-gray-900 p-0.5"
                              src={`https://drive.google.com/thumbnail?id=${acc.img_id}&sz=w1000`}
                          />
                          <div className="text-black text-wrap overflow-hidden mr-10">{acc.full_name}</div>
                          <div className="text-black text-wrap overflow-hidden ml-2">{acc.municipality_name}</div>
                          <div className="text-black text-wrap overflow-hidden ml-10 ">{acc.mobileCombustionSurveyCount}</div>
                          <div className="text-black text-wrap overflow-hidden ml-20 ">{acc.wasteWaterSurveyCount}</div>
                          <div className="text-black text-wrap overflow-hidden ml-20">{acc.industrialSurveyCount}</div>
                          <div className="text-black text-wrap overflow-hidden ml-10">{acc.agricultureSurveyCount}</div>
                          <div className="text-black text-wrap overflow-hidden ">{acc.stationarySurveyCount}</div>

                          
                        </div>
                    </div>
                    </Fragment>
                ))
                : null}

        </div> : <Skeleton/>
      
      }
        
    </div>
  );
};

export default SurveyorInfo;
