
import Cookies from "js-cookie";
import { user_info } from "../routes/not-auth/LogIn";


type userInfoType = {
    user_type : string;
    municipality_code : string;
    full_name : string;
    municipality_name : string;
    province_code : string;
}

const useUserInfo = () => {
    
    const get_userInfo = ():userInfoType => {
        const user_info = Cookies.get("user_info");
        let userinfo : userInfoType = {} as userInfoType;
        if(user_info){
            const {user_type, municipality_code, full_name, municipality_name, province_code} = JSON.parse(user_info) as user_info;
             userinfo = {
                user_type,
                municipality_code,
                full_name,
                municipality_name,
                province_code

            }
            
        }

        return userinfo

    }
       


    return get_userInfo()
}


export default useUserInfo