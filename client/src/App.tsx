import { Routes, Route} from "react-router-dom";
import { AuthProvider, useAuth} from "./custom-hooks/auth_hooks/useAuth";
import {StickyNavbar} from "./Components/StickyNavBar";
import DashBoard from "./routes/DashBoard"
import Account from "./routes/Account";
import { StationaryForm } from "./Components/Forms/StationaryForm";
import HomePage from "./routes/HomePage";
import LogIn from "./Components/LoginForms/LogIn";
import ForgotPass from "./Components/LoginForms/ForgotPass";
import SignUp from "./Components/LoginForms/SignUp";
import ChangePass from "./Components/LoginForms/ChangePass";


function App() {
  const auth = useAuth();
  return (
    <AuthProvider>
      {/* {
        auth.token && <StickyNavbar/>
      } */}
        <StickyNavbar/>
        <Routes>
          {/* ayusin mo na lang pag may user na */}
            <Route path="login" element = {<LogIn/>}></Route>
            <Route path = 'forgot-pass' element = {<ForgotPass/>}/>
            <Route path="/" element = {<LogIn/>}/>

            <Route path = 'dashboard' element = {<DashBoard/>}/>
            <Route path = 'account' element = {<Account/>}/>


              {/* <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'form' element = {<StationaryForm/>}/>
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'sign-up' element = {<SignUp/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/> */}
             
          

            
        </Routes>
    </AuthProvider>
  )
}

export default App
