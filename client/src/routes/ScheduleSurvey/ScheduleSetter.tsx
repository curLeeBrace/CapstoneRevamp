import React, { useState } from "react";
import {Button} from "@material-tailwind/react";
import DatePicker from "../../Components/Forms/DatePicker";
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";


interface ScheduleSetterProps{
    openState : {   
        open :boolean
        setOpen : React.Dispatch<React.SetStateAction<boolean>>
    },
    municipality_name : string
    survey_type : string | undefined
    survey_label : string;
    default_start_date? : Date
    default_deadline? : Date
    setRefresh : React.Dispatch<React.SetStateAction<boolean>>
   
}



 function ScheduleSetter({openState, survey_type, survey_label, default_start_date, default_deadline,municipality_name, setRefresh}:ScheduleSetterProps) {

    const {open, setOpen} = openState
    const handleOpen = () => setOpen(!open)
    const [start_date, setStartDate] = useState<Date|undefined>(default_start_date);
    const [deadline, setDeadline] = useState<Date|undefined>(default_deadline)
    const [loading, setIsLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();

    // console.log("StartDate : ", start_date);
    // console.log("Deadline : ", deadline);

    // useEffect(()=>{
    //     setStartDate(new Date())
    // },[])

    const schedHandler = () => {
        if(start_date && deadline){

            setIsLoading(true)
            axiosPrivate.post('/survey-schedule/set-schedule',{
                municipality_name,
                start_date,
                deadline,
                survey_type,
            })
            .then(res => alert(res.data))
            .catch(err =>console.log(err))
            .finally(()=>{
                handleOpen()
                setIsLoading(false);
                setRefresh(true)
            })  


        } else {
            alert("Invalid Input!!");
        }
    }

 
  return (
    <div className="fixed w-full h-full z-50 backdrop-blur-sm flex justify-center items-center top-0 left-0">

      <div className={`w-1/2 min-w-96 h-56 bg-gray-300 rounded-md flex-col flex gap-5 justify-around px-5`}>
        <div className="self-center font-semibold text-darkgreen text-xl">Set Schedule for {survey_label}</div>
        <div className="flex w-full justify-around gap-5 px-5 lg:flex-nowrap flex-wrap">
            <div className="basis-1/2">
                <DatePicker setState={{
                    date : start_date,
                    setDate : setStartDate
                }} label="Start Date"/>

            </div>
            <div className="basis-1/2">
                <DatePicker setState={{
                    date : deadline,
                    setDate : setDeadline
                }} label="Deadline"/>
            </div>
        </div>  

        <div className="self-end mr-">
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={schedHandler} disabled = {loading} loading = {loading}>
            <span>Confirm</span>
          </Button>
        </div>
      </div>

    </div>
  );
}


export default ScheduleSetter