import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

   
  export function RegistrationCompleted() {
  
    return (
        <div className=" h-full fixed w-full flex justify-center">

        <Card className="mt-6 w-1/2 h-96 border-solid border-2" shadow>
            
            <CardHeader className="relative h-60 flex justify-center text-green-600" shadow = {false} floated = {false}>
               <CheckCircleIcon className="h-full"/>
            </CardHeader>

            <CardBody className="text-center">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    Registered Succesfully
                </Typography>
            </CardBody>

            <CardFooter className="pt-0 text-center">
                <Link to={'/account'} replace className="text-blue-900">Go back</Link>
            </CardFooter>
        </Card>

        </div>
    );

  }

  export default RegistrationCompleted