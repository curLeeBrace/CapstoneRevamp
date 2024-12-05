import {format, intervalToDuration} from "date-fns"
import { useEffect, useState } from "react"
import SimpleCard from "../../Components/Dashboard/SimpleCard"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"

interface SurveyInformationProps {
    form_schedInfo : {
        start_date : Date,
        deadline : Date,
        status? : string
    } | undefined
}
const SurveyInformation = ({form_schedInfo} : SurveyInformationProps) => {
    

    const [duration, setDuration] = useState<string>();

    useEffect(()=>{
        if(form_schedInfo){
            const getDuration = intervalToDuration({start : form_schedInfo.start_date, end : form_schedInfo.deadline});
            const {months, days} = getDuration
            setDuration(`${months ? months : "0"} Month(s) and ${days ? days : "0"} Day(s)`)
        }

    },[[form_schedInfo]])

    return (
        <div className="w-full fixed h-full flex justify-center items-center left-0 top-0">
            {
                form_schedInfo ?   
                    // <p className="w-1/2">
                    //     The schedule from this survey form has not yet started; it will become visible on {format(form_schedInfo.start_date, "MMMM dd, yyyy")}, with a deadline of {format(form_schedInfo.deadline, "MMMM dd, yyyy")}, giving it a duration of {duration}.
                    // </p>
                      <div className="lg:w-full lg:mx-80 mx-4"> 
                      <SimpleCard 
                        body={`The schedule for this survey form has not yet started; it will become visible on ${format(form_schedInfo.start_date, "MMMM dd, yyyy")}, with a deadline of ${format(form_schedInfo.deadline, "MMMM dd, yyyy")}, giving it a duration of ${duration}.`} 
                        header="" 
                        icon={<ExclamationTriangleIcon className="h-full w-full" />} 
                        />
                      </div>
                : 

                // <Typography variant="h6">There is no Schedule yet for this Form!</Typography>
                <div className="lg:w-full lg:mx-80 mx-4"> 
                <SimpleCard body={"The schedule for this survey form has not been set yet!"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
                </div>
               
                
            }
          
            
        </div>
    )
}


export default SurveyInformation