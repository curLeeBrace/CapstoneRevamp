import Table from "../../Components/Table"
import { Button } from "@material-tailwind/react"
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../../custom-hooks/useUserType";
import {intervalToDuration, format} from "date-fns"
import ScheduleSetter from "./ScheduleSetter";


const tb_head = ["Survey Types", "Duration", "Start-Date", "Deadline", "Status", "Action"]
//"Mobile Combustion", "Waste Water", "Industrial", "Agriculture", "Stationary", "Forest and Land Use"

const survey_category = [
    {label : "Mobile Combustion", survey_type : "mobile-combustion"},
    {label : "Waste Water", survey_type : "waste-water"},
    {label : "Industrial", survey_type : "industrial"},
    {label : "Agriculture", survey_type : "agriculture"},
    {label : "Stationary", survey_type : "stationary"},
    {label : "Forest and Land Use", survey_type : "falu"},

]



// const 

const SurveyScheduler = () => {

    const [tb_data, set_tbData] = useState<any[][]>([
        [
            survey_category[0].label,
            " ", // need variable
            " ",
            " ",
            <div className="text-red-500">inactive</div>,
            <Button className="" onClick={()=>btn_scheduleHandler(survey_category[0].survey_type, survey_category[0].label)}>Set Schedule</Button>
        ],
        [
            survey_category[1].label,
            " ", // need variable
            " ",
            " ",
            <div className="text-red-500">inactive</div>,
            <Button className="" onClick={()=>btn_scheduleHandler(survey_category[1].survey_type, survey_category[1].label)}>Set Schedule</Button>
        ],
        [
            survey_category[2].label,
            " ", // need variable
            " ",
            " ",
            <div className="text-red-500">inactive</div>,
            <Button className="" onClick={()=>btn_scheduleHandler(survey_category[2].survey_type, survey_category[2].label)}>Set Schedule</Button>
        ],
        [
            survey_category[3].label,
            " ", // need variable
            " ",
            " ",
            <div className="text-red-500">inactive</div>,
            <Button className="" onClick={()=>btn_scheduleHandler(survey_category[3].survey_type, survey_category[3].label)}>Set Schedule</Button>
        ],
        [
            survey_category[4].label,
            " ", // need variable
            " ",
            " ",
            <div className="text-red-500">inactive</div>,
            <Button className="" onClick={()=>btn_scheduleHandler(survey_category[4].survey_type, survey_category[4].label)}>Set Schedule</Button>
        ],
        [
            survey_category[5].label,
            " ", // need variable
            " ",
            " ",
            <div className="text-red-500">inactive</div>,
            <Button className="" onClick={()=>btn_scheduleHandler(survey_category[5].survey_type, survey_category[5].label)}>Set Schedule</Button>
        ],
    ]);
    const [openScheduleSetter, setOpenScheduleSetter] = useState(false);
    const [survey_type, setSurveyType] = useState<string>();
    const [surveyLabel, setSurveyLabel] = useState<string>("");   
    const [default_date, setDefaultDate] = useState<{
        start_date : Date | undefined,
        deadline : Date | undefined,
    }>({
        start_date : undefined,
        deadline : undefined
    })
    const [rmLoading, set_rmLoading] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const user_info = useUserInfo()


    const updateRow = (index:number, newValue:any[]) => {
        set_tbData(prevItems => {
        // Create a copy of the array
        const updatedItems = [...prevItems];
        // Update the specific index
        updatedItems[index] = newValue;
        return updatedItems; // Return the new array
        });
    };

    console.log("Refresh : ", refresh)
    useEffect(() => {
        
        if(refresh){
            
            axiosPrivate.get(`/survey-schedule/get-schedules/${user_info.municipality_name}`)
            .then(res => {
                // console.log(res.data)
            
                if(res.status == 200){
                    const sched_data:{
                        survey_type : string 
                        start_date : Date
                        deadline : Date
                        status : string 
                    }[] = res.data
    
          
    
                    survey_category.forEach((category, index) => {
                        
                        if(sched_data){
                            sched_data.forEach((data) => {
                                let label = ""
                                let duration = intervalToDuration({start : data.start_date, end : data.deadline})
                                if(data.survey_type === category.survey_type) label = category.label
                                if(data.survey_type === category.survey_type){
    
                                    const newRow =     
                                        [
                                            label,
                                            (`${duration.months ? duration.months : 0} Month(s), ${duration.days} Day(s)`),
                                            format(data.start_date, "MMM d, yyyy"),
                                            format(data.deadline, "MMM d, yyyy"),
                                            <div className={`${data.status == "active" ? "text-green-500" : "text-red-500"}`}>{data.status}</div>,
                                            data.status === "inactive" && !data.start_date && !data.deadline ? <Button className="" onClick={()=>btn_scheduleHandler(data.survey_type, label)}>Set Schedule</Button> 
                                            :<div className="flex gap-2 max-w-32">
                                                <Button className="shrink-0" onClick={()=>btn_scheduleHandler(data.survey_type, label, data.start_date, data.deadline)}>Edit</Button>
                                                <Button className="shrink-0" onClick={()=>removeSchedHandler(data.survey_type, user_info.municipality_name, index)} loading = {rmLoading}>Remove</Button>
                                                <span></span>
                                                
                                            </div>
                                            
                                        ]
                                    updateRow(index, newRow);
                                }
                            })
    
                        }
    
    
    
                    })
    
               
                }
            })
            .catch(err => console.log(err))
            .finally(()=>setRefresh(false))
        }
    },[refresh])


    
 
      
   
    const removeSchedHandler = (survey_type:string,municipality_name:string, index:number) => {

        let removeResult = confirm("Are you sure you want to remove schedule?");
        // console.log("removeResult : ", removeResult)
     
        if(removeResult){
            set_rmLoading(true)
            axiosPrivate.post('/survey-schedule/remove-schedule',{
                survey_type,
                municipality_name
            }).then((res) => {
                setRefresh(true);
                alert(res.data)
                updateRow(index, [
                    survey_category[index].label,
                    " ", // need variable
                    " ",
                    " ",
                    <div className="text-red-500">inactive</div>,
                    <Button className="" onClick={()=>btn_scheduleHandler(survey_category[index].survey_type, survey_category[index].label)}>Set Schedule</Button>])
            })
            .catch(err => console.log(err))
            .finally(()=>{
                
                set_rmLoading(false)
                setRefresh(true);
            })
        }
    } 


    const btn_scheduleHandler = (survey_type : string, surveyLabel : string, default_start_date? : Date, default_deadline?:Date) => {
            setSurveyType(survey_type)
            setOpenScheduleSetter(true);
            setSurveyLabel(surveyLabel)
            setDefaultDate({
                start_date : default_start_date,
                deadline : default_deadline
            })

    }
    
    return (
        <div className="p-5 fixed w-full h-full">
            {
                openScheduleSetter ? 
                    <ScheduleSetter municipality_name={user_info.municipality_name} survey_type={survey_type} openState={{open : openScheduleSetter, setOpen : setOpenScheduleSetter}} survey_label={surveyLabel} default_deadline={default_date.deadline} default_start_date={default_date.start_date} setRefresh={setRefresh}/>
                    :null
            }
            <div className="flex flex-col items-center w-full">
                <div className="w-full font-bold bg-darkgreen text-white text-2xl rounded-lg text-center py-2 mb-4">Schedule Survey For {new Date().getFullYear().toString()}</div>

                <div className="w-full ">

                    <Table
                        tb_head={tb_head}
                        thbg_color="green" 
                        tb_datas={tb_data ? tb_data : []}
                    />
                </div>
            </div>


        </div>
    )
}



export default SurveyScheduler