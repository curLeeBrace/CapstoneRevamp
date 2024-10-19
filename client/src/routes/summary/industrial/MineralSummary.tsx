import Table from "../../../Components/Table"
import DonutChart from "../../../Components/Dashboard/DonutChart"
import { useEffect, useState } from "react"



const MineralSummary = () => {

    const [tb_head, set_tbHead] = useState<string[]>();


    useEffect(()=>{
        set_tbHead(['Surveyor Email', 'Cement Production - Portland (tons)', 'Lime Production (tons)', 'Cement Production - Portland (blended)', 'Glass Production (tons)'])

    },[])


    




    return(
        <div>

        </div>
    )
}


export default MineralSummary