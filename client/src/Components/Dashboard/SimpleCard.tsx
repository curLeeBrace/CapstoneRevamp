import {
    Card,
    CardBody,
    Typography,
  } from "@material-tailwind/react";


interface SimpleCard{
    header : string;
    body : string;
    trend : React.ReactElement;
    
}

  export function SimpleCard({header, body, trend} : SimpleCard) {
    return (
      <Card className="mt-8 w-96">
       
          <CardBody className="flex items-center justify-around h-32">
            <div className="text-nowrap flex-shrink-0">
              <Typography variant="h5"  className="mb-2">
                {header}
              </Typography>
              <Typography variant="h2" color="blue-gray">
                {body}
              </Typography>

            </div>

            <div className="self-start flex flex-col h-full items-center justify-around">
               <Typography color="green">
                  +100%
                </Typography>

                <div className="h-1/2">
                  {trend}
                </div>
            </div>
          </CardBody>

      </Card>
    );
  }