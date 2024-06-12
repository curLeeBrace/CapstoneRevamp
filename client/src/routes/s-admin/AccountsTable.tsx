import { useEffect, useState } from 'react';
import { TableWithStripedRows } from '../../Components/Auditlog/TableWithStripedRows';
import { Modal } from '../../Components/Modal';
import { FunnelIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Avatar, Typography } from '@material-tailwind/react';
import axios from '../../api/axios';
import FilterMunicipality from './FilterMunicipality';
import Loader from '../../Components/Loader';

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
}

export default function AccountsTable() {
  const [details, setDetails] = useState<UserDetails[]>([]);
  const [filteredDetails, setFilteredDetails] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('/account/get-all');
        const allDetails = response.data.filter((user: UserDetails) => user.user_type !== 's-admin');
        setDetails(allDetails);
        setFilteredDetails(allDetails); // Initialize filteredDetails with all details
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);


  const handleFilter = () => {
    if (selectedMunicipality) {
      const filtered = details.filter((detail) => detail.address.municipality_name === selectedMunicipality);
      setFilteredDetails(filtered);
    } else {
      setFilteredDetails(details); // Reset to all details if no filter selected
    }
  };

  const handleClearFilter = () => {
    setSelectedMunicipality(''); // Clear the selected municipality to remove the filter
    setFilteredDetails(details); // Reset filteredDetails to show all details
  };
  

  const handleDelete = async (accountId: string) => {
    try {
      await axios.delete(`/account/delete/${accountId}`);
      setDetails((prevDetails) => prevDetails.filter((detail) => detail._id !== accountId));
      setFilteredDetails((prevDetails) => prevDetails.filter((detail) => detail._id !== accountId));
    } catch (error) {
      console.error('Failed to delete account', error);
    }
  };



  // const getUserImageURL = (userType: string, imageName: string) => {
  //   const baseDir: { [key: string]: string } = {
  //     lgu_admin: './img/user_img/lgu_admin/',
  //     surveyor: './img/user_img/surveyor/',
  //   };
  //   return `${baseDir[userType] ?? ''}${imageName}`;
  // };


  const TABLE_HEAD = ["Name", "Profile", "UserType", "Municipality", "Email", "Action"];

  const TABLE_ROWS = filteredDetails.map((detail) => ({
    Name: `${detail.f_name} ${detail.m_name} ${detail.l_name}`,
    UserType: detail.user_type,
    Email: detail.email,
    Municipality: detail.address.municipality_name,
    Profile: (
      <Avatar
        src={`/img/user_img/${detail.user_type}/${detail.img_name}`}
      />
    ),
    Action: (
      <div className="space-x-2">
        <Modal
          buttonText={
            <div className="flex items-center gap-2">
              <PencilIcon className="h-6 w-6 text-gray-500" />
              <span>Edit</span>
            </div>
          }
          title=""
        >
          <div className="whitespace-normal">
            <Typography className="font-bold text-center">Are you sure you want to edit this account?</Typography>
          </div>
        </Modal>
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
    <div className="min-h-screen ">
      <div className="flex justify-end pr-4 my-2 bg-gray-300  py-4 gap-4">
        <Modal
          buttonText={
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-6 w-6 text-gray-500" />
              <span>Filter</span>
            </div>
          }
          title="Filter Account"
          onClick={handleFilter}
        >
         <FilterMunicipality setState={setSelectedMunicipality} />
        </Modal>
        <button onClick={handleClearFilter} className="bg-red-500 text-white px-4 py-2 rounded-md font-bold hover:shadow-xl">Clear Filter</button>
      </div>
      {loading ? (
        <div className='flex justify-center mt-20'><Loader/></div>
      ) : (
        <TableWithStripedRows headers={TABLE_HEAD} rows={TABLE_ROWS} />
      )}
    </div>
  );
}
