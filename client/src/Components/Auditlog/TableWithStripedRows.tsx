import { NoSymbolIcon } from "@heroicons/react/24/solid";
import { Card, Typography } from "@material-tailwind/react";


// Define interface for table row
interface TableRow {
  [key: string]: string | number | React.ReactNode;
}

// Define interface for component props
interface TableProps {
  headers: string[];
  rows: TableRow[];
}

export function TableWithStripedRows({ headers, rows }: TableProps) {
  return (
    <div className="px-3 pt-2">
      <Card className="h-full w-full overflow-scroll overflow-y-hidden min-h-screen shadow-2xl">
        <table className="w-full min-w-max table-auto text-left rounded-2xl border border-gray-400">
          <thead>
            <tr>
              {headers.map((head) => (
                <th key={head} className="border-b border-blue-gray-200 shadow-black  bg-blue-gray-50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none opacity-70 text-center text-black"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length}>
                  <div className="text-4xl flex justify-center flex-col h-screen opacity-50">
                  <NoSymbolIcon className="h-40 text-gray-500" />
                  <span className="self-center">No Data Available</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((rowData, index) => (
                <tr key={index} className={index % 2 === 1 ? "bg-blue-gray-50/100" : ""}>
                  {headers.map((header) => (
                    <td key={header} className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal text-center">
                        {rowData[header]}
                      </Typography>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
