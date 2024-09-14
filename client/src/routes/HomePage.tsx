import { useEffect, useState } from "react";
import useUserInfo from "../custom-hooks/useUserType";



function HomePage() {

  const [link, setLink] = useState<string>();
  const userInfo = useUserInfo();

  useEffect(()=>{
    const {user_type} = userInfo;

    if(user_type === "s-admin"){
      setLink("https://www.youtube.com/embed/3TlMjZFS0kw")
    } else if(user_type === "lgu_admin"){
      setLink("https://www.youtube.com/embed/gqRvMnnc8Yk")
    } else {
      setLink("https://www.youtube.com/embed/DUruAJYgwP4")
    }




  },[])


  return (

    <div id="home" className="bg-gray-200 flex flex-wrap justify-around">

      <div className="flex flex-col gap-5 w-full xl:w-1/2 px-5">
        {/* Main Header */}
        <div className=" text-4xl lg:text-6xl text-green-700 font-serif whitespace-nowrap pt-20 text-wrap">
          Laguna Climate Change 
          Adaptation and 
          Mitigation
        </div>

        {/*Future Video Tutorial*/}

        <div className="bg-black">
          <iframe
            src={link}
            className="w-full h-96"
            allowFullScreen
          ></iframe>
        </div>

      </div>
        {/* Image */}
        <div className="self-center hidden xl:block">
            <img
              src="/img/logo/LCCAOlogo2.png"
              alt="Your Image Alt Text"
              className="rounded-3xl object-contain w-full lg:w-4/5 max-w-xl mb-2 opacity-75"
            />
       
        </div>
    </div>
  );
}

export default HomePage;
