import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

import SimpleCardChild from "./SimpleCardChild";
import { useState } from "react";

interface SimpleCardProps{
  header : string;
  body : string;
  icon : React.ReactElement;
  child_card? : React.ReactElement
  
}



function SimpleCard({header, body, icon, child_card} : SimpleCardProps) {
  const [open, setOpen] = useState(false);


  return (
  <>
    {
      child_card && <SimpleCardChild open={open} setOpen={setOpen} content={child_card} />

    }
    

    <Card className="w-full h-full flex" onClick={()=>setOpen(true)}>
        <CardBody className="flex items-center justify-between px-16 border border-gray-300 h-full shadow-md rounded-lg">
          <div className="text-nowrap flex-shrink-0">
            <Typography  className="mb-2 text-sm md:text-lg font-semibold">
              {header}
            </Typography>


            <Typography color="blue-gray" className=" md:text-2xl font-bold">
              {body}
            </Typography>

          </div>

          <div className="h-full w-12 flex justify-center items-center">
                {icon}
          </div>
         
        </CardBody>

    </Card>
  </>

  );
}


export default SimpleCard