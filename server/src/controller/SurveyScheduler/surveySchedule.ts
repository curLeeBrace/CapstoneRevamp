import { Request, Response } from 'express';
import SurveyScheduleSchema from "../../db_schema/SurveyScheduleSchema"
import datefns, { isEqual, isAfter} from 'date-fns'


const setSchedule = async(req:Request, res:Response) => {
    try {
        const {
            municipality_name,
            start_date,
            deadline,
            survey_type
        } = req.body

        const yearNow = new Date().getFullYear().toString();

        //find schedule first
        const survey_schedule = await SurveyScheduleSchema.findOneAndUpdate({
            survey_type : survey_type,
            municipality_name,
            year : yearNow
        },
        {
            survey_type,
            municipality_name,
            year : yearNow,
            start_date,
            deadline,
            status : isEqual(start_date, new Date()) || isAfter(new Date(), start_date) ? "active" : "inactive"
        });

        // await SurveyScheduleSchema.updateOne()


        //check if schedule is availale,
        //if available update only
        // if it's not available create one
        if(survey_schedule) {
            return res.send("Schedule Updated!");
        } else {
            await SurveyScheduleSchema.create({
                survey_type,
                municipality_name,
                year : yearNow,
                start_date,
                deadline,
                status : isEqual(start_date, new Date()) || isAfter(new Date(), start_date) ? "active" : "inactive"
            })
            return res.send("Schedule Created!");

        }


      
        
    } catch (error) {
        
        console.log(error)
        return res.sendStatus(500);
    }

}





const getSchedule = async(req:Request, res:Response) => {
    try {
        const {municipality_name} = req.params;
        const yearNow = new Date().getFullYear().toString();
        
        const schedules = await SurveyScheduleSchema.find({municipality_name, year : yearNow}).exec();


        if(schedules && schedules.length > 0){

            //iterate all survey schedules
            schedules.forEach(async(schedule) => {
                const {start_date, survey_type, municipality_name, } = schedule;
                const {isAfter} = datefns

                //then check if started date is = to this day or it is greater than
                //then set the status to active
                if(isAfter(new Date(), start_date as Date) || isEqual(new Date(), start_date as Date)){
                    await SurveyScheduleSchema.findOneAndUpdate({survey_type,municipality_name,year:yearNow}, {status : "active"})
                }   
            })



            return res.status(200).send(schedules);
        } else {
            return res.sendStatus(204);
        }

    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }   

}



const removeSchedule = async (req:Request, res:Response) => {

    try {
        const {
            survey_type,
            municipality_name,

        } = req.body

        const removeSchedule = await SurveyScheduleSchema.findOneAndDelete({
            survey_type,
            municipality_name,
            year : new Date().getFullYear().toString()
        })


        if(!removeSchedule) return res.status(204).send("Error Occured!, can't find data")


        return res.status(200).send("Schedule Removed!")




    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}




//end point for surveyors
//check or vefiry
//check if surveyor can survey.. if yes, show the form in client side
const verifySchedule = async (req:Request, res:Response) => {

    try {
        const {survey_type, municipality_name} = req.query;
        const dateNow = new Date();
        const survey_schedule = await SurveyScheduleSchema.findOne({survey_type, municipality_name}).exec()


        if(survey_schedule){
            //to update sched to active...
            if(isEqual(survey_schedule.start_date as Date, dateNow) || isAfter(dateNow, survey_schedule.start_date as Date)){
                const update_schedule = await SurveyScheduleSchema.findOneAndUpdate({survey_type, municipality_name}, {status : "active"}).exec();
                console.log("Updated Schedule : ", update_schedule);
                return res.status(200).send(update_schedule);

            }
        } else {
            return res.sendStatus(204);
        }



        return res.status(200).send(survey_schedule);





        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

}




export {
    setSchedule,
    getSchedule,
    removeSchedule,
    verifySchedule
}