import { Typography, Input } from "@material-tailwind/react"

const Others = () => {
    return (
        <div className="flex flex-wrap justify-around">
                  <div className="w-full lg:w-2/5 flex flex-col gap-3">
                    <Typography>
                      Pulp and paper industry (tons)
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
                      Food and beverages industry (tons)
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



                  <div className="w-full lg:w-2/5 flex flex-col gap-3">
                    <Typography>
                      Other carbon in pulp (tons)
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


export default Others