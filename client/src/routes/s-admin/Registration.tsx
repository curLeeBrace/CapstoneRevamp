
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
import DatePicker from "../../Components/Forms/DatePicker";
import InputAddrress, {Address} from "../../Components/InputAddrress";
import {useEffect, useState } from "react";
import useFilterAddress from "../../custom-hooks/useFilterAddrress";
import axios from "../../api/axios";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useHandleChange from "../../custom-hooks/useHandleChange";









interface DetailsTypes{
  email : string;
  f_name : string;
  m_name : string;
  l_name : string;
  date : string;
  address : Address;
  lgu_municipality : {
    municipality_name:string;
    municipality_code:string;
    province_code:string;
  };
  
  img_name : string
  img? : File ;
  user_type : string

}


function Registration() {
  const filter_address = useFilterAddress;
  const [mucipality_list, setMunicipaltyList] = useState<string[]>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = useHandleChange;
  const [details, setDetails] = useState<DetailsTypes>({
                f_name : "",
                m_name : "",
                l_name : "",
                address : {
                  brgy_name : "",
                  municipality_name : "",
                },
                email : "",
                date : "",
                img : undefined,
                img_name : "",
                lgu_municipality : {
                  municipality_code : "",
                  municipality_name : "",
                  province_code : "",
                  
                },
                user_type : "",
  } as DetailsTypes)



  // const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
  //   const name = e.target.name;
  //   const value = e.target.value;

  //   console.log(name , " ", value);
  //   setDetails(prev => {
  //     return {
  //       ...prev, [name]:value
  //     }
  //   })
  // }

  const upload_imgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

    setDetails((prev : any ) => {
      const img = e.target.files && e.target.files[0];
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
          date,
          email,
          f_name,
          l_name,
          lgu_municipality,
          m_name,
          img,
          user_type
        } = details as DetailsTypes;
        
        

        setIsLoading(true);

        if(!address || !date || !email || !f_name || !l_name || !lgu_municipality || !m_name || !user_type || !img){
          alert("Some field are empty");
          setIsLoading(false);
          
        } else {

          const img_fileName = lgu_municipality.municipality_name + " : " + f_name.toUpperCase() + "_" + email.split('@')[0] + "." + img?.name.split('.')[1];
          alert(img_fileName)
          const formData = new FormData();
          formData.append('address', JSON.stringify(address));
          formData.append('date', date);
          formData.append('email', email);
          formData.append('f_name', f_name);
          formData.append('img_name', img_fileName);
          formData.append('l_name', l_name);
          formData.append('lgu_municipality', JSON.stringify(lgu_municipality));
          formData.append('m_name', m_name);
          formData.append('user_type', user_type);
          formData.append('img', img as any, img_fileName);

          axios.post('/account/register', formData)
          .then(res => {
            if(res.status === 201){
              // alert(res.data)
              navigate('sucsess');
              
            }
          })
          .catch(err => {

            if(err.response.status === 400){
              alert(err.response.data)
              setIsLoading(false);
            }
          })
      
    

        }



        

    } catch (error) {
      console.log(error)
    }

  }





  useEffect(()=>{

    const mucipality_data= filter_address({address_type : "mucipality"});
    setMunicipaltyList(mucipality_data.map(data => data.address_name));

},[])


console.log(details)


  return (
    <div className="flex justify-center m-3">
      <Card className="md:w-3/5 w-5/6 flex items-center border border-gray-400">
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
          <DatePicker setState={setDetails}/>
          <Input label="Choose Photo" type="file" accept="image/*" name="img_name" onChange={(value)=> upload_imgHandler(value)} required disabled = {!details.f_name || !details.l_name}/>
          <Typography variant="h5" color="gray">Account Information</Typography>

          <Select label="LGU Municipality" onChange={(value) => {
            setDetails((prev : any) => {

              const mucipality_data= filter_address({address_type : "mucipality"});
              let lgu_municipality:any;

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
          }}

      
          >
                 
              {
                mucipality_list ? mucipality_list.map((municipality, index)=>(
                          
                  <Option key={index} value={municipality}>{municipality}</Option>
                          
                )) : <></>
              }
             
          </Select>  
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