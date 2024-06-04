import { TableWithStripedRows } from "../Components/Auditlog/TableWithStripedRows";
import { Modal } from "../Components/Modal";
import { Input, Typography } from "@material-tailwind/react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Loader from "../Components/Loader";

interface AuditLog {
  name: string;
  user_type: string;
  dateTime: Date;
  action: string;
}

export default function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchAuditLogs = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('/account/audit-logs', { params });
      console.log('Response:', response.data);
      setAuditLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleFilter = () => {
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    };
    fetchAuditLogs(params);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    fetchAuditLogs();
  };

  const TABLE_HEAD = ["Name", "UserIdentifier", "Date", "TimeStamp", "Action"];
  const TABLE_ROWS = auditLogs.map((logs) => ({
    Name: logs.name,
    UserIdentifier: logs.user_type,
    Date: new Date(logs.dateTime).toLocaleDateString(), 
    TimeStamp: new Date(logs.dateTime).toLocaleTimeString(), 
    Action: logs.action,
  }));

  return (
    <div className='min-h-screen bg-gradient-to-t from-green-400 via-green-200 to-slate-50'>
      <div className="flex justify-end pr-4 my-2 bg-gray-300 shadow-lg py-4 gap-4">
        <Modal
          buttonText={<div className="flex items-center gap-2">
            <FunnelIcon className="h-6 w-6 text-gray-500" />
            <span>Filter</span>
          </div>}
          title="Filter Date Audit Logs"
          onClick={handleFilter}
        >
          {/* Child component of the modal */}
          <div className="lg:flex lg:flex-row gap-2 ">
            <Input 
              type="date" 
              label="Select Start Date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Typography className="font-bold text-center">to</Typography>
            <Input 
              type="date" 
              label="Select End Date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
        
          </div>
        </Modal>
        <button 
          onClick={clearFilter} 
          className="bg-red-500 text-white px-4 py-2 rounded-md font-bold hover:shadow-xl"
        >
          Clear Filter
        </button>
      </div>
      {loading ? (
        <div className='flex justify-center mt-20'><Loader/></div>
      ) : (
        <TableWithStripedRows headers={TABLE_HEAD} rows={TABLE_ROWS} />
      )}
    </div>
  );
}
