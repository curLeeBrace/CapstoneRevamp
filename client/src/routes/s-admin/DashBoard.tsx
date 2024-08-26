import { useEffect, useState } from 'react'
import  SimpleCard from '../../Components/Dashboard/SimpleCard'

import {UserIcon, GlobeAsiaAustraliaIcon} from "@heroicons/react/24/outline";
// import Table from '../../Components/Table';

import Chart from "react-apexcharts";
import SurveyorInfo from '../../Components/Dashboard/SuerveyorInfo';
import DashMobileCombustionSummary from '../../Components/Dashboard/DashMobileCombustionSummary';
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';
import useUserInfo from '../../custom-hooks/useUserType';

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
      wasteWaterGHGe : number[]
  }
  total_ghge : number;

}



function DashBoard() {

  const [dashboard_data, setDashBoardData] = useState<DashBoardData>();
  const [isLoading, setisLoading] = useState<boolean>(true);
  const axiosPrivate = useAxiosPrivate();
  const user_info = useUserInfo();
  useEffect(()=>{


    
    axiosPrivate.get(`/dashboard/overview-data/${user_info.province_code}/${user_info.user_type}/${user_info.municipality_code}`)
    .then(res => {
      setDashBoardData(res.data)
      setisLoading(false);
     
    })
    .catch(err => console.error(err))
  },[])
  
  // bg-gradient-to-t from-green-400 via-green-200 to-slate-50

  const chartConfig = {
    series: [
      {
        name: "Mobile-Combustion GHGe",
        data: dashboard_data ? dashboard_data.table_data.mobileCombustionGHGe.map((tb_data) => ({
          x: tb_data.loc_name,
          y: tb_data.emission.ghge.toFixed(2)
        })) : [{ x: null, y: null }],
        
      },
      {
        name: "Waste-Water GHGe",
        data: dashboard_data ? dashboard_data.table_data.mobileCombustionGHGe.map((tb_data, index) => ({
          x: tb_data.loc_name,
          y: dashboard_data.table_data.wasteWaterGHGe[index].toFixed(2)
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
            download: true
          }
        },
        foreColor: '#101010',
      },
      colors : ["#248003", "#2942b3"],
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
        text: `Total GHGe per ${user_info.user_type === "s-admin" ? "Municipality" : "Brgy"}`,
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
            fontSize: '15px',
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
            <SimpleCard body={`${dashboard_data?.total_ghge.toFixed(2)}`}header='Total GHGe'  icon={<GlobeAsiaAustraliaIcon className='h-6 w-6'/>} isLoading={isLoading} child_card={<DashMobileCombustionSummary/>}/>
          </div>        
          
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.total_surveryor}`} header='Total Surveyor' icon={<UserIcon className='h-6 w-6'/>} child_card={<SurveyorInfo/>} isLoading={isLoading}/>
          
          </div>
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.total_LGU_admins}`} header='Total LGU Admin' icon={<UserIcon className='h-6 w-6'/>} isLoading={isLoading}/>

          </div>
        </div>

        <div className='flex flex-wrap md:flex-nowrap px-5 basis-3/4 gap-3 h-1/3 w-full'>

          {/* <div className='hidden lg:block lg:basis-2/6 h-5/6 border border-gray-400 rounded-2xl overflow-hidden'>
          
             {dashboard_data && <Table TABLE_ROWS={dashboard_data.table_data}/>}
          </div> */}

          {/* lg:basis-8/12 */}
          <div className='basis-full  h-5/6  border border-gray-400 bg-white shadow-gray-500 shadow-2xl rounded-lg p-1'>
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