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
import { useState } from "react";
  
   

export type BarSeriesTypes = {

  name : string,
  data : {
      x : string
      y : number
  }[],
  fillColor? : string,

}

  interface BarChartProps {
    chart_label : string;
    chart_meaning : string;
    chart_icon : React.ReactElement;
    series : BarSeriesTypes[] | undefined;
    isLoading? : boolean;
    stacked? : boolean
  }


  


  
   
   
  export default function BarChart({chart_icon, chart_label, chart_meaning, series, isLoading = false, stacked}:BarChartProps) {
    const [fontSize, setFontSize] = useState(11); // Default font size is 12px

    const increaseFontSize = () => setFontSize((prev) => prev + 1);
    const decreaseFontSize = () => setFontSize((prev) => (prev > 1 ? prev - 1 : 1));

    const chartConfig = {
      series,
      options: {
        chart: {
          stacked: stacked ? stacked : false,
          background: 'white',
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              // Disable some built-in icons if you don't need them
              download: true, 
              // Custom icon for increasing font size
              customIcons: [
                {
                  icon: `<div style="font-size: 16px; margin-left: 15px; cursor: pointer;">A+</div>`, // HTML for the button
                  index: 0,
                  title: 'Increase Font Size',
                  class: 'custom-icon',
                  click: function () {
                    increaseFontSize();
                  },
                },
                {
                  icon: `<div style="font-size: 16px; margin-left: 10px; cursor: pointer;">A-</div>`,
                  index: 1,
                  title: 'Decrease Font Size',
                  class: 'custom-icon',
                  click: function () {
                    decreaseFontSize(); 
                  },
                },
              ],
            },
          },
          foreColor: '#101010',
        },
        plotOptions: {
          bar: {
            columnWidth: "80%",
            barHeight: "100%",
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          labels: {
            style: {
              fontSize: `${fontSize}px`, // Dynamically update font size for labels
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: `${fontSize}px`, // Dynamically update font size for labels
            },
          },
        },
      },
    };






    return (
      <Card className="h-full border-2 border-gray-300 shadow-none">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center h-12"
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
        <CardBody className="px-2 pb-4 h-96">
          {
            series && chartConfig ? 
              !isLoading ?
                <Chart
                  options={chartConfig.options}
                  series={chartConfig.series}
                  height={"100%"}
                  width={"100%"}
                  type="bar"
                /> : <Skeleton/>:
                <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
          }
          


        </CardBody>
      </Card>
    );
  }