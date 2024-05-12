import { useState, useContext, createContext, ReactNode, useEffect} from "react";
import {useNavigate, useMatch} from "react-router-dom"


 interface AuthProps{
    children : ReactNode;
    
}
interface AuthProv {
    token : string;
    setToken: (token : string)=>string;

}

const AuthContext = createContext({} as AuthProv);


export function AuthProvider ({children} : AuthProps) {
    const [token, setToken] = useState<string>("");
    const navigate = useNavigate()
    const recoverRoute = useMatch("/recover");
    
    const testRoute = useMatch('/testArea/:children');
    const verfiyAcc = useMatch('/verify/account/:acc_id/:token')
   

    useEffect(()=>{

        if(!recoverRoute && !testRoute && !verfiyAcc){

            if(token === "" || token === undefined ){
                navigate('/', {replace : true})
            }
        }

    // console.log(token   )


    },[token])
    
    
    return(
        <AuthContext.Provider value = {{token, setToken} as AuthProv}>

            {children}

        </AuthContext.Provider>
    )
    
}

export const useAuth = () => {
    return useContext(AuthContext);
}