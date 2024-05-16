import React from 'react'
import { SimpleCard } from '../../Components/Dashboard/SimpleCard'
import LineChart from '../../Components/Dashboard/LineChart'
import { Square3Stack3DIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon} from "@heroicons/react/24/outline";
import { StickyNavbar } from '../../Components/StickyNavBar';


function DashBoard() {
  return (
    <>

      <div className='flex flex-col gap-5 min-h-screen pb-8 bg-gradient-to-t from-green-400 via-green-200 to-slate-50'>
        <div className='flex flex-wrap justify-around'>
          <SimpleCard body='500' header='Total co2e'  trend={<ArrowTrendingUpIcon className='h-6 w-6'/>}/>
          <SimpleCard body='1325' header='Total Surveyor' trend={<ArrowTrendingUpIcon className='h-6 w-6'/>}/>
          <SimpleCard body='1245' header='Total LGU Admin' trend={<ArrowTrendingUpIcon className='h-6 w-6'/>}/>
        </div>

        <div className='grid grid-cols-3 gap-5 mx-5'>
          <div className='grid grid-cols-1 grid-rows-3 gap-3'>

              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>

          </div>
          <div className='col-span-2 bg-blue-gray-400 flex justify-center items-center rounded-lg'>
              insert heatmap
          </div>
          
        </div>


      </div>
    </>

  )
}

export default DashBoard