import {
    Card,
    CardBody,
    CardHeader,
    Typography,
  } from "@material-tailwind/react";
  import Chart from "react-apexcharts";
import { SimpleCard } from "./SimpleCard";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
  
   
  interface BarChartProps {
    chart_label : string;
    chart_meaning : string;
    chart_icon : React.ReactElement;
    series : any[] | undefined
  }

  
   
   
  export default function BarChart({chart_icon, chart_label, chart_meaning, series}:BarChartProps) {

    const chartConfig = {
      height: 240,
      series,
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        title: {
          show: "",
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#020617"],
        stroke: {
          lineCap: "round",
          curve: "smooth",
        },
        markers: {
          size: 0,
        },
        xaxis: {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        grid: {
          show: true,
          borderColor: "#dddddd",
          strokeDashArray: 5,
          xaxis: {
            lines: {
              show: true,
            },
          },
          padding: {
            top: 5,
            right: 20,
          },
        },
        fill: {
          opacity: 0.8,
        },
        tooltip: {
          theme: "dark",
        },
      },
    };


    return (
      <Card className="">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
        >
          <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
            {chart_icon}
          </div>
          <div>
            <Typography variant="h6" color="blue-gray">
              {chart_label}
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="max-w-sm font-normal"
            >
              {chart_meaning}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-0">
          {
            series ? 
              <Chart
                options={chartConfig}
                series={chartConfig.series}
                height={"100%"}
                width={"100%"}
                type="bar"
              />
            :<SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
          }
          


        </CardBody>
      </Card>
    );
  }