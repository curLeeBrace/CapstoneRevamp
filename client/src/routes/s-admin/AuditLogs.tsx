import { useEffect, useState } from "react";
import { TableWithStripedRows } from "../../Components/Auditlog/TableWithStripedRows";
import { Modal } from "../../Components/Modal";
import { Input, Typography, Select, Option } from "@material-tailwind/react";
import { FunnelIcon, MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import Loader from "../../Components/Loader";
import Cookies from "js-cookie";
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';

interface AuditLog {
  name: string;
  user_type: string;
  dateTime: Date;
  action: string;
}

export default function AuditLogs() {
  const axiosPrivate = useAxiosPrivate();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  // const [user_type, setUserType] = useState<"s-admin" | "lgu_admin">();
  // const [municipalityName, setMunicipalityName] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchAuditLogs = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get('/account/audit-logs', { params });
      setAuditLogs(response.data);
      setFilteredLogs(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = () => {
    const userInfo = JSON.parse(Cookies.get('user_info') as string);
    console.log(userInfo)
    return userInfo;
  };

  const handleFetchAuditLogs = (params = {}) => {
    fetchAuditLogs(params);
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    const params: { user_type: string; municipality_code?: string; municipality_name?: string } = { user_type: userInfo.user_type };
  
    if (userInfo.user_type === 'lgu_admin') {
      params.municipality_code = userInfo.municipality_code;
    } 
    else if (userInfo.user_type === 'lu_admin') {
      params.municipality_name = "Laguna University";
    }
  
    handleFetchAuditLogs(params);
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const handleSearch = () => {
    const searchFiltered = auditLogs.filter((log) => {
      const formattedDate = new Date(log.dateTime).toLocaleDateString();
      return (
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        formattedDate.includes(searchQuery.toLowerCase())
      );
    });
    setFilteredLogs(searchFiltered);
  };

  const handleFilter = () => {
    const userInfo = getUserInfo();
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(selectedAction && { action: selectedAction }),
      user_type: userInfo.user_type,
    };
    fetchAuditLogs(params);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setSelectedAction(null);
    setSearchQuery('');
    handleFilter(); // Refetch audit logs after clearing filters
  };

  const TABLE_HEAD = ["Name", "UserIdentifier", "Date", "TimeStamp", "Action"];
  const TABLE_ROWS = filteredLogs.map((logs) => ({
    Name: logs.name,
    UserIdentifier: logs.user_type,
    Date: new Date(logs.dateTime).toLocaleDateString(),
    TimeStamp: new Date(logs.dateTime).toLocaleTimeString(),
    Action: logs.action,
  }));

  return (
    <div className='min-h-screen'>
      <div className="flex flex-col md:flex-row justify-end pr-4 my-2 bg-gray-300 py-4 gap-4  sticky top-20 z-20 border-y-2 border-gray-400">
      <div className='relative w-full max-w-full md:max-w-[24rem] ml-2'>
          <Input
            type="search"
            label="Search... (Name, User Type, Action, Date)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='no-clear-button bg-white'
          />
          <button
            className="absolute right-0 top-0 mt-2 mr-2"
           
          >
            <MagnifyingGlassCircleIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className='mx-auto flex justify-end 2xl:mx-0 gap-2 lg:mx-0'>
          <Modal
            buttonText={
              <div className="flex items-center gap-2 justify-center">
                <FunnelIcon className="h-6 w-6 text-gray-500" />
                Filter
              </div>
            }
            title="Filter Audit Logs"
            onClick={handleFilter}
          >
            <div className="mb-4">
              <Select className="font-semibold" label="Select Action">
                <Option onClick={() => setSelectedAction("Created")}>Created Accounts</Option>
                <Option onClick={() => setSelectedAction("User logged in")}>Logged-in</Option>
                <Option onClick={() => setSelectedAction("User logged out")}>Logged-out</Option>
                <Option onClick={() => setSelectedAction("Inserted mobile-combustion data for residential")}>Inserted data for Residential Mobile Combustion</Option>
                <Option onClick={() => setSelectedAction("Inserted mobile-combustion data for commercial")}>Inserted data for Commercial Mobile Combustion</Option>
                <Option onClick={() => setSelectedAction("Inserted waste-water")}>Inserted data for Waster Water </Option>
                <Option onClick={() => setSelectedAction("Inserted industrial")}>Inserted data for Industrial </Option>
                <Option onClick={() => setSelectedAction("Inserted agriculture")}>Inserted data for Agriculture </Option>
                <Option onClick={() => setSelectedAction("Inserted falu-wood")}>Inserted data for Woods and Wood </Option>
                <Option onClick={() => setSelectedAction("Inserted falu-forestland")}>Inserted data for Changes in use of Forestlands </Option>
                <Option onClick={() => setSelectedAction("Accepted")}>Accepted request </Option>
                <Option onClick={() => setSelectedAction("Request an update")}>Request update</Option>
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
      </div>
      {loading ? (
        <div className='flex justify-center mt-20'><Loader /></div>
      ) : (
        <TableWithStripedRows headers={TABLE_HEAD} rows={TABLE_ROWS} />
      )}
    </div>
  );
}