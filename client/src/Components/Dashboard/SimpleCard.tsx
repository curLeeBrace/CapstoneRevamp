import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

import SimpleCardChild from "./SimpleCardChild";
import { useState } from "react";

import Skeleton from "../Skeleton";

interface SimpleCardProps{
  header : string;
  body : string | React.ReactElement;
  icon : React.ReactElement;
  child_card? : React.ReactElement 
  isLoading? : boolean
}



function SimpleCard({header, body, icon, child_card, isLoading} : SimpleCardProps) {
  const [open, setOpen] = useState(false);


  return (
  <>
    {
      child_card && <SimpleCardChild open={open} setOpen={setOpen} content={child_card} />

    }
    

    <Card className={`w-full h-full flex ${child_card && "hover:bg-blue-gray-50 cursor-pointer"}`}onClick={()=>setOpen(true)}>
        <CardBody className="flex items-center justify-between border border-gray-300 h-full shadow-md rounded-lg">
          <div className="overflow-hidden">
            <Typography  className="mb-2 text-sm md:text-lg font-semibold text-nowrap ">
              {header}
            </Typography>


            <Typography color="blue-gray" className=" md:text-sm font-extrabold">
              {
                isLoading ? <Skeleton/> : body
              }
            </Typography>

          </div>

          <div className="h-full w-12 flex justify-center items-center shrink-0">
                {icon}
          </div>
         
        </CardBody>

    </Card>
  </>

  );
}


export default SimpleCard