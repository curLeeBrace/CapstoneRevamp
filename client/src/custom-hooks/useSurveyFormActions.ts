
import useAxiosPrivate from './auth_hooks/useAxiosPrivate';

interface SurveyFormProps {
    payload? : any
    form_id? : string
    form_category : "mobile-combustion" | "waste-water" | "industrial-mineral"
}



const useSurveyFormActions = () => {
    const axiosPrivate = useAxiosPrivate();



    const submitForm = async ({payload, form_category}:SurveyFormProps) : Promise<{status : number, data : any}> => {
        const requsetUpdate = await axiosPrivate.post(`/forms/${form_category}/insert`, payload)
        return {status : requsetUpdate.status, data : requsetUpdate.data}  
    }



    const updateForm = async ({payload, form_id, form_category}:SurveyFormProps) : Promise<{status : number, data : any}> => {
        payload.survey_data.status  = "1";
        const requsetUpdate = await axiosPrivate.put(`/forms/${form_category}/update-surveyed-data/${form_id}`, payload)
        return {status : requsetUpdate.status, data : requsetUpdate.data}  
    }


    const acceptFormUpdate = async ({form_id, form_category} :SurveyFormProps): Promise<{status : number, data : any}> =>{
        const accpetUpdate = await axiosPrivate.put(`/forms/${form_category}/accept-update`, {form_id})
        return {status : accpetUpdate.status, data : accpetUpdate.data}
    }


    return {updateForm, acceptFormUpdate, submitForm}
    
}

 export default useSurveyFormActions