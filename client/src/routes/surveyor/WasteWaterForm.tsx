import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import useUserInfo from "../../custom-hooks/useUserType";
import { useState } from "react";
import { AddressReturnDataType } from "../../custom-hooks/useFilterAddrress";
import BrgyMenu from "../../custom-hooks/BrgyMenu";
import useHandleChange from "../../custom-hooks/useHandleChange";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

type wasteWaterFormTypes = {
  form_type: string;
  septic_tanks: number;
  open_pits: number;
  latrines: number;
  flush_waterUse: number;
  sodrl: number;
  rle: number;
};

const WasteWaterForm = () => {
  const params = useParams();
  const user_info = useUserInfo();
  const handleChange = useHandleChange;
  const [brgy, setBrgy] = useState<AddressReturnDataType>();
  const [formData, setFormData] = useState<wasteWaterFormTypes>({
    form_type: "residential",
  } as wasteWaterFormTypes);

  return (
    <div className="flex justify-center min-h-screen px-4 py-10 overflow-x-hidden bg-gray-200">
      <Card className="w-full h-full sm:w-96 md:w-3/4 lg:w-2/3 xl:w-2/3 px-6 py-6 -mt-10 shadow-black shadow-2xl rounded-xl relative gap-5">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Waste Water Form
        </Typography>

        <div>
          <BrgyMenu
            disabled={params.action === "view"}
            municipality_code={user_info.municipality_code}
            setBrgys={setBrgy}
          />
        </div>

        <div>
          <Typography variant="h6" color="blue-gray">
            Form Type
          </Typography>
          <Checkbox
            disabled={params.action === "view"}
            name="form_type"
            value={"residential"}
            checked={formData.form_type === "residential"} // Checked if this is selected
            onChange={(event) =>
              handleChange({ event, setFormStateData: setFormData })
            } // Handler for selection
            label={
              <Typography
                variant="small"
                color="gray"
                className="font-normal mr-4"
              >
                Residential
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Checkbox
            disabled={params.action === "view"}
            name="form_type"
            value={"commercial"}
            checked={formData.form_type === "commercial"} // Checked if this is selected
            onChange={(event) =>
              handleChange({ event, setFormStateData: setFormData })
            } // Handler for selection
            label={
              <Typography variant="small" color="gray" className="font-normal">
                Commercial
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
        </div>

        <div className="flex gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md">
          <div>
            <InformationCircleIcon className="w-8 h-8" color="white" />
          </div>
          <Typography color="white">
            Lagyan ng numero ang alinman sa mga sumusunod na inyong ginagamit{" "}
            <br /> na daluyan ng basurang tubig (waste water)
          </Typography>
        </div>

        <div className="flex flex-col gap-2 justify-around">
          <div className="w-full flex gap-2 flex-wrap xl:flex-nowrap">
            <div className="xl:w-1/2 w-full">
              <Typography variant="h6" color="blue-gray">
                Poso Negro (Septic Tank)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="liters_consumption"
                // value = {formData.liters_consumption}
                // onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              />
            </div>
            <div className="xl:w-1/2 w-full">
              <Typography variant="h6" color="blue-gray">
                Balon/Hukay (Open pit/s)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="liters_consumption"
                // value = {formData.liters_consumption}
                // onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              />
            </div>
          </div>

          <div className="w-full flex gap-2 flex-wrap xl:flex-nowrap">
            <div className="xl:w-1/2 w-full">
              <Typography variant="h6" color="blue-gray">
                Palikuran na walang inidoro (Latrine/s)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="liters_consumption"
                // value = {formData.liters_consumption}
                // onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              />
            </div>

            <div className="xl:w-1/2 w-full">
              <Typography variant="h6" color="blue-gray">
                Palikuran na may inidoro (Flush water use)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="liters_consumption"
                // value = {formData.liters_consumption}
                // onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-600 p-2 rounded-md shadow-gray-500 shadow-md">
          <div>
            <InformationCircleIcon className="w-8 h-8" color="white" />
          </div>
          <Typography color="white">River Discharge</Typography>
        </div>



        <div className="flex gap-2 justify-around flex-wrap xl:flex-nowrap">
        <div className="w-full flex gap-2 flex-wrap xl:flex-nowrap">
            <div className="xl:w-1/2 w-full">
              <Typography variant="h6" color="blue-gray">
                Walang pagdaloy at kulang sa oxygen na ilog <br/>
                (Stagnant oxygen deficient rivers and lakes)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="liters_consumption"
                // value = {formData.liters_consumption}
                // onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              />
            </div>
            <div className="xl:w-1/2 w-full">
              <Typography variant="h6" color="blue-gray">
                ilog, lawa, at estero <br/>
                (Rivers, lakes, estuaries)
              </Typography>
              <Input
                disabled={params.action === "view"}
                name="liters_consumption"
                // value = {formData.liters_consumption}
                // onChange={(event)=> handleChange({event, setFormStateData : setFormData})}
                type="number"
                size="lg"
                placeholder="Example: 3"
                className="w-full placeholder:opacity-100 focus:!border-t-gray-900 border-t-blue-gray-200"
                min={0}
                max={999}
                maxLength={3}
              />
            </div>
          </div>
        </div>



      </Card>
    </div>
  );
};

export default WasteWaterForm;
