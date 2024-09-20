import { Typography, Input } from "@material-tailwind/react";

const Electronics = () => {
  return (
    <div className="flex flex-wrap justify-around">
      <div className="w-full lg:w-2/5 flex flex-col gap-3">
        <Typography className="">
          Integrated circuit of semiconductor (tons)
        </Typography>
        <Input
          size="lg"
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 "
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
        <Typography className="">
          TFT Flat Panel Display (tons)
        </Typography>
        <Input
          size="lg"
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 "
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </div>



      <div className="w-full lg:w-2/5 flex flex-col gap-3">
        <Typography className="">Photovoltaics (tons)</Typography>
        <Input
          size="lg" 
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 "
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className="">
          Heat transfer fluid (tons)
        </Typography>
        <Input
          size="lg"
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </div>
    </div>
  );
};

export default Electronics;
