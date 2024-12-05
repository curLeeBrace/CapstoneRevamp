import { Typography } from "@material-tailwind/react"
import {format, intervalToDuration} from "date-fns"
import { useEffect, useState } from "react"

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

    },[])

    return (
        <div className="w-full fixed h-full flex justify-center items-center left-0 top-0">
            {
                form_schedInfo ?   
                    <p className="w-1/2">
                        The schedule from this survey form has not yet started; it will become visible on {format(form_schedInfo.start_date, "MMMM dd, yyyy")}, with a deadline of {format(form_schedInfo.deadline, "MMMM dd, yyyy")}, giving it a duration of {duration}.
                    </p>
                : 

                <Typography variant="h6">There is no Schedule yet for this Form!</Typography>
               
                
            }
          
            {/* <div className="flex flex-col gap-2">

            </div> */}
        </div>
    )
}


export default SurveyInformation