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
import useUserInfo from "../../custom-hooks/useUserType";
  
   

export type LineChartSeriesTypes = {

  name : string,
  data : {
      x : string
      y : number
  }[],
  fillColor? : string,

}

  interface LineChartProps {
    chart_label : string;
    chart_meaning : string;
    chart_icon : React.ReactElement;
    series : LineChartSeriesTypes[] | undefined;
    isLoading? : boolean;
    stacked? : boolean
    xAxisTitle?: string; 
    yAxisTitle?: string; 
  }


  


  
   
   
  export default function LineGraph({ chart_icon, chart_label, chart_meaning, series, isLoading = false, stacked, xAxisTitle,
    yAxisTitle }: LineChartProps) {
    const [fontSize, setFontSize] = useState(11); // Default font size is 12px

    const increaseFontSize = () => setFontSize((prev) => prev + 1);
    const decreaseFontSize = () => setFontSize((prev) => (prev > 1 ? prev - 1 : 1));
    const user_info = useUserInfo()
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
              download: true,
              customIcons: [
                {
                  icon: `<div style="font-size: 14px; margin-left: 15px; cursor: pointer;">A+</div>`,
                  index: 0,
                  title: 'Increase Font Size',
                  class: 'custom-icon',
                  click: () => increaseFontSize(),
                },
                {
                  icon: `<div style="font-size: 14px; margin-left: 10px; cursor: pointer;">A-</div>`,
                  index: 1,
                  title: 'Decrease Font Size',
                  class: 'custom-icon',
                  click: () => decreaseFontSize(),
                },
              ],
            },
          },
          foreColor: '#101010',
          margin: {
            top: 50,
            left: 20,
            right: 20,
            bottom: 50,
          },
        },
        colors: ['#006400'],
        plotOptions: {
          bar: {
            columnWidth: user_info.user_type === 'lu_admin' ? '20%' : '90%',
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
              fontSize: `${fontSize}px`,
            },
          },
          title: {
            text: xAxisTitle,
            style: {
              fontSize: `${fontSize}px`,
              fontWeight: 600,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: `${fontSize}px`,
            },
          },
          title: {
            text: yAxisTitle,
            style: {
              fontSize: `${fontSize}px`,
              fontWeight: 600,
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
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center h-20"
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
              className="max-w-sm font-normal whitespace-nowrap"
            >
              {chart_meaning}
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-2 pb-4 -mt-6 h-full">
          {
            series && chartConfig ? 
              !isLoading ?
                <Chart
                  options={chartConfig.options}
                  series={chartConfig.series}
                  height={"100%"}
                  width={"100%"}
                  type="line"
                /> : <Skeleton/>
                :
                <SimpleCard body={"No Available Data"} header="" icon={<ExclamationTriangleIcon className="h-full w-full"/>}/>
          }
          


        </CardBody>
      </Card>
    );
  }