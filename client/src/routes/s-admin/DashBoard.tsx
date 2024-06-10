import { useEffect, useState } from 'react'
import { SimpleCard } from '../../Components/Dashboard/SimpleCard'

import { FireIcon, UserIcon} from "@heroicons/react/24/outline";
import Table from '../../Components/Table';
import axios from "../../api/axios";
import Cookies from 'js-cookie';
import Chart from "react-apexcharts";



type Emission = {
  co2e : number;
  ch4e : number;
  n2oe : number;
  ghge : number;
}
export type TableData = {
  municipality : String;
  emission : Emission;
}

type DashBoardData = {
  total_surveryor : number;
  total_LGU_admins : number;
  today_ghge : number;
  table_data : TableData[]

}



function DashBoard() {

  const [dashboard_data, setDashBoardData] = useState<DashBoardData>();

  useEffect(()=>{

    const user_info = JSON.parse(Cookies.get('user_info') as string);
    
    axios.get(`/dashboard/overview-data/${user_info.province_code}/${user_info.user_type}/${user_info.municipality_code}`)
    .then(res => {
      setDashBoardData(res.data)
     
    })
    .catch(err => console.error(err))
  },[])
  
  // bg-gradient-to-t from-green-400 via-green-200 to-slate-50

  const chartConfig = {
    series: [
      {
        name: "GHGe",
        data: dashboard_data ? dashboard_data.table_data.map((tb_data) => ({
          x: tb_data.municipality,
          y: tb_data.emission.ghge.toFixed(2)
        })) : [{ x: null, y: null }],
      },
    ],
    options: {
      chart: {
        background: 'white',
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: false
          }
        },
        foreColor: '#101010',
      },
      colors: ["#C01E01"],
      plotOptions: {
        bar: {
          columnWidth: '80%',
          barHeight: '100%',
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '8px', // Adjust the font size here
          fontWeight: 'bold',
          colors: ['#fff']
        },
        offsetY: -10,
      },
      title: {
        text: 'Total GHG Emission per Municipality',
        align: 'center' as 'center',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333'
        }
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '10px',
            fontWeight: 'bold',
          },
          padding: {
            left: 20,
            right: 20
          },
          
        }
      }
    },
  };
 

  return (
    <div className='h-full w-full fixed overflow-y-auto bg-gray-200 '>

      <div className='flex flex-col h-full w-full'>
        <div className='flex items-center gap-3 basis-1/4 px-2 overflow-x-auto'>
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.today_ghge.toFixed(2)}`}header='Total GHGe'  icon={<FireIcon className='h-6 w-6 text-red-300'/>}/>
          </div>        
          
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.total_surveryor}`} header='Total Surveyor' icon={<UserIcon className='h-6 w-6'/>}/>
          
          </div>
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.total_LGU_admins}`} header='Total LGU Admin' icon={<UserIcon className='h-6 w-6'/>}/>

          </div>
        </div>

        <div className='flex flex-wrap md:flex-nowrap px-5 basis-3/4 gap-3 h-1/3 w-full'>

          <div className='hidden lg:block lg:basis-2/6 h-5/6 border border-gray-400 rounded-2xl overflow-hidden'>
          
             {dashboard_data && <Table TABLE_ROWS={dashboard_data.table_data}/>}
          </div>

          <div className='basis-full lg:basis-8/12 h-5/6  border border-gray-400 bg-white shadow-gray-500 shadow-2xl rounded-lg p-1'>
            {
            chartConfig? 
            <Chart
              width={'100%'}
              height={'100%'}
              type={'bar'}
              series={chartConfig.series}
              options={chartConfig.options}
            /> : null
            }
            
          </div>
          
        </div>
          

          {/* <div className='grid grid-cols-1 grid-rows-3 gap-3'>

              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>

          </div> */}
   
      </div>

    </div>

  )
}

export default DashBoard