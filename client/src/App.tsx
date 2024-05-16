import { Routes, Route} from "react-router-dom";
import { AuthProvider, useAuth} from "./custom-hooks/auth_hooks/useAuth";
import {StickyNavbar} from "./Components/StickyNavBar";

import Registration from "./routes/s-admin/Registration";
import RegistrationCompleted from "./routes/s-admin/RegistrationCompleted";
import AccountVerification from "./routes/not-auth/AccountVerification";





import DashBoard from "./routes/s-admin/DashBoard"
import { StationaryForm } from "./Components/Forms/StationaryForm";
import HomePage from "./routes/HomePage";
import LogIn from "./routes/not-auth/LogIn";
import ForgotPass from "./Components/LoginForms/ForgotPass";
import SignUp from "./Components/LoginForms/SignUp";
import ChangePass from "./Components/LoginForms/ChangePass";
import AuditLogs from "./routes/AuditLogs";
import AdminPage from "./routes/AccountsTable";
import AccountsTable from "./routes/AccountsTable";


function App() {
  
  const auth = useAuth();

  return (
    <AuthProvider>
      {/* {
        auth.token && <StickyNavbar/>
      } */}
        <StickyNavbar/>

        <Routes>
            {/*Route for Not Authorized User*/}
            <Route path="/">
              <Route index  element = {<LogIn/>}/>
              <Route path = "login"  element = {<LogIn/>}/>
              <Route path="/verify/account/:acc_id/:token" element = {<AccountVerification/>} />
            </Route>
            
            {/*Route for Super Admin*/}
            <Route path = "/s-admin">
              <Route index element = {<DashBoard/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/>


              <Route path = 'register'>
                  <Route index element = {<Registration/>}/>
                  <Route path = 'sucsess' element = {<RegistrationCompleted/>}/>
              </Route> 

            </Route>

            {/*Route for Admin*/}
            <Route path = "/admin">

            </Route>
              {/*Route for Surveyor*/}
            <Route path = "/surveyor">

            </Route>


{/* 
            <Route path = "audit-logs" element = {<AuditLogs/>}/>

            <Route path = '/register'>
                <Route index element = {<Registration/>}/>
                <Route path = 'sucsess' element = {<RegistrationCompleted/>}/>
            </Route> 
*/}




{/*             
            <Route path="login" element = {<LogIn/>}></Route>
            <Route path = 'forgot-pass' element = {<ForgotPass/>}/>
            <Route path="/" element = {<LogIn/>}/>

            <Route path = 'dashboard' element = {<DashBoard/>}/>
            <Route path = 'account' element = {<Account/>}/>


              {/* <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'form' element = {<StationaryForm/>}/>
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'sign-up' element = {<SignUp/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/> 
  */}
             
          

            
        </Routes>
    </AuthProvider>
  )
}

export default App
