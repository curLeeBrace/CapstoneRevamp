import useUserInfo from "./useUserType";





const useSelectAllData = (muni_code : string | undefined, brgy_code : string | undefined) : boolean => {

    const userInfo = useUserInfo();
    console.log("muni_code : ", muni_code);
    console.log("brgy_code : ", brgy_code)
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