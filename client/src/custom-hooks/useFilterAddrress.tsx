import city from "../assets/ph-json/city.json";
import brgy from "../assets/ph-json/barangay.json";


interface BRGY {
    brgy_code: string;
    brgy_name: string; 
    city_code: string; 
    province_code: string; 
    region_code: string; 
  }
  
interface CITY {
    city_code: string;
    city_name: string;  
    province_code: string;   
    psgc_code: string;   
    region_desc: string;
}


export interface AddressReturnDataType{
    address_code : string;
    address_name : string;
    parent_code : string
}


interface useFilterAddressProps {
    parent_code? : string, 
    address_type : "brgy" | "mucipality"
}


//filter the location its either municipality or city, or larger Location like Reigon or  province

const useFilterAddress= ({parent_code, address_type} : useFilterAddressProps) : AddressReturnDataType[]=> {
    let addresses : any[];
    let address_list : BRGY[] | CITY[]

    if(address_type === "mucipality"){
        parent_code = "0434"; // or Province code

        address_list = city as CITY[];

        addresses = address_list.filter(data => data.province_code === parent_code) 

    } else {
        address_list = brgy as BRGY[];
        addresses = address_list.filter(data => data.city_code === parent_code) 
    }





    return address_type == "brgy" ?
    addresses.map((data:BRGY)=> {
 
        return {
            address_code : data.city_code,
            address_name : data.brgy_name,
            parent_code : data.province_code
        } as AddressReturnDataType
    }) :
    addresses.map((data:CITY)=> {
 
        return {
            address_code : data.city_code,
            address_name : data.city_name,
            parent_code : data.province_code
        } as AddressReturnDataType
    })
    
  
  }


  export default useFilterAddress

