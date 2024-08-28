import { Request, Response } from "express";
import AccountSchema from "../../db_schema/AccountSchema";
import FuelFormSchema from "../../db_schema/FuelFormSchema";
import WasteWaterFormShema from "../../db_schema/WasteWaterFormShema";

const get_surveyor_info = async (req : Request, res : Response) => {

    const {municipality_code, get_all} = req.params;
    // console.log(get_all, typeof(get_all))
    
    try {
        const query = get_all === "false" ? {'lgu_municipality.municipality_code' : municipality_code, user_type:"surveyor"} : {user_type : "surveyor"};

        const accs =  await AccountSchema.find(query).exec();
        const mobileCombsutionData = await FuelFormSchema.find({});
        const wasteWaterData = await WasteWaterFormShema.find({});
        

        if(!accs) return res.sendStatus(204);
        


        let user_infos : any [] = []

        accs.forEach((acc)=>{
            let mobileCombustionSurveyCount = getSurveyCount(mobileCombsutionData, acc.email);
            let wasteWaterSurveyCount = getSurveyCount(wasteWaterData, acc.email);;

        

            user_infos.push({
                full_name : acc.f_name + " " + acc.l_name,
                img_id : acc.img_id,
                municipality_name : acc.lgu_municipality.municipality_name,
                user_type : acc.user_type,
                mobileCombustionSurveyCount,
                wasteWaterSurveyCount
            })
         
        })



        return res.status(200).json(user_infos)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("cannot get the account!");
    }


}



const getSurveyCount = (surveyData : any[], email : string) : number => {

    let surveyCount = 0;
    surveyData.forEach(survey => {
        if(survey.surveyor_info.email === email){
            surveyCount++;
        }
    })


    return surveyCount
}




export {get_surveyor_info}