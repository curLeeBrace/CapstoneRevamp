import { Select, Option} from "@material-tailwind/react"
import { useEffect, useState } from "react"











type YearProps =  {

    useYearState : [string|undefined, React.Dispatch<React.SetStateAction<string|undefined>>]
}
const YearMenu = ({useYearState} : YearProps) => {

    const startingYearPoint = 2024;
    const yearNow = new Date().getFullYear();
    const [yearMenus, setYearMenus] = useState<number[]>([]);

    const [yearState, setYearState] = useYearState;

    useEffect(()=>{

        let availableYrs = [];
        for (let i = startingYearPoint; i <= yearNow; i++) {
            availableYrs.push(i)
        }

        setYearMenus(availableYrs)
        setYearState(availableYrs[0].toString());

    },[])




    console.log(yearState)


    return (
        <div className=" w-52">
            {
                yearState && 
                <Select value={yearState}  onChange={(value) => setYearState(value as string)} label="Select year">
                    {yearMenus.map((year, index) => (
                    <Option key={index} value={year.toString()}>
                        {year}
                    </Option>
                    ))}
                </Select>
            }
          

        </div>
    )
}


export default YearMenu