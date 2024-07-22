import { Routes, Route} from "react-router-dom";
import { AuthProvider} from "./custom-hooks/auth_hooks/useAuth";
import {StickyNavbar} from "./Components/StickyNavBar";


import Registration from "./routes/s-admin/Registration";
import RegistrationCompleted from "./routes/s-admin/RegistrationCompleted";
import AccountVerification from "./routes/not-auth/AccountVerification";





import DashBoard from "./routes/s-admin/DashBoard"
import { StationaryForm } from "./Components/Forms/StationaryForm";
import HomePage from "./routes/HomePage";
import LogIn from "./routes/not-auth/LogIn";
import ForgotPass from "./routes/not-auth/ForgotPass";
import ChangePass from "./routes/not-auth/ChangePass";
import AuditLogs from "./routes/s-admin/AuditLogs";
import AccountsTable from "./routes/s-admin/AccountsTable";
import MobileCombustionSummary from "./routes/s-admin/MobileCombustionSummary";


import SurveyedList from "./routes/surveyor/SurveyedList";


function App() {
 
  return (
    <AuthProvider>
        <StickyNavbar/>

        <Routes>
            {/*Route for Not Authorized User*/}
            <Route path="/">
              <Route index  element = {<LogIn/>}/>
              <Route path = "login"  element = {<LogIn/>}/>
              <Route path = 'forgot-pass' element = {<ForgotPass/>}/>
              <Route path="/verify/account/:acc_id/:token" element = {<AccountVerification/>} />

            </Route>
            
            {/*Route for Super Admin*/}
            <Route path = "/s-admin">
              <Route index element = {<DashBoard/>}/>
              <Route path = "dashboard" element = {<DashBoard/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/>
              <Route path = "audit-log" element = {<AuditLogs/>}/>
              <Route path = "accounts" element = {<AccountsTable/>}/>
              <Route path = "mobile-combustion" element = {<MobileCombustionSummary/>}/>

              <Route path = 'register'>
                  <Route index element = {<Registration/>}/>
                  <Route path = 'sucsess' element = {<RegistrationCompleted/>}/>
              </Route> 

            </Route>

            {/*Route for Admin*/}
            <Route path = "/lgu_admin">
            <Route index element = {<DashBoard/>}/>
            <Route path = "dashboard" element = {<DashBoard/>}/>
            <Route path = "mobile-combustion" element = {<MobileCombustionSummary/>}/>
              <Route path = 'register'>
                    <Route index element = {<Registration/>}/>
                    <Route path = 'sucsess' element = {<RegistrationCompleted/>}/>
              </Route> 
              <Route path = 'change-pass' element = {<ChangePass/>}/> 
              <Route path = "audit-log" element = {<AuditLogs/>}/>

            </Route>
              {/*Route for Surveyor*/}
            <Route path = "/surveyor">
              <Route index element = {<HomePage/>}/>
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'forms'>
                <Route path = ':action/:form_type' element = {<StationaryForm/>}/>
              </Route>
              <Route path="surveyed-list" element ={<SurveyedList/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/>
            </Route>

            <Route path="*" element = {<>404 not found!!</>}/>


{/* 
            <Route path = "audit-logs" element = {<AuditLogs/>}/>

      
*/}




{/*             
            <Route path="login" element = {<LogIn/>}></Route>
            
            <Route path="/" element = {<LogIn/>}/>

            <Route path = 'dashboard' element = {<DashBoard/>}/>

             
              
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'sign-up' element = {<SignUp/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/> 
  */}
             
          

            
        </Routes>
    </AuthProvider>
  )
}

export default App