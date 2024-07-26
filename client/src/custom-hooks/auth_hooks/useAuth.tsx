import { useState, useContext, createContext, ReactNode, useEffect } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import Cookies from "js-cookie";
interface AuthProps {
  children: ReactNode;
}

interface AuthProv {
  token: string | undefined;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthProv>({} as AuthProv);

export function AuthProvider({ children }: AuthProps) {
  const [token, setTokenState] = useState<string | undefined>(() => {
    // Initialize state from localStorage
    return localStorage.getItem("token") || undefined;
  });

  const navigate = useNavigate();
  const recoverRoute = useMatch("/recover");
  const verifyAcc = useMatch("/verify/account/:acc_id/:token");
  const forgotRoute = useMatch("/forgot-pass");

// Set token and save it
  const setToken = (token: string) => {
    setTokenState(token);
    Cookies.set("token", token);
  };

  // Logout function to clear token and navigate to home
  const logout = () => {
    setTokenState(undefined);
    Cookies.remove("token");
    Cookies.remove("user_info");
    navigate('/', { replace: true });
  };

// navigate to home if token is not set and not in specific route
  useEffect(() => {
    console.log("token:", token);

    if (!recoverRoute && !verifyAcc && !forgotRoute) {
      if (token === "" || token === undefined) {
        navigate('/', { replace: true });
      }
    }
  }, [token, navigate, recoverRoute, verifyAcc, forgotRoute]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};