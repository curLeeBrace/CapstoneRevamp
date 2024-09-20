import { Typography, Input } from "@material-tailwind/react"

const Mineral = () => {
    return(
        <div className="relative">
        <div className="relative mb-4 w-2/3 whitespace-nowrap">
          <Typography className="-mb-4 text-md">
            Cement Production - Portland (tons)
          </Typography>
          <Input
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography className="-mb-4 text-md mt-10">
            Cement Production - Portland (blended)
          </Typography>
          <Input
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <div className="md:absolute top-0 left-3/4 md:ml-28 w-2/3 flex flex-col">
          <Typography className="-mb-4 text-md">
            Lime Production (tons)
          </Typography>
          <Input
            size="lg"
            type="number"
            placeholder="0"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900 mt-4"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />

          <Typography className=" text-md mt-10 ">
            Glass Production (tons)
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
    )
}



export default Mineral