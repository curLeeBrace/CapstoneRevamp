import React, { useEffect, useState } from 'react';
import { TableWithStripedRows } from '../../Components/Auditlog/TableWithStripedRows';
import { Modal } from '../../Components/Modal';
import { FunnelIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Avatar, Select, Option, Typography, Input } from '@material-tailwind/react';

import FilterMunicipality from './FilterMunicipality';
import Loader from '../../Components/Loader';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid'; // Import an icon for the search button
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';

interface AccInfo {
  brgy_name: string;
  municipality_name: string;
}

interface LGUMunicipality {
  municipality_name: string;
  municipality_code: string;
  province_code: string;
}

interface UserDetails {
  _id: string;
  email: string;
  f_name: string;
  m_name: string;
  l_name: string;
  address: AccInfo;
  lgu_municipality: LGUMunicipality;
  img_name: string;
  user_type: string;
  verified: boolean;
  img_id : string;

}

const AccountsTable: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [details, setDetails] = useState<UserDetails[]>([]);
  const [filteredDetails, setFilteredDetails] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosPrivate.get('/account/get-all');
        console.log("Accounts : ", response.data)
        const allDetails = response.data.filter((user: UserDetails) => user.user_type !== 's-admin');
        setDetails(allDetails);
        setFilteredDetails(allDetails);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);


  const handleSearch = () => {
    const searchFiltered = details.filter((detail) => {
        // Concatenate all relevant fields into one string
        const searchDetails = (
            `${detail.f_name} ${detail.m_name} ${detail.l_name} ` +
            `${detail.email} ` +
            `${detail.user_type} ` +
            `${detail.lgu_municipality.municipality_name}`
        ).toLowerCase();

       
        const searchQueryLower = searchQuery.toLowerCase();

        return searchDetails.includes(searchQueryLower);
    });

    setFilteredDetails(searchFiltered);
};



  const handleFilter = () => {
    const filtered = details.filter((detail) =>
      (!selectedMunicipality || detail.lgu_municipality.municipality_name === selectedMunicipality) &&
      (!selectedUserType || detail.user_type === selectedUserType)
    );

    setFilteredDetails(filtered);
  };

  const handleClearFilter = () => {
    setSelectedMunicipality('');
    setSelectedUserType('');
    setSearchQuery('');
    setFilteredDetails(details);
  };

  
  const handleDelete = async (accountId: string) => {
    try {
      await axiosPrivate.delete(`/account/delete/${accountId}`);
      setDetails((prevDetails) => prevDetails.filter((detail) => detail._id !== accountId));
      setFilteredDetails((prevDetails) => prevDetails.filter((detail) => detail._id !== accountId));
    } catch (error) {
      console.error('Failed to delete account', error);
    }
  };




  const TABLE_HEAD = ["Name", "Profile", "UserType", "Municipality", "Email", "Action"];

  const TABLE_ROWS = filteredDetails.map((detail) => ({
    Name: `${detail.f_name} ${detail.m_name} ${detail.l_name}`,
    UserType: detail.user_type,
    Email: detail.email,
    Municipality: detail.lgu_municipality.municipality_name,
    Profile: (
      <Avatar
        src={`https://drive.google.com/thumbnail?id=${detail.img_id}&sz=w1000`}
      />

     
    ),
    Action: (
      <div className="space-x-2">
        <Modal
          buttonText={
            <div className="flex items-center gap-2">
              <TrashIcon className="h-6 w-6 text-red-500" />
              <span>Delete</span>
            </div>
          }
          title="Confirm Deletion"
          onClick={() => handleDelete(detail._id)}
        >
          <div className="whitespace-normal">
            <Typography className="font-bold text-center">Are you sure you want to delete this account?</Typography>
          </div>
        </Modal>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row justify-end pr-4 my-2 bg-gray-300 py-4 gap-4">
        <div className='relative w-full max-w-full md:max-w-[24rem] ml-2'>
          <Input
            type="search"
            label="Search... (Names, User Type, Municipality)"
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
            title="Filter Account"
            onClick={handleFilter}
          >
            <div className="mb-4">
              <Select
                className="font-semibold"
                label="Select User Type"
              >
                <Option onClick={() => setSelectedUserType("")}>All Accounts</Option>
                <Option onClick={() => setSelectedUserType("lgu_admin")}>LGU Admin</Option>
                <Option onClick={() => setSelectedUserType("surveyor")}>Surveyor</Option>
              </Select>
            </div>
            <div>
              <FilterMunicipality setState={setSelectedMunicipality} />
            </div>
          </Modal>

          <button onClick={handleClearFilter} className="bg-red-500 text-white px-2 py-2 rounded-md font-bold hover:shadow-xl">Clear Filter</button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center mt-20"><Loader /></div>
      ) : (
        <TableWithStripedRows headers={TABLE_HEAD} rows={TABLE_ROWS} />
      )}
    </div>
  );
}

export default AccountsTable;
