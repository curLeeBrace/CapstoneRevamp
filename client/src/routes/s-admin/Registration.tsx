
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Select,
  Option,
  Button,
  Input
} from "@material-tailwind/react";
// import DatePicker from "../../Components/Forms/DatePicker";
import InputAddrress, {Address} from "../../Components/InputAddrress";
import {useEffect, useState } from "react";
import useFilterAddress from "../../custom-hooks/useFilterAddrress";

import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useHandleChange from "../../custom-hooks/useHandleChange";
import axios from "../../api/axios";
import Cookies from "js-cookie";









interface DetailsTypes{
  email : string;
  f_name : string;
  m_name : string;
  l_name : string;

  address : Address;
  lgu_municipality : {
    municipality_name:string;
    municipality_code:string;
    province_code:string;
  };
  
  img_name : string
  img : File ;
  user_type : string

}


function Registration() {

  const filter_address = useFilterAddress;
  const [mucipality_list, setMunicipaltyList] = useState<string[]>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = useHandleChange;
 const [user_type, setUserType] = useState<"s-admin"|"lgu_admin">();

  const [details, setDetails] = useState<DetailsTypes | undefined>()





  const upload_imgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

    setDetails((prev : any ) => {
      const img = e.target.files && e.target.files[0];
      // console.log(img);
      return {
        ...prev, 
        img : img
      }
    })


  }

  const register = () => {
    
    try {
      
        
        const {
          address,
          email,
          f_name,
          l_name,
          lgu_municipality,
          m_name,
          img,
          user_type
        } = details as DetailsTypes;
        
        

        setIsLoading(true);

        if(!address || !email || !f_name || !l_name || !lgu_municipality || !user_type || !img){
          alert("Some field are empty");
          setIsLoading(false);
          
        } else {
          const img_fileName = lgu_municipality.municipality_name + "_" + f_name.toUpperCase() + "_" + email.split('@')[0] + "." + img?.name.split('.')[1];
          const formData = new FormData();
          formData.append('address', JSON.stringify(address));
          formData.append('date', new Date().toString());
          formData.append('email', email);
          formData.append('f_name', f_name);
          formData.append('img_name', img_fileName);
          formData.append('l_name', l_name);
          formData.append('lgu_municipality', JSON.stringify(lgu_municipality));
          formData.append('m_name', m_name ? m_name : "");
          formData.append('user_type', user_type);
          formData.append('img', img as File, img_fileName);

          axios.post('/account/register', formData)
          .then(res => {
            if(res.status === 201){
             
              navigate('sucsess');
              
            }
          })
          .catch(err => {
            alert(err.response.data)
            setIsLoading(false);
          })
      
    

        }
 

    } catch (error) {
      console.log(error)
    }

  }





  useEffect(()=>{
    //set Municipalities
    const mucipality_data= filter_address({address_type : "mucipality"});
    setMunicipaltyList(mucipality_data.map(data => data.address_name));

    //set userType
    const user_info = JSON.parse(Cookies.get('user_info') as string)
    setUserType(user_info.user_type)

    if(user_info.user_type === "lgu_admin"){
      setDetails((prev:any) => {
        let lgu_municipality:any;
        lgu_municipality = {
          municipality_name : user_info.municipality_name,
          municipality_code : user_info.municipality_code,
          province_code : user_info.province_code,
        }

      return {
        ...prev, ["lgu_municipality"]:lgu_municipality
      }
      })
    }

},[])



  return (
    <div className="flex justify-center p-3">
     
      <Card className="md:w-3/5 w-5/6 min-h-full flex items-center border border-gray-400 shadow-black shadow-2xl">
        <CardHeader 
          floated={false}
          shadow={false}
        >
          <Typography variant="h4" color="gray">
            Register New Account
          </Typography>
        </CardHeader>

        <CardBody className="w-3/4 flex flex-col gap-4">
          <Typography variant="h5" color="gray">Personal Information</Typography>
          <Input label="Email" name = "email" type="email"  onChange={(value)=>handleChange({event : value, setFormStateData : setDetails})}  required />  
          <Input label="First Name" name = "f_name"  onChange={(value)=>handleChange({event : value, setFormStateData : setDetails})}  required/>
          <Input label="Middle Name" name = "m_name" onChange={(value)=>handleChange({event : value, setFormStateData : setDetails})} />
          <Input label="Last Name" name = "l_name"  onChange={(value)=>handleChange({event : value, setFormStateData : setDetails})}  required/>

          <InputAddrress setState={setDetails}/>
          {/* <DatePicker setState={setDetails}/> */}
          <Input label="Choose Profile Picture" type="file" accept="image/*" name="img_name" onChange={(value)=> upload_imgHandler(value)} required disabled = {!details?.f_name || !details.l_name}/>
          <Typography variant="h5" color="gray">Account Information</Typography>
          
          {
            user_type === "s-admin" ?
            <Select label="LGU Municipality" onChange={(value) => {
              setDetails((prev : any) => {
                let lgu_municipality:any;
                
  
                  const mucipality_data= filter_address({address_type : "mucipality"});
                  mucipality_data.forEach(data =>{
                    if(data.address_name === value){
    
                      lgu_municipality = {
                        municipality_name : data.address_name,
                        municipality_code : data.address_code,
                        province_code : data.parent_code,
                      }
                    }
                  })
  
                return {
                  ...prev, ["lgu_municipality"]:lgu_municipality
                }
              })
            }
          }
            >
                {
                  mucipality_list ? mucipality_list.map((municipality, index)=>(
                            
                    <Option key={index} value={municipality}>{municipality}</Option>
                            
                  )) : <></>
                }
               
            </Select> 
            :<Typography>
                LGU Municipality : {details?.lgu_municipality.municipality_name}
            </Typography>
          } 

          <Select label="User Type" name="user_type" onChange={(value) => 
             setDetails((prev : any) => {
              return {
                ...prev, ["user_type"]:value
              }
            })
          }
          >
                <Option value="lgu_admin">LGU Admin</Option>
                <Option value="surveyor">Survey Partner</Option>
          </Select>



        </CardBody>

        <CardFooter className="pt-0">
          <Button loading = {isLoading} size="lg" onClick={register}>Register</Button>
        </CardFooter>
      </Card>
     
      <Outlet/>
    </div>

  )
}

export default Registration