import { Typography, Input } from "@material-tailwind/react"

const Mineral = () => {
    return(
        <div className="flex justify-around flex-wrap">

        <div className="w-full lg:w-2/5 flex flex-col gap-3">
          <Typography className="">
            Cement Production - Portland (tons)
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
          <Typography className="">
            Cement Production - Portland (blended)
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
          <Typography>
            Lime Production (tons)
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

          <Typography>
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