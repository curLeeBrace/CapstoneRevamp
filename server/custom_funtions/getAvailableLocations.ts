import municipality_json from "../ph-json/city.json";
import brgy_json from "../ph-json/barangay.json";





const getAvailableLocations = (parent_code:string, user_type : string) : any[]  => {

            // to get availbale brgrys or minicipalities
            let locations : any[];
            if(user_type === "s-admin"){
                locations = municipality_json.filter((municipality) => municipality.province_code === parent_code) 
            } else {
                const brgys : any[] = brgy_json as any[]
                locations = brgys.filter((brgy : any) => brgy.city_code === parent_code)
                
            }


            return locations
}


export default getAvailableLocations