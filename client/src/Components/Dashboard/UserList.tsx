import Municipality from "../../custom-hooks/Municipality";
import { useState, useEffect, Fragment } from "react";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import { Avatar, Checkbox, Typography } from "@material-tailwind/react";
import useUserInfo from "../../custom-hooks/useUserType";
import axios from "../../api/axios";
interface UserListprops {
  user_type: "lgu_admin" | "surveyor";
}

const UserList = ({ user_type }: UserListprops) => {
  const [address, setAddress] = useState<AddressReturnDataType>();
  const [get_all, setGetAll] = useState(true);
  const [accs, setAccs] = useState<any[]>();
  const userInfo = useUserInfo();

  useEffect(() => {
    if(address) setGetAll(false)

    axios
      .get(`account/get-acc/${address?.address_code}/${user_type}/${get_all}`)
      .then((res) => {
        setAccs(res.data);
        console.log("Sheeesh Accounts! : ", res.data);
      })
      .catch((err) => console.log(err));

  }, [address, get_all]);



 
  return (
    <div className="h-full flex flex-col gap-5 w-full px-2">
      <Typography
        className="self-center text-2xl font-semibold text-gray-800"
        color="black"
      >
        {`List of ${user_type} Accounts`}
      </Typography>
      <div className="flex gap-5 sticky top-0 z-10">
        <div>
          <Municipality setAddress={setAddress} />
        </div>

        {
            userInfo.user_type === "s-admin" && 
                <div>
                    <Checkbox
                        label="Get all the list of account"
                        checked={get_all}
                        onClick={() => !address && setGetAll(!get_all)}
                    />
                </div>
        }
        
      </div>
        <div className="overflow-y-auto bg-yellow-300 h-full px-3">
            {accs ? accs.map((acc, index) => (
                    <Fragment key={index}>
                    <div className="shadow-md bg-white rounded-md p-3 my-2">
                        <div className="flex items-center gap-10">
                        <Avatar
                            variant="circular"
                            size="md"
                            className="border border-gray-900 p-0.5"
                            src={`${process.env.SERVER_URL || 'http://localhost:3001'}/img/user_img/${acc.user_type}/${acc.img_name}`}
                        />
                        <div className="text-black">{acc.full_name}</div>
                        </div>
                    </div>
                    </Fragment>
                ))
                : null}

        </div>
    </div>
  );
};

export default UserList;
