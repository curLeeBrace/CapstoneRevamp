import { Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";


// type DonutChartSeriesTypes = {

//     name : string,
//     data : {
//         x : string
//         y : number
//     }[],
//     fillColor? : string,

// }


type DonutChartProps = {
    series : number[]
    labels : string[]
    title : string
    chart_meaning: string
}


export type DonutState = {
    series : number[]
    labels : string[]
}




const DonutChart = ({series, labels, title, chart_meaning} : DonutChartProps) => {

    const chartConfig = {
        series,
      
        options: {
            
          chart: {
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
          labels : labels,
          
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    // name: {
                    //   ...
                    // },
                    // value: {
                    //   ...
                    // }
                  },
                },

              },
              
            },
        
            

          dataLabels: {
            enabled: true,
            formatter: function (val:number) {

                return val.toFixed(2) + "%"
              },
          },
         
         
        
        },
      };

      

    return(
        <div >
            <div className="text-base font-bold ml-4">{title}</div>
            <Typography
              variant="small"
              color="gray"
              className="max-w-sm font-normal ml-4"
            >
              {chart_meaning}
            </Typography>
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    height={"110%"}
                    width={"100%"}
                    type="donut"
                />
          
        </div>
    )
}



export default DonutChart