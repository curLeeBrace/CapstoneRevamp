import { useEffect, useState } from 'react'

import Chart from "react-apexcharts";
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';
import useUserInfo from '../../custom-hooks/useUserType';
import { Typography } from '@material-tailwind/react';
import Skeleton from '../../Components/Skeleton';


type Emission = {
  co2e : number;
  ch4e : number;
  n2oe : number;
  ghge : number;
}

export type  MobileCombustionTableData = {
  loc_name : String;
  emission : Emission;
}

type DashBoardData = {
  total_surveryor : number;
  total_LGU_admins : number;
  table_data: {
      mobileCombustionGHGe : MobileCombustionTableData[],
      wasteWaterGHGe : number[],
      industrialGHGe : number[],
      agriculture_cropsGHGe : number[],
      agriculture_liveStocksGHGe : number[]
  }
  total_ghge : number;

}

// Define the props interface
interface GhgChartModalProps {
  ChartTitle: string;
  chartDataKey: 'mobileCombustionGHGe' | 'wasteWaterGHGe' | 'industrialGHGe' | 'agriculture_cropsGHGe' | 'agriculture_liveStocksGHGe';  // Define the title prop type
}


const GhgChartModal = ({ ChartTitle, chartDataKey }: GhgChartModalProps) => {
  const [dashboard_data, setDashBoardData] = useState<DashBoardData>();
  const axiosPrivate = useAxiosPrivate();
  const user_info = useUserInfo();
  const [fontSize, setFontSize] = useState(13); 
  const increaseFontSize = () => setFontSize((prev) => prev + 1);
  const decreaseFontSize = () => setFontSize((prev) => (prev > 1 ? prev - 1 : 1));



  

  useEffect(() => {
    axiosPrivate
      .get(`/dashboard/overview-data/${user_info.province_code}/${user_info.user_type}/${user_info.municipality_code}`)
      .then(res => {
        setDashBoardData(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Dynamically choose the dataset based on chartDataKey
  const selectedData = dashboard_data?.table_data[chartDataKey];

  const chartConfig = {
    series: [
      {
        name: ChartTitle,
        data: selectedData
          ? selectedData.map((item: MobileCombustionTableData | number, index: number) => ({
              x: typeof item === 'number'
                ? dashboard_data?.table_data.mobileCombustionGHGe[index]?.loc_name || ''
                : item.loc_name,
              y: typeof item === 'number'
                ? parseFloat(item.toFixed(2))
                : parseFloat(item.emission.ghge.toFixed(2)),
              fillColor: (() => {
                switch (chartDataKey) {
                  case 'mobileCombustionGHGe':
                    return '#248003'; 
                  case 'wasteWaterGHGe':
                    return '#2942b3'; 
                  case 'industrialGHGe':
                    return '#f58142'; 
                  case 'agriculture_cropsGHGe':
                    return '#fcba03'; 
                  case 'agriculture_liveStocksGHGe':
                    return '#03fc20'; 
                  default:
                    return '#248003'; 
                }
              })(),
            }))
          : [],
      },
    ],
    options: {
      chart: {
        background: 'white',
        toolbar: {
          show: true,
          tools: {
            // Disable some built-in icons if you don't need them
            download: true, 
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: true,
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
          columnWidth: '90%',
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          colors: ['#fff'],
        },
        offsetY: 0,
      },
      title: {
        text: `Total ${ChartTitle} GHGe per ${user_info.user_type === "s-admin" ? "Municipality (Laguna Province)" : user_info.user_type === "lgu_admin" ? `Brgy (${user_info.municipality_name})` : "Brgy."}`,
        align: 'center' as 'center',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: `${fontSize}px`,
          },
        },
      },
      
    },
  };

  return (
    <div className="h-full flex flex-col gap-5 w-full px-2">
      <Typography className="self-center text-2xl font-semibold text-gray-800" color="black">
        {ChartTitle}
      </Typography>

      <div className="basis-full h-full border border-gray-400 bg-white shadow-gray-500 rounded-lg px-4">
        {dashboard_data ? (
          <Chart width={'100%'} height={'100%'} type={'bar'} series={chartConfig.series} options={chartConfig.options} />
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
};
export default GhgChartModal;
