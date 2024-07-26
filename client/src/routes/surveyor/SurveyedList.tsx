
import { Checkbox, Typography } from "@material-tailwind/react"
import Table from "../../Components/Table"
import { Link } from "react-router-dom"
import useUserInfo from "../../custom-hooks/useUserType"
import BrgyMenu from "../../custom-hooks/BrgyMenu"
import { useEffect, useState } from "react"
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress"
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate"
const tb_head = ['Brgy','Vehicle Type','Vehicle Age','Fuel Type','Liters Consumption','Survey Type','Status', 'DateTime', 'Action']



const SurveyedList = () => {
const axiosPrivate = useAxiosPrivate();
const user_info = useUserInfo();

const [surveyType, setSurveyType] = useState<'residential' | 'commercial'>('residential');
const [brgy, setBrgy] = useState<AddressReturnDataType>();
const [tb_data, setTbData] = useState();





    useEffect(()=>{

        if(brgy){
            console.log("brgy.address_code" , brgy.address_code)
            axiosPrivate.get('/forms/mobile-combustion/surveyed-data', {params : {
                municipality_code : user_info.municipality_code,
                brgy_code : brgy.address_code,
                surveyType
            }})
            .then(res => {
                const mc_data = res.data;


                const preparedData = mc_data.map((data : any) => {
                    const {brgy_name, vehicle_type, vehicle_age, fuel_type, liters_consumption, status, form_type} = data.survey_data
                    const dateTime = data.dateTime_created;
                    const form_id = data.form_id;
                    const LinkComponent = <Link to = {`/surveyor/forms/update/mobile-combustion?form_id=${form_id}`}><div className="text-green-700">Update</div></Link>
                    
                    return [brgy_name, vehicle_type, vehicle_age, fuel_type, liters_consumption, form_type, status, dateTime, LinkComponent]
                })
                setTbData(preparedData);



            })
            .catch((err)=> console.log("SURVEY LIST : ", err))

        }


    

    },[brgy, surveyType])
    





    return (
        <div className="flex flex-col items-center py-10 gap-5 max-h-screen">

            <div className="text-2xl">
                   Title
            </div>

            <div className="w-4/5 flex gap-8">
            <div>

            <Typography variant="h6" color="blue-gray">
                Survey Type
              </Typography>
              <Checkbox
              
                name='form_type'
                value={'residential'}
                checked={surveyType === "residential"} // Checked if this is selected
                onChange={(event:any) => setSurveyType(event.target.value)} // Handler for selection
                label={
                  <Typography variant="small" color="gray" className="font-normal mr-4">
                    Residential
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}

              />
              <Checkbox
             
                name='form_type'
                value={'commercial'}
                checked={surveyType === "commercial"} // Checked if this is selected
                onChange={(event:any) => setSurveyType(event.target.value)} // Handler for selection
    
                label={
                  <Typography variant="small" color="gray" className="font-normal">
                    Commercial
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />

            </div>

            <div className="self-center">
              <BrgyMenu municipality_code={user_info.municipality_code} setBrgys={setBrgy}/>

            </div>
              
              
            </div>

            <div className="w-4/5">
                {tb_data ? <Table tb_head={tb_head} tb_datas={tb_data}/> : null}
                

            </div>

        </div>
    )
}


export default SurveyedList