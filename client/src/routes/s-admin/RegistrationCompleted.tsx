import InfoBox from "../../Components/InfoBox";

   
  export function RegistrationCompleted() {
  
    return (
        
        <InfoBox type="sucsess" message="Registered Succesfully" link="/account" info="Open verification link sent to your e-mail."/>
      
    );

  }

  export default RegistrationCompleted