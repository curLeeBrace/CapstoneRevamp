import { Card, Typography } from "@material-tailwind/react";
import Skeleton from "./Skeleton";

interface TableProps {
  tb_head: string[];
  tb_datas: any[][];
  isLoading?: boolean;
  thbg_color? : "gray" | "green"
}

export default function Table({ tb_datas, tb_head, isLoading, thbg_color = "gray"}: TableProps) {

  let css_color = thbg_color === "gray" ? "bg-blue-gray-200" : "bg-darkgreen"
  return (
    <Card className="w-full overflow-scroll custom-scrollbar h-full border-2 rounded-lg border-gray-300">
      {isLoading ? (
        <Skeleton />
      ) : (
        <table className="w-full h-full min-w-max table-auto text-left">
          <thead className="sticky top-0">
            <tr>
              {tb_head.map((head, index) => (
                <th
                  key={head + index}
                  className={`border-b border-blue-gray-100 ${css_color}  p-2 max-w-40`}
                >
                  <Typography
                    variant="h6"
                    color={thbg_color === "gray" ? "blue-gray" : "white"}
                    className="font-semibold leading-none opacity-"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tb_datas.map((tb_data, row_index) => {
              const isLast = row_index === tb_data.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-100 ";

              return (
                <tr key={row_index}>
                  {tb_head.map((_, col_index) => (
                    <td className={classes} key={`${row_index} ${col_index}`}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="text-xs"
                      >
                        {tb_data[col_index]}
                      </Typography>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}
