import useUserInfo from "./useUserType";





const useSelectAllData = (muni_code : string | undefined, brgy_code : string | undefined) : boolean => {

    const userInfo = useUserInfo();

    let selectAll = false;
        
    if (userInfo.user_type === "s-admin") {
      if (muni_code == undefined ) {
          selectAll = true
      } else {
          selectAll = false
      }

    } else if (userInfo.user_type === "lgu_admin") {
      if (brgy_code == undefined) {
          selectAll = true
      } else {
          selectAll = false
      }
    }


    return selectAll
}


export default useSelectAllData