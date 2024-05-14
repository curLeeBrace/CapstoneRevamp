
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
import DatePicker from "../Components/Forms/DatePicker";
import InputAddrress, {Address} from "../Components/InputAddrress";
import {useEffect, useState } from "react";
import useFilterAddress from "../custom-hooks/useFilterAddrress";


function Account() {
  const filter_address = useFilterAddress;
  const [mucipality_list, setMunicipaltyList] = useState<string[]>();
  const [details, setDetails] = useState({
    email : "",
    f_name : "",
    m_name : "",
    l_name : "",
    date : "",

    address : {
      brgy_name : "",
      municipality_code : "",
      municipality_name : "",
      province_code : "",
    } as Address,

    img_name :"",
    lgu_municipality :"",
    user_type :"",
  })



  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    console.log(name , " ", value);
    setDetails(prev => {
      return {
        ...prev, [name]:value
      }
    })
  }

  useEffect(()=>{

    const mucipality_data= filter_address({address_type : "mucipality"});
    setMunicipaltyList(mucipality_data.map(data => data.address_name));

},[])


console.log(details)


  return (
    <div className="flex justify-center py-4 min-h-screen bg-gradient-to-t from-green-400 via-green-200 to-slate-50">
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
          <Input label="Email" name = "email" type="email"  onChange={(value)=>handleChange(value)} required/>  
          <Input label="First Name" name = "f_name"  onChange={(value)=>handleChange(value)} required/>
          <Input label="Middle Name" name = "m_name" onChange={(value)=>handleChange(value)}/>
          <Input label="Last Name" name = "l_name"  onChange={(value)=>handleChange(value)} required/>

          <InputAddrress setState={setDetails}/>
          <DatePicker setState={setDetails} />
          <Input label="Choose Photo" type="file" accept="image/*" name="img_name" onChange={(value)=>handleChange(value)} required/>
          <Typography variant="h5" color="gray">Account Information</Typography>

          <Select label="LGU Municipality" onChange={(value) => {
            setDetails((prev : any) => {
              return {
                ...prev, ["lgu_municipality"]:value
              }
            })
          }}>
                 
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
          }>
                <Option value="lgu_admin">LGU Admin</Option>
                <Option value="surveyor">Survey Partner</Option>
          </Select>



        </CardBody>

        <CardFooter className="pt-0">
          <Button size="lg">Register</Button>
        </CardFooter>
      </Card>

    </div>

  )
}

export default Account