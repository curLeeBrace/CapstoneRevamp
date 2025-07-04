import { Routes, Route} from "react-router-dom";
import { AuthProvider} from "./custom-hooks/auth_hooks/useAuth";
import {StickyNavbar} from "./Components/StickyNavBar";


import Registration from "./routes/s-admin/Registration";
import RegistrationCompleted from "./routes/s-admin/RegistrationCompleted";
import AccountVerification from "./routes/not-auth/AccountVerification";





import DashBoard from "./routes/s-admin/DashBoard"
import { MobileCombustionForm } from "./routes/surveyor/MobileCombustionForm";
import HomePage from "./routes/HomePage";
import LogIn from "./routes/not-auth/LogIn";
import ForgotPass from "./routes/not-auth/ForgotPass";
import ChangePass from "./routes/not-auth/ChangePass";
import AuditLogs from "./routes/s-admin/AuditLogs";
import AccountsTable from "./routes/s-admin/AccountsTable";

//summaryRoute
import SummaryData from "./routes/summary/SummaryData";
import IndustrialSummary from "./routes/summary/industrial/IndustrialSummary";
import AgricultureSummary from "./routes/summary/agriculture/AgricultureSummary";
import StationarySummary from "./routes/summary/StationarySummary";
import GHGeSummary from "./routes/summary/GHGeSummary";

//survey List Data
import SurveyedList from "./routes/surveyor/SurveyListData/SurveyedList";
import IndustrialList from "./routes/surveyor/SurveyListData/IndustrialList";
import AgricultureList from "./routes/surveyor/SurveyListData/AgricultureList";
import ForestAndLandUseList from "./routes/surveyor/SurveyListData/ForestAndLandUseList";


import WasteWaterForm from "./routes/surveyor/WasteWaterForm";
import { IndustrialForm, Chemical, Electronics, Metal, Mineral, Others} from "./routes/surveyor/IndustrialForm/IndustrialForm";

import { AgricultureForm, Crops, LiveStocks} from "./routes/surveyor/AgricultureForm/AgricultureForm";


import SurveyScheduler from "./routes/ScheduleSurvey/SurveyScheduler";


import { StationaryFuelForm } from "./routes/surveyor/StationaryFuelForm";
import EmissionFactorForm from "./routes/s-admin/EmissionFactor";
// import EmissionFactorForm from "./routes/s-admin/EmissionFactor";
import { ForestLands, ForestryForm, Wood } from "./routes/surveyor/ForestryForm/ForestryForm";
import ForestrySummary from "./routes/summary/ForestryLandUse/ForestrySummary";


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
              <Route index element = {<HomePage/>}/>
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = "dashboard" element = {<DashBoard/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/>
              <Route path = "audit-log" element = {<AuditLogs/>}/>
              <Route path = "accounts" element = {<AccountsTable/>}/>
              <Route path = "emission-factor" element = {<EmissionFactorForm/>}/>
              
                  {/* Summary Route */}
            <Route path = "summary/0/:survey_category" element = {<SummaryData/>}/> {/* For Mobile Combustion and Waste Water*/}
            <Route path = "summary/1/industrial" element = {<IndustrialSummary/>}/> {/* For industial*/}
            <Route path = "summary/2/agriculture" element = {<AgricultureSummary/>}/>
            <Route path = "summary/3/stationary" element = {<StationarySummary/>}/>
            <Route path = "summary/4/ghge" element = {<GHGeSummary/>}/>
            <Route path = "summary/5/forestry" element = {<ForestrySummary/>}/> 
            

              <Route path = 'register'>
                  <Route index element = {<Registration/>}/>
                  <Route path = 'sucsess' element = {<RegistrationCompleted/>}/>
              </Route> 

              {/* <Route path = 'survey-schedule' element = {<FormHandler/>}/> */}

            </Route>

            {/*Route for Admin*/}
            <Route path = "/lgu_admin">
            <Route index element = {<HomePage/>}/>
            <Route path = 'home' element = {<HomePage/>}/>
            <Route path = "dashboard" element = {<DashBoard/>}/>
            {/* <Route path = "accounts" element = {<AccountsTable/>}/> */}
            {/* Summary Route */}
            <Route path = "summary/0/:survey_category" element = {<SummaryData/>}/> {/* For Mobile Combustion and Waste Water*/}
            <Route path = "summary/1/industrial" element = {<IndustrialSummary/>}/> {/* For industial*/}
            <Route path = "summary/2/agriculture" element = {<AgricultureSummary/>}/>
            <Route path = "summary/3/stationary" element = {<StationarySummary/>}/>
            <Route path = "summary/4/ghge" element = {<GHGeSummary/>}/>
            <Route path = "summary/5/forestry" element = {<ForestrySummary/>}/> 



              <Route path = 'register'>
                    <Route index element = {<Registration/>}/>
                    <Route path = 'sucsess' element = {<RegistrationCompleted/>}/>
              </Route> 
              <Route path = 'change-pass' element = {<ChangePass/>}/> 
              <Route path = "audit-log" element = {<AuditLogs/>}/>
              <Route path = "accounts" element = {<AccountsTable/>}/>

              <Route path = 'survey-schedule' element = {<SurveyScheduler/>}/>
            </Route>



            <Route path = "/lu_admin">
              <Route index element = {<HomePage/>}/>
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = "dashboard" element = {<DashBoard/>}/>
              <Route path = 'change-pass' element = {<ChangePass/>}/>
              <Route path = "audit-log" element = {<AuditLogs/>}/>
              <Route path = "accounts" element = {<AccountsTable/>}/>
              {/* <Route path = "emission-factor" element = {<EmissionFactorForm/>}/> */}
              
                  {/* Summary Route */}
            <Route path = "summary/0/:survey_category" element = {<SummaryData/>}/> {/* For Mobile Combustion and Waste Water*/}
            <Route path = "summary/1/industrial" element = {<IndustrialSummary/>}/> {/* For industial*/}
            <Route path = "summary/2/agriculture" element = {<AgricultureSummary/>}/>
            <Route path = "summary/3/stationary" element = {<StationarySummary/>}/>
            <Route path = "summary/5/forestry" element = {<ForestrySummary/>}/> 
            <Route path = "summary/4/ghge" element = {<GHGeSummary/>}/>
            

              <Route path = 'register'>
                  <Route index element = {<Registration/>}/>
                  <Route path = 'sucsess' element = {<RegistrationCompleted/>}/>
              </Route> 
              <Route path = 'survey-schedule' element = {<SurveyScheduler/>}/>
            </Route>


              {/*Route for Surveyor*/}
            <Route path = "/surveyor">
              <Route index element = {<HomePage/>}/>
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'forms'>
                <Route path = ':action/mobile-combustion' element = {<MobileCombustionForm/>}/>
                <Route path = ':action/waste-water' element = {<WasteWaterForm/>}/>

                <Route path = 'industrial' element = {<IndustrialForm/>}>
                  <Route path=":action/0/:industrial_type" element = {<Mineral/>}/>
                  <Route path=":action/1/:industrial_type" element = {<Chemical/>}/>
                  <Route path=":action/2/:industrial_type" element = {<Metal/>}/>
                  <Route path=":action/3/:industrial_type" element = {<Electronics/>}/>
                  <Route path=":action/4/:industrial_type" element = {<Others/>}/>
                </Route>
            
                <Route path = 'forestry-land-use' element = {<ForestryForm/>}>
                  <Route path=":action/0/:forestry_type" element = {<Wood/>}/>
                  <Route path=":action/1/:forestry_type" element = {<ForestLands/>}/>
                </Route>


                <Route path = 'agriculture' element = {<AgricultureForm/>}>
                  <Route path=":action/0/:agriculture_type" element = {<Crops/>}/>
                  <Route path=":action/1/:agriculture_type" element = {<LiveStocks/>}/>
                </Route>

                <Route path = ':action/stationary' element = {<StationaryFuelForm/>}/>
              </Route>
              
              <Route path="surveyed-list">

                <Route path="0/:survey_category" element = {<SurveyedList/>} />
                <Route path="1/industrial" element = {<IndustrialList/>}/>
                <Route path ="2/agriculture" element ={<AgricultureList/>}/>
                <Route path = "3/falu" element = {<ForestAndLandUseList/>}/>
                {/* <Route */}
              
              </Route>

              <Route path = 'change-pass' element = {<ChangePass/>}/>
            </Route>



            <Route path = "/lu_surveyor">
              <Route index element = {<HomePage/>}/>
              <Route path = 'home' element = {<HomePage/>}/>
              <Route path = 'forms'>
                <Route path = ':action/mobile-combustion' element = {<MobileCombustionForm/>}/>
                <Route path = ':action/waste-water' element = {<WasteWaterForm/>}/>

                <Route path = 'industrial' element = {<IndustrialForm/>}>
                  <Route path=":action/0/:industrial_type" element = {<Mineral/>}/>
                  <Route path=":action/1/:industrial_type" element = {<Chemical/>}/>
                  <Route path=":action/2/:industrial_type" element = {<Metal/>}/>
                  <Route path=":action/3/:industrial_type" element = {<Electronics/>}/>
                  <Route path=":action/4/:industrial_type" element = {<Others/>}/>
                </Route>

                <Route path = 'forestry-land-use' element = {<ForestryForm/>}>
                  <Route path=":action/0/:forestry_type" element = {<Wood/>}/>
                  <Route path=":action/1/:forestry_type" element = {<ForestLands/>}/>
                </Route>


                <Route path = 'agriculture' element = {<AgricultureForm/>}>
                  <Route path=":action/0/:agriculture_type" element = {<Crops/>}/>
                  <Route path=":action/1/:agriculture_type" element = {<LiveStocks/>}/>
                </Route>


                <Route path = ':action/stationary' element = {<StationaryFuelForm/>}/>
              </Route>
              
              <Route path="surveyed-list">

                <Route path="0/:survey_category" element = {<SurveyedList/>} />
                <Route path="1/industrial" element = {<IndustrialList/>}/>
                <Route path ="2/agriculture" element ={<AgricultureList/>}/>
                <Route path = "3/falu" element = {<ForestAndLandUseList/>}/>

                {/* <Route */}
              
              </Route>

              <Route path = 'change-pass' element = {<ChangePass/>}/>
            </Route>


          
            <Route path="*"
              element={
                <div className="flex items-center justify-center h-screen">
                  <img
                    src="/img/notfound.jpg"
                    alt="404 NOT FOUND!"
                    className="max-h-screen"
                  />
                </div>
              }
            />


            
        </Routes>
    </AuthProvider>
  )
}

export default App