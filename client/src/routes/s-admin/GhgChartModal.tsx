import { useState } from "react";
import { Typography } from "@material-tailwind/react";
import Skeleton from "../../Components/Skeleton";

// Define the props interface
interface GhgChartModalProps {
  ChartTitle: string; // Define the title prop type
}

// Destructure the props in the component function
const GhgChartModal = ({ ChartTitle }: GhgChartModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-full flex flex-col gap-5 w-full px-2">
      <Typography
        className="self-center text-2xl font-semibold text-gray-800"
        color="black"
      >
        {ChartTitle}
      </Typography>
      <div className="flex gap-5 sticky top-0 z-10 text-nowrap">
        <div></div>
      </div>
      {!isLoading ? (
        <div className="overflow-auto bg-gray-500/10 h-full px-5 rounded-md">
          <div className={`grid grid-flow-col py-2 grid-cols-4 gap-8 min-w-96 font-bold text-sm`}>
            
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default GhgChartModal;
