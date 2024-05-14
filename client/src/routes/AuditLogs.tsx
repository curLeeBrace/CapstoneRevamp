

import { TableWithStripedRows } from "../Components/Auditlog/TableWithStripedRows";
import { Modal } from "../Components/Modal";

import { Input, Typography } from "@material-tailwind/react";
import { FunnelIcon } from "@heroicons/react/24/solid";






export default function AuditLogs() {
const TABLE_HEAD = ["Name", "UserIdentifier", "Date", "TimeStamp", "Action"];
const TABLE_ROWS = [
  {
    Name: "John Michael",
    UserIdentifier: "Admin",
    Date: "23/04/18",
    TimeStamp: "1:40:41 P.M.",
    Action: "Input Data to Residential"
  },
  // {
  //   Name: "John Michael",
  //   UserIdentifier: "User",
  //   Date: "23/04/18",
  //   TimeStamp: "1:40:41 P.M.",
  //   Action: "Input Data to Residential"
  // },
  // {
  //   Name: "John Michael",
  //   UserIdentifier: "Suoer Admin",
  //   Date: "23/04/18",
  //   TimeStamp: "1:40:41 P.M.",
  //   Action: "Input Data to Residential"
  // },
];
    
  return (
    <div className='min-h-screen bg-gradient-to-t from-green-400 via-green-200 to-slate-50'>

    <div className="flex justify-end pr-4 my-2 bg-gray-300 shadow-lg py-4 gap-4">
      <Modal
        buttonText={ <div className="flex items-center gap-2">
        <FunnelIcon className="h-6 w-6 text-gray-500" />
        <span>Filter</span>
      </div>}
        title="Filter Date Audit Logs"
      >
        {/* Child component ng modal*/}
        <div className="lg:flex lg:flex-row gap-6">
          <Input type="date" label="Select Date" />
          <Typography className="font-bold text-center">to</Typography>
          <Input type="date" label="Select Date" />
        </div>
      </Modal>
    </div>

      <TableWithStripedRows headers={TABLE_HEAD} rows={TABLE_ROWS} />;
    </div>
  )
}
