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
      <Card className="w-full">
       
          <CardBody className="flex items-center justify-around h-32">
            <div className="text-nowrap flex-shrink-0">
              <Typography variant="h5"  className="mb-2">
                {header}
              </Typography>
              <Typography variant="h2" color="blue-gray">
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