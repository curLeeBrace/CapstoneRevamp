import { Card, Typography } from "@material-tailwind/react";
import Skeleton from "./Skeleton";

interface TableRow {
  name: string;
  ghge: string | number;
  proportion: string | number;
  isCategory?: boolean; // For rows that represent categories/subtotals
}

interface TableWithFooterProps {
  tableHead: string[];
  tableRows: TableRow[];
  totalGHGEmissions: string;
  totalProportion: string;
  loading: boolean;
}

export function TableWithFooter({
  tableHead,
  tableRows,
  totalGHGEmissions,
  totalProportion,
  loading,
}: TableWithFooterProps) {
  return (
    <Card className="h-full w-full overflow-auto pb-4">
      {loading ? (
        <div className="w-96 ml-52 mt-4 grid grid-cols-2">
        <div className="w-96 self-center">
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton />
        </div>
        <div className="w-96 self-center ml-52 ">
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton /> 
        <Skeleton />
        </div>
        </div>
      ) : (
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th key={head} className="p-2 px-4 pt-4 bg-darkgreen">
                  <Typography
                    variant="small"
                    color="white"
                    className="font-extrabold leading-none text-sm"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map(({ name, ghge, proportion, isCategory }) => (
              <tr key={name}>
                <td className={`px-4 py-2 ${isCategory ? 'font-bold' : ''}`}>
                  <Typography
                    className={`font-${isCategory ? 'text-gray-700 font-extrabold' : 'normal'} text-xs`}
                  >
                    {name}
                  </Typography>
                </td>
                <td className={`px-4 ${isCategory ? 'font-bold' : ''}`}>
                  <Typography
                    className={`font-${isCategory ? 'bold' : 'normal'} text-gray-600 text-xs`}
                  >
                    {ghge}
                  </Typography>
                </td>
                <td className={`px-4 ${isCategory ? 'font-bold' : ''}`}>
                  <Typography
                    className={`font-${isCategory ? 'bold' : 'normal'} text-gray-600 text-xs`}
                  >
                    {proportion}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-gray-300 bg-darkgreen">
            <tr>
              <td className="p-2">
                <Typography color="white" variant="small" className="font-bold text-xs px-3">
                  Total Scope 1 Emissions
                </Typography>
              </td>
              <td className="p-2">
                <Typography color="white" variant="small" className="font-bold text-xs px-2">
                  {totalGHGEmissions}
                </Typography>
              </td>
              <td className="p-2">
                <Typography color="white" variant="small" className="font-bold text-xs px-2">
                  {totalProportion}%
                </Typography>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </Card>
  );
}