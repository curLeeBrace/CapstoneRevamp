import { Typography, Input } from "@material-tailwind/react"

const Metal = () => {
    return (
        <div className="relative">
          
          <Typography className="-mb-4 text-md whitespace-normal">
            Iron and Steel Production from Integrated Facilities
            (tons)
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

          <Typography className="-mb-4 text-md mt-10 whitespace-normal">
            Iron and Steel Production from Non-integrated Facilities
            (tons)
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
    )
}


export default Metal