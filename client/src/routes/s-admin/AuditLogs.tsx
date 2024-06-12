import { TableWithStripedRows } from "../../Components/Auditlog/TableWithStripedRows";
import { Modal } from "../../Components/Modal";
import { Input, Typography, Select, Option,
 
   } from "@material-tailwind/react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Loader from "../../Components/Loader";

import Cookies from "js-cookie";


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
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [user_type, setUserType] = useState<"s-admin"|"lgu_admin">();
  const [municipalityName, setMunicipalityName] = useState('');;

    
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

  
  const getUserInfo = () => {
    const userInfo = JSON.parse(Cookies.get('user_info') as string);
    setUserType(userInfo.user_type);
    setMunicipalityName(userInfo.user_type === 'lgu_admin' ? userInfo.municipality_name : '');
    return userInfo;
  };

  const handleFetchAuditLogs = (params = {}) => {
    fetchAuditLogs(params);
  };

  useEffect(() => {
    const userInfo = getUserInfo();

    if (userInfo.user_type === 'lgu_admin') {
      handleFetchAuditLogs({ municipality_code: userInfo.municipality_code });
    } else {
      handleFetchAuditLogs();
    }
  }, []);

  const handleFilter = () => {
    const userInfo = getUserInfo();
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(selectedAction && { action: selectedAction }),
      ...(userInfo.user_type === 'lgu_admin' && { municipality_code: userInfo.municipality_code }),
    };
    handleFetchAuditLogs(params);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setSelectedAction(null);
    handleFilter(); // Call handleFilter to refetch audit logs after clearing filters
    const userInfo = getUserInfo(); 
    const params = {
      ...(userInfo.user_type === 'lgu_admin' && { municipality_code: userInfo.municipality_code }),
    };
    fetchAuditLogs(params);
  };

  const renderTitle = () => {
    return user_type === 'lgu_admin'
      ? `${municipalityName} Admin Audit Logs`
      : user_type === 's-admin'
      ? 'Super Admin (Laguna) Audit Logs'
      : 'Audit Logs';
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
    <div className='min-h-screen'>
      
      <div className="flex justify-end pr-4 my-2 bg-gray-300 py-4 gap-4 flex-end-container">
      <div className="ml-6 mt-2 md:text-2xl text-gray-600 md:mr-56 font-extrabold text-center">{renderTitle()}</div>
        <Modal
          buttonText={<div className="flex items-center gap-2">
            <FunnelIcon className="h-6 w-6 text-gray-500" />
            <span>Filter</span>
          </div>}
          title="Filter Audit Logs "
          onClick={handleFilter}
        >
          {/* Child component of the modal */}

          <div className="mb-4 ">
            <Select className="font-semibold" label="Select Action">
            <Option onClick={() => setSelectedAction("Created")}>Created Accounts</Option>
            <Option onClick={() => setSelectedAction("User logged in")}>Logged-in</Option>
            <Option onClick={() => setSelectedAction("User logged out")}>Logged-out</Option>
            <Option onClick={() => setSelectedAction("Inserted fuel data for residential form")}>Inputted data for Residential form</Option>
            <Option onClick={() => setSelectedAction("Inserted fuel data for commercial form")}>Inputted data for Commercial form</Option>
          </Select>
            </div>

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
