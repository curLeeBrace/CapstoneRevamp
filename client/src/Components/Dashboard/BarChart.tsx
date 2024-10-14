import {
    Card,
    CardBody,
    CardHeader,
    Typography,
  } from "@material-tailwind/react";
  import Chart from "react-apexcharts";
import  SimpleCard from "./SimpleCard";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import Skeleton from "../Skeleton";
  
   
  interface BarChartProps {
    chart_label : string;
    chart_meaning : string;
    chart_icon : React.ReactElement;
    series : any[] | undefined;
    isLoading? : boolean;
  }

  
   
   
  export default function   BarChart({chart_icon, chart_label, chart_meaning, series, isLoading = false}:BarChartProps) {

    const chartConfig = {
      series,
      options: {
        chart: {
          stacked: true,
          background: 'white',
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true
            }
          },
          foreColor: '#101010',
        },
        plotOptions: {
          bar: {
            columnWidth: '20%',
            barHeight: '100%',
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900,
                }
              }
            }
          },
        },
        dataLabels: {
          enabled: false,
        },
      },
    };







    return (
      <Card className="h-96 border-y-2 border-gray-300 shadow-none">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
        >
          <div className="w-10 h-10 flex justify-center items-center rounded-lg bg-gray-900 text-white">
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
        <CardBody className="px-2 pb-0 h-full">
          {
            series && chartConfig ? 
              !isLoading ?
                <Chart
                  options={chartConfig.options}
                  series={chartConfig.series}
                  height={"100%"}
                  width={"100%"}
                  type="bar"
                /> : <Skeleton/>
            :<SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
          }
          


        </CardBody>
      </Card>
    );
  }