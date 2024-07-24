import {useAuth} from "./useAuth"
import axios  from "../../api/axios";
import Cookies from "js-cookie";

function useRefreshToken() {
    const { setToken, logout } = useAuth();
    //request to server, to refresh acces token or generate new access token because it expired..
    const refresh = async () => {
      try{
        const {refresh_token} = JSON.parse(Cookies.get('user_info') as string);
        // const refresh_token = Cookies.get('refresh_token') as string;

        const response  = await axios.post('/token/refresh', {refresh_token});
        const {acces_token} = response.data;

        setToken(acces_token)
        return acces_token

      }catch (error) {
        console.error("Error refreshing token", error);
        logout();
      }
    }

  return refresh
}

export default useRefreshToken