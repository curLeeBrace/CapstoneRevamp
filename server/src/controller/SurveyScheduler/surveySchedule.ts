import { Request, Response } from 'express';
import SurveyScheduleSchema from "../../db_schema/SurveyScheduleSchema"
import datefns, { isEqual } from 'date-fns'


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
        const survey_schedule = await SurveyScheduleSchema.findOne({
            survey_type : survey_type,
            municipality_name,
            year : yearNow
        });


        //check if schedule is availale,
        //if available update only
        // if it's not available create one
        if(survey_schedule) {

            await SurveyScheduleSchema.updateOne({
                survey_type,
                municipality_name,
                year : yearNow,
                start_date,
                deadline,
                status : "active"
            })

        } else {
            await SurveyScheduleSchema.create({
                survey_type,
                municipality_name,
                year : yearNow,
                start_date,
                deadline,
                status : "active"
            })
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




//end point for surveyors
//check or vefiry
//check if surveyor can survey.. if yes, show the form in client side
const verifySchedule = () => {


}




export {
    setSchedule,
    getSchedule 
}