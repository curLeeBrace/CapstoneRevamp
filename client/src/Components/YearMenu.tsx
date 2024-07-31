import { Select, Option} from "@material-tailwind/react"
import { useEffect, useState } from "react"


const YearMenu = () => {

    const startingYearPoint = 2024;
    const yearNow = new Date().getFullYear();
    const [yearMenus, setYearMenus] = useState<number[]>([]);


    useEffect(()=>{

        let availableYrs = [];
        for (let i = startingYearPoint; i <= yearNow; i++) {
            availableYrs.push(i)
        }

        setYearMenus(availableYrs)


    },[])



    return (
        <div className=" w-52">
            <Select>
               {yearMenus.map((year, index) => (
                <Option key={index} value={year.toString()}>
                    {year}
                </Option>
               ))}
            </Select>

        </div>
    )
}


export default YearMenu