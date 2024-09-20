import { Typography, Input } from "@material-tailwind/react";

const Chemical = () => {
  return (
    <div className="">
      <div className="flex  flex-wrap justify-around">
        <div className="w-full lg:w-52">
          <Typography>Ammonia Production (tons)</Typography>
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

        <div className="w-full lg:w-52">
          <Typography>Soda Ash Production (tons)</Typography>
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

        <div className="w-full lg:w-96">
          <Typography>Dichloride and Vinyl Chloride Monomer (tons)</Typography>
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

      <Typography className=" text-md mt-14 font-bold mb-4">
        Petrochemical and Carbon Black Production
      </Typography>

      <div className="md:grid md:grid-rows-4 md:grid-flow-col md:mt-2 md:gap-2 flex flex-col justify-around">
        <Typography className=" text-md whitespace-nowrap mt-2 mr-2">
          Methanol (tons)
        </Typography>
        <Input
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Ethylene (tons)
        </Typography>
        <Input
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Ethylene oxide (tons)
        </Typography>
        <Input
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Acrylonitrile (tons)
        </Typography>
        <Input
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-12 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />

        <Typography className=" text-md whitespace-nowrap mr-2 mt-2">
          Carbon black (tons)
        </Typography>
        <Input
          type="number"
          placeholder="0"
          className="!border-t-blue-gray-200 focus:!border-t-gray-900 md:w-40 md:-mt-10 mt-2 w-52"
          labelProps={{
            className: "before:content-none after:content-none",
          }}
        />
      </div>
    </div>
  );
};

export default Chemical;
