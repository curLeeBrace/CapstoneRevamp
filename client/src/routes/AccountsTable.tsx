import { useState } from 'react';
import { TableWithStripedRows } from '../Components/Auditlog/TableWithStripedRows'
import { Modal } from '../Components/Modal';
import { FunnelIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Typography } from '@material-tailwind/react';
import InputAddrress, { Address } from '../Components/InputAddrress';



export default function AccountsTable() {

  const [details, setDetails] = useState({
    email : "",
    f_name : "",
    m_name : "",
    l_name : "",
    date : "",

    address : {
      brgy_name : "",
      municipality_name : "",
      province_name : "",

    } as Address,

    lgu_municipality :{
      municipality_name: "",
      municipality_code : "",
      province_code : "",
    },

    img_name : "",
    img : File || null,
    user_type :"",
  })



const TABLE_HEAD = ["Name", "UserIdentifier", "Municipality", "Action"];
const TABLE_ROWS = [
  {
    Name: "Ping Guerrero",
    UserIdentifier: "User",
    Municipality: "Sta. Cruz",
    Action:  (
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
          <div className=" whitespace-normal">
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
  },

  
];
  return (

    <div className='min-h-screen bg-gradient-to-t from-green-400 via-green-200 to-slate-50'>
       <div className="flex justify-end pr-4 my-2 bg-gray-300 shadow-lg py-4 gap-4">
      <Modal
        buttonText={ <div className="flex items-center gap-2">
        <FunnelIcon className="h-6 w-6 text-gray-500" />
        <span>Filter</span>
      </div>}
        title="Filter Account"
      >
        {/* Child component ng modal*/}
        <div className="lg:flex lg:flex-row gap-6 ">
        <InputAddrress setState={setDetails}/>
        </div>
      </Modal>
    </div>
      <TableWithStripedRows headers={TABLE_HEAD} rows={TABLE_ROWS} />
    </div>
  )
}
