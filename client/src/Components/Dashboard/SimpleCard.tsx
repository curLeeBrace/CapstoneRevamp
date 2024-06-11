import {
    Card,
    CardBody,
    Typography,
  } from "@material-tailwind/react";


interface SimpleCard{
    header : string;
    body : string;
    icon : React.ReactElement;
    
}

  export function SimpleCard({header, body, icon} : SimpleCard) {
    return (
      <Card className="w-full h-full flex">
       
          <CardBody className="flex items-center justify-between px-16 border border-gray-300 h-full shadow-md rounded-lg">
            <div className="text-nowrap flex-shrink-0">
              <Typography  className="mb-2  md:text-sm font-extralight">
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
    );
  }