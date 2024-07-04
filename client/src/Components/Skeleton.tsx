import { Typography } from "@material-tailwind/react";
 
export default function Skeleton() {
  return (
    <div className="animate-pulse w-full">
      <Typography
        as="div"
        variant="h1"
        className="mb-2 h-3 w-11/12 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 w-11/12 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      {/* <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 w-11/12 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 w-11/12 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography> */}
      <Typography
        as="div"
        variant="paragraph"
        className="mb-2 h-2 w-1/2 rounded-full bg-gray-300"
      >
        &nbsp;
      </Typography>
    </div>
  );
}