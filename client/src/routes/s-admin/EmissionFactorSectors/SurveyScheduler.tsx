import Table from "../../../Components/Table"
import { Button } from "@material-tailwind/react"
import { useEffect, useState } from "react";




const btn_scheduleHandler = () => {

}


// const 

const SurveyScheduler = () => {
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



    useEffect(() => {
        
    },[])
    
    return (
        <div className="p-5 fixed w-full h-full">
            <div className="flex flex-col items-center w-full">
                <div className="w-full font-bold bg-darkgreen text-white text-2xl rounded-lg text-center py-2">Schedule Survey For {new Date().getFullYear().toString()}</div>

                <div className="w-full bg-black h-full">
                    <Table
                        tb_head={tb_head}
                        thbg_color="green" 
                        tb_datas={survey_category.map((category, index) => {



                            return [
                                category.label,
                                "1 week", // need variable
                                "Dec 3, 2024",
                                "Dec 10, 2024",
                                <div className="text-green-500">active</div>,
                                <Button className="">Set Schedule</Button>

                            ]
                        })}
                    />
                </div>
            </div>


        </div>
    )
}



export default SurveyScheduler