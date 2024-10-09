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
}


export type DonutState = {
    series : number[]
    labels : string[]
}




const DonutChart = ({series, labels, title} : DonutChartProps) => {

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
        <div className="">
            <div className="text-xl ml-10">{title}</div>
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    height={"100%"}
                    width={"100%"}
                    type="donut"
                />
          
        </div>
    )
}



export default DonutChart