import { useEffect, useState } from 'react';
import { TableWithStripedRows } from '../Components/Auditlog/TableWithStripedRows';
import { Modal } from '../Components/Modal';
import { FunnelIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Avatar, Typography } from '@material-tailwind/react';
import InputAddrress, {  } from '../Components/InputAddrress';
import axios from '../api/axios'; // Import the correct axios instance

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('/account/get-all');
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const getUserImageURL = (userType: string, imageName: string) => {
    // Define the base directory for each user type
    const baseDir: { [key: string]: string } = {
      lgu_admin: '/img/user_img/lgu_admin/',
      surveyor: '/img/user_img/surveyor/',
    };

    // Construct the image URL based on user type and image name
    return `${baseDir[userType] ?? ''}${imageName}`;
  };

  const TABLE_HEAD = ["Name", "Avatar", "UserType", "Email", "Municipality", "Action"];

  const TABLE_ROWS = details.map((detail) => ({
    Name: `${detail.f_name} ${detail.m_name} ${detail.l_name}`,
    UserType: detail.user_type,
    Email: detail.email,
    Municipality: detail.address.municipality_name,
    Avatar: (
      <Avatar
       
        src={getUserImageURL(detail.user_type, detail.img_name)}
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
          {/* Child component of the modal */}
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
          title=""
        >
          {/* Child component of the modal */}
          <div className="whitespace-normal">
            <Typography className="font-bold text-center">Are you sure you want to delete this account?</Typography>
          </div>
        </Modal>
      </div>
    ),
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-green-400 via-green-200 to-slate-50">
      <div className="flex justify-end pr-4 my-2 bg-gray-300 shadow-lg py-4 gap-4">
        <Modal
          buttonText={
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-6 w-6 text-gray-500" />
              <span>Filter</span>
            </div>
          }
          title="Filter Account"
        >
          {/* Child component ng modal */}
          <>
            <InputAddrress setState={setDetails} />
          </>
        </Modal>
      </div>
      <TableWithStripedRows headers={TABLE_HEAD} rows={TABLE_ROWS} />
    </div>
  );
}
