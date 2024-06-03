import React, { useEffect } from 'react'
import { SimpleCard } from '../../Components/Dashboard/SimpleCard'
import LineChart from '../../Components/Dashboard/LineChart'
import { Square3Stack3DIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon} from "@heroicons/react/24/outline";
import { StickyNavbar } from '../../Components/StickyNavBar';
import Table from '../../Components/Table';
import axios from "../../api/axios";
import Cookies from 'js-cookie';
function DashBoard() {


  useEffect(()=>{
    const user_info = JSON.parse(Cookies.get('user_info') as string);
    // console.log(user_info);
    axios.get(`/dashboard/overview-data/${user_info.province_code}/${user_info.user_type}/${user_info.municipality_code}`)
    .then(res => console.log(res.data))
    .catch(err => console.error(err))
  },[])


  return (
    <div className='bg-gradient-to-t from-green-400 via-green-200 to-slate-50 h-screen'>

      <div className='flex flex-col h-full gap-2'>
        <div className='flex flex-wrap md:flex-nowrap items-center justify-center gap-3 basis-1/4 px-2'>
          <SimpleCard body='500' header='Today GHGe'  trend={<ArrowTrendingUpIcon className='h-6 w-6'/>}/>
          <SimpleCard body='1325' header='Total Surveyor' trend={<ArrowTrendingUpIcon className='h-6 w-6'/>}/>
          <SimpleCard body='1245' header='Total LGU Admin' trend={<ArrowTrendingUpIcon className='h-6 w-6'/>}/>
        </div>

        <div className='flex flex-nowrap px-3 pb-5 basis-3/4 gap-0 md:gap-2'>

          <div className='basis-full md:basis-3/5'>
            <Table/>
          </div>

          <div className='flex-none md:basis-2/5 bg-blue-gray-400'>
            
          </div>
          
        </div>
          

          {/* <div className='grid grid-cols-1 grid-rows-3 gap-3'> */}

              {/* <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/> */}

          {/* </div> */}
          {/* <div className='col-span-2 bg-blue-gray-400 flex justify-center items-center rounded-lg'>
              insert TreaMap
          </div> */}
 
      </div>

    </div>

  )
}

export default DashBoard