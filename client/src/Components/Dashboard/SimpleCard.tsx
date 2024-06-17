import {
    Card,
    CardBody,
    Popover,
    PopoverContent,
    PopoverHandler,
    Typography,
  } from "@material-tailwind/react";



interface SimpleCard{
    header : string;
    body : string;
    icon : React.ReactElement;
    content : string;
}

  export function SimpleCard({header, body, icon, content} : SimpleCard) {

    const names = content.split('; ');

    return (
     
      <Card className="w-full h-full flex">
       
          <CardBody className="flex items-center justify-between px-16 border border-gray-300 h-full shadow-md rounded-lg">
            <div className="text-nowrap flex-shrink-0">
              <Typography  className="mb-2 text-sm md:text-lg font-semibold">
                {header}
              </Typography>
             
              <Typography color="blue-gray" className=" md:text-2xl font-bold">
                {body}
              </Typography>
            
            </div>
            
            <Popover placement="bottom">
          <PopoverHandler>
            <div className="h-full w-12 flex justify-center items-center hover:text-darkgreen cursor-pointer">
              {icon}
            </div>
          </PopoverHandler>
          <PopoverContent className="bg-gray-900 text-white p-4 max-h-64 overflow-auto custom-scrollbar">
            <h1 className="font-bold text-center mb-2">{header}</h1>
            {names.map((name, index) => (
              <div key={index}>{name}</div>
            ))}
          </PopoverContent>
        </Popover>
            
          </CardBody>

      </Card>
    );
  }