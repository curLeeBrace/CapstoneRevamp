import {useAuth} from "./useAuth"
import axios  from "../../api/axios";
import Cookies from "js-cookie";

function useRefreshToken() {
    const {setToken} = useAuth();
    //request to server, to refresh acces token or generate new access token because it expired..
    const refresh = async () => {
        const refresh_token = Cookies.get('refresh_token') as string;
        const response  = await axios.post('/token/refresh', {refresh_token});
        const {acces_token} = response.data;

        setToken(acces_token)
        return acces_token

    }

  return refresh
}

export default useRefreshToken