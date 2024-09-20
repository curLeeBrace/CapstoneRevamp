import { Typography, Input } from "@material-tailwind/react"



const Others = () => {
    return (
        <div className="relative">
                  <div className="relative mb-4 w-2/3 whitespace-nowrap">
                    <Typography className="-mb-4 text-md">
                      Pulp and paper industry (tons)
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
                      Food and beverages industry (tons)
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
                      Other carbon in pulp (tons)
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
                </div>
    )
}


export default Others