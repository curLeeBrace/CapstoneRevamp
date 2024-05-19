import {axiosPivate} from "../../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./useAuth";



//handle client request to the server with authentication using jwt token
function useAxiosPrivate() {
    const refresh = useRefreshToken();
    const {token} = useAuth(); // get the token in useAuth custtom hooks
    useEffect(()=>{
      //set Auth Header if the client was firs time requesting to the server
      const requestInterceptor = axiosPivate.interceptors.request.use(
        config => {
            if(!config.headers['Authorization']){
              config.headers['Authorization'] = `Bearer ${token}`;
             
            }
            return config;

      }, (error) => Promise.reject(error))

      //Re request the prev request of the client if the response status is 403 or forbidden, it means the 
      //token is expired and need to refresh, then set it again to Auth Header before, Re request to the server

      const responseInterceptor = axiosPivate.interceptors.response.use(
        response => response,
        async(error) => {
            console.log(error);
            const prevRequest = error.config;
            if(error.response.status === 403 && !prevRequest.sent){
              prevRequest.sent = true;
              const newAccessToken = await refresh();
              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axiosPivate(prevRequest);
            }
            return Promise.reject(error);
          }

      )

      return(()=>{
        //eject all interceptor if this com,ponent are unmount..
        axiosPivate.interceptors.request.eject(requestInterceptor);
        axiosPivate.interceptors.response.eject(responseInterceptor);
      })
    },[token, refresh])


  return  axiosPivate;
} 

export default useAxiosPrivate