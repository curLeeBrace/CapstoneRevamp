import { Card, Typography } from "@material-tailwind/react";


interface TableProps  {
  tb_head : string[]
  tb_datas : any[][]
}
 
export default function Table({tb_datas, tb_head} : TableProps) {
  return (
    <Card className="w-full overflow-scroll custom-scrollbar">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tb_head.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
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
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-100";

            return (
              <tr key={row_index}>
                 {
                    tb_head.map((_, col_index) => (
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {tb_data[col_index]}
                        </Typography>
                      </td>
                    ))
                 }
              </tr>
            );

            
          })}
        </tbody>
      </table>
    </Card>
  );
}