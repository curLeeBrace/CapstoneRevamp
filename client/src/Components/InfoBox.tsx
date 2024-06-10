
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";
import { CheckCircleIcon, XMarkIcon} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { colors } from '@material-tailwind/react/types/generic';


interface InfoBoxProps {
    type : "sucsess" | "failed";
    message : string;
    link : string;
    color? : colors

}

function InfoBox({type, message, link, color = 'green'} : InfoBoxProps) {
  return (
    <div className=" h-full fixed w-full flex justify-center">

    <Card className="mt-6 w-1/2 h-96 border-solid border-2" shadow>
        
        <CardHeader className= {`relative h-60 flex justify-center `} shadow = {false} floated = {false} color={color}>
            {
                type == "sucsess" ?
                    <CheckCircleIcon className="h-full"/>

                :<XMarkIcon  className="h-full"/>
                
            }
        </CardHeader>

        <CardBody className="text-center">
            <Typography variant="h5" color="blue-gray" className="mb-2">
                {message}
            </Typography>
        </CardBody>

        <CardFooter className="pt-0 text-center">
            <Link to={link} replace className="text-blue-900">Go back</Link>
        </CardFooter>
    </Card>

</div>
  )
}

export default InfoBox