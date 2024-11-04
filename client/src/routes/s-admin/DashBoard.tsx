import { useEffect, useState } from 'react'
import  SimpleCard from '../../Components/Dashboard/SimpleCard'

import {UserIcon, GlobeAsiaAustraliaIcon} from "@heroicons/react/24/outline";
// import Table from '../../Components/Table';


import SurveyorInfo from '../../Components/Dashboard/SuerveyorInfo';
// import DashboardGHGeSummary from '../../Components/Dashboard/DashboardGHGeSummary';
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';
import useUserInfo from '../../custom-hooks/useUserType';
import { Typography } from '@material-tailwind/react';
import BarChart from '../../Components/Dashboard/BarChart';
import { TableWithFooter } from '../../Components/TableWithFooter';
// import FilterSummary from './FilterSummary';
// import { AddressReturnDataType } from '../../custom-hooks/useFilterAddrress';

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
  mobileCombustionGHGe: number;
  total_surveryor : number;
  total_LGU_admins : number;
  table_data: {
      mobileCombustionGHGe : MobileCombustionTableData[],
      wasteWaterGHGe : number[],
      industrialGHGe : number[],
      agriculture_cropsGHGe : number[],
      agriculture_liveStocksGHGe : number[],
      stationaryGHGe : number[],
      residentialGHGe?: number[]; 
      commercialGHGe?: number[];   
  }
  total_ghge : number;

}



function DashBoard() {

  const [dashboard_data, setDashBoardData] = useState<DashBoardData>();
  const [isLoading, setisLoading] = useState<boolean>(true);
  const axiosPrivate = useAxiosPrivate();
  const user_info = useUserInfo();
  const [fontSize, setFontSize] = useState(13); 
  const increaseFontSize = () => setFontSize((prev) => prev + 1);
  const decreaseFontSize = () => setFontSize((prev) => (prev > 1 ? prev - 1 : 1));

 

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
      {
        name: "Industrial GHGe",
        data: dashboard_data ? dashboard_data.table_data.mobileCombustionGHGe.map((tb_data, index) => ({
          x: tb_data.loc_name,
          y: dashboard_data.table_data.industrialGHGe[index].toFixed(2)
        })) : [{ x: null, y: null }],
        
      },
      {
        name: "AgricultureCrops GHGe",
        data: dashboard_data ? dashboard_data.table_data.mobileCombustionGHGe.map((tb_data, index) => ({
          x: tb_data.loc_name,
          y: dashboard_data.table_data.agriculture_cropsGHGe[index].toFixed(2)
        })) : [{ x: null, y: null }],
        
      },
      {
        name: "AgricultureLiveStocks GHGe",
        data: dashboard_data ? dashboard_data.table_data.mobileCombustionGHGe.map((tb_data, index) => ({
          x: tb_data.loc_name,
          y: dashboard_data.table_data.agriculture_liveStocksGHGe[index].toFixed(2)
        })) : [{ x: null, y: null }],
        
      },

      {
        name: "Stationary GHGe",
        data: dashboard_data ? dashboard_data.table_data.mobileCombustionGHGe.map((tb_data, index) => ({
          x: tb_data.loc_name,
          y: dashboard_data.table_data.stationaryGHGe[index].toFixed(2)
        })) : [{ x: null, y: null }],
        
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
                  increaseFontSize(); // Action on click
                },
              },
              {
                icon: `<div style="font-size: 16px; margin-left: 10px; cursor: pointer;">A-</div>`, // HTML for the button
                index: 1,
                title: 'Decrease Font Size',
                class: 'custom-icon',
                click: function () {
                  decreaseFontSize(); // Action on click
                },
              },
            ],
          },
        },
        foreColor: '#101010',
      },
      colors : ["#248003", "#2942b3", "#f58142", "#fcba03", "#03fc20"],
      plotOptions: {
        bar: {
          columnWidth: '90%',
          barHeight: '100%',
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '10px', // Adjust the font size here
          fontWeight: 'bold',
          colors: ['#fff']
        },
        offsetY: -10,
      },

      title: {
        text: `Total GHGe per ${user_info.user_type === "s-admin" ? "Municipality (Laguna Province)" : user_info.user_type === "lgu_admin" ? `Brgy. (${user_info.municipality_name})` : "Brgy."}`,
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
            fontSize: `${fontSize}px`,
          },
          padding: {
            left: 20,
            right: 20
          },
          
        }
      }
    },
  }

  {/* ===============================================================

          ETO YUNG GINAWA KONG SUMMARY TABLE

      =============================================================== */}
    //  =============================
    //    GHG Emissions (tonnes CO2e)
    //  =============================

      const mobileCombustionGHGe = dashboard_data?.table_data.mobileCombustionGHGe || [];
      const totalMobileCombustionGHGE = mobileCombustionGHGe.reduce((acc, val) => acc + val.emission.ghge, 0).toFixed(2);
      
      const wasteWaterGHGe = dashboard_data?.table_data.wasteWaterGHGe || [];
      const totalWasteWaterGHGE = wasteWaterGHGe.reduce((acc, val) => acc + val, 0).toFixed(2);
      
      const industrialGHGe = dashboard_data?.table_data.industrialGHGe || [];
      const totalIndustrialGHGE = industrialGHGe.reduce((acc, val) => acc + val, 0).toFixed(2);
      
      const agricultureCropsGHGe = dashboard_data?.table_data.agriculture_cropsGHGe || [];
      const totalAgricultureCropsGHGE = agricultureCropsGHGe.reduce((acc, val) => acc + val, 0).toFixed(2);

      const agricultureLiveStocksGHGe = dashboard_data?.table_data.agriculture_liveStocksGHGe || [];
      const totalAgricultureLivestockGHGE = agricultureLiveStocksGHGe.reduce((acc, val) => acc + val, 0).toFixed(2);
      
      const residentialGHGe = dashboard_data?.table_data.residentialGHGe || [];
      const totalStationaryResidentialGHGE = residentialGHGe.reduce((acc, val) => acc + val, 0).toFixed(2); 


      const commercialGHGe = dashboard_data?.table_data.commercialGHGe || [];
      const totalStationaryCommercialGHGE = commercialGHGe.reduce((acc, val) => acc + val, 0).toFixed(2);

    //  ========================================
    //    Total Scope 1 Emissions (GHG Emission)
    //  ========================================
      const totalGHGEmissions = (
        parseFloat(totalMobileCombustionGHGE) +
        parseFloat(totalWasteWaterGHGE) +
        parseFloat(totalIndustrialGHGE) +
        parseFloat(totalAgricultureCropsGHGE) +
        parseFloat(totalAgricultureLivestockGHGE)+
        parseFloat(totalStationaryResidentialGHGE) +
        parseFloat(totalStationaryCommercialGHGE)
        
    ).toFixed(2);
    
    // Function to calculate proportion
    const calculateProportion = (value: number, totalGHGEmissions: number) => {
      const proportion = totalGHGEmissions > 0 ? (value / totalGHGEmissions) * 100 : 0;
      return `${proportion.toFixed(2)}%`; // Round to two decimal places
    };
    
    //  =============================
    //  Proportion of Total Emissions
    //  =============================
    const mobileCombustionProportion = calculateProportion(parseFloat(totalMobileCombustionGHGE),parseFloat (totalGHGEmissions));
    const wasteWaterProportion = calculateProportion(parseFloat(totalWasteWaterGHGE), parseFloat(totalGHGEmissions));
    const industrialProportion = calculateProportion(parseFloat(totalIndustrialGHGE), parseFloat(totalGHGEmissions));
    const agricultureCropsProportion = calculateProportion(parseFloat(totalAgricultureCropsGHGE), parseFloat(totalGHGEmissions));
    const agricultureLivestockProportion = calculateProportion(parseFloat(totalAgricultureLivestockGHGE), parseFloat(totalGHGEmissions));
    const residentialStationaryProportion = calculateProportion(parseFloat(totalStationaryResidentialGHGE), parseFloat(totalGHGEmissions));
    const commercialStationaryProportion = calculateProportion(parseFloat(totalStationaryCommercialGHGE), parseFloat(totalGHGEmissions));
    


    const totalProportion = (
      parseFloat(mobileCombustionProportion) +
      parseFloat(wasteWaterProportion) +
      parseFloat(industrialProportion) +
      parseFloat(agricultureCropsProportion) +
      parseFloat(agricultureLivestockProportion) +
      parseFloat(residentialStationaryProportion) +
      parseFloat(commercialStationaryProportion) 
  ).toFixed(2);
    
    
     
  const TABLE_HEAD = [
    `${user_info.user_type === "s-admin" ? "Laguna" : user_info.municipality_name} Emission Source`,
    "GHG Emissions (tonnes CO2e)",
    "Proportion of Total Emissions"
  ];
  
  const TABLE_ROWS = [
    { name: "Scope 1 Emissions (Net of Forestry and Land Use)", ghge: "", proportion: "", isCategory: true },
    { name: "GHG Emissions from Community-Level Residential Stationary Fuel Use", ghge: totalStationaryResidentialGHGE, proportion: residentialStationaryProportion },
    { name: "GHG Emissions from Community-Level Commercial Stationary Fuel Use", ghge: totalStationaryCommercialGHGE,  proportion: commercialStationaryProportion },
    { name: "GHG Emissions from Community Mobile Combustion", ghge: totalMobileCombustionGHGE, proportion:mobileCombustionProportion },
    // { name: "GHG Emissions from Solid Waste Disposal - IPCC FOD Method", ghge: "0.00", proportion: "0.00%" },
    // { name: "GHG Emissions from Other Solid Waste Treatment (ICLEI)", ghge: "0.00", proportion: "0.00%" },
    // { name: "GHG Emissions from Solid Waste Open Burning (ICLEI)", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Wastewater Treatment and Discharge", ghge: totalWasteWaterGHGE, proportion:wasteWaterProportion},
    { name: "GHG Emissions from Community-Level Agriculture (Crops)", ghge: totalAgricultureCropsGHGE, proportion: agricultureCropsProportion },
    { name: "GHG Emissions from Community-Level Agriculture (Livestock)", ghge: totalAgricultureLivestockGHGE, proportion: agricultureLivestockProportion},
    // { name: "GHG Emissions from Solid Waste Disposal - Inside LGU Geopolitical Boundaries (ICLEI)", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Industrial Processes and Product Use", ghge: totalIndustrialGHGE, proportion: industrialProportion},
    // { name: "Scope 1 Emissions/Removal (Forestry and Land Use)", ghge: "", proportion: "", isCategory: true },
    // { name: "GHG Emissions from Forestry and Land Use", ghge: "0.00", proportion: "0.00%" },
    // { name: "GHG Removal from Sink", ghge:"0.00" , proportion: "0.00%" },
  ];


 

  return (
    <div className='h-full w-full bg-gray-200 '>

      <div className='flex flex-col h-full w-full'>
        <div className='flex items-center gap-3 basis-1/4 px-2 overflow-x-auto mx-6 my-4 pb-2'>
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.total_ghge.toFixed(2)}`} header='Total GHGe'  icon={<GlobeAsiaAustraliaIcon className='h-6 w-6'/>} isLoading={isLoading} /> {/*child_card={<DashboardGHGeSummary/>} */}
          </div>        
          
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.total_surveryor}`} header='Total Surveyor' icon={<UserIcon className='h-6 w-6'/>} child_card={<SurveyorInfo/>} isLoading={isLoading}/>
          
          </div>
          <div className='h-4/5 w-full'>
            <SimpleCard body={`${dashboard_data?.total_LGU_admins}`} header='Total LGU Admin' icon={<UserIcon className='h-6 w-6'/>} isLoading={isLoading}/>

          </div>
        </div>

       <div className='md:my-2 md:mx-8 md:flex'>

       
         
         
       <div className=" md:w-1/3 h-1/4 text-xs bg-white ml-4 pt-2 rounded-lg shadow-md mr-4">

          <Typography className='bg-darkgreen font-bold text-base mb-4 rounded-lg py-2 -mt-2 text-center' color='white'>
            Green House Gas Emission (Charts)
            </Typography>
            <div className="mb-4 px-4 h-20">
              <SimpleCard
              body={`${dashboard_data?.table_data.mobileCombustionGHGe.reduce((acc, val) => acc + val.emission.ghge, 0).toFixed(2)}`} // Make sure this accesses the correct properties
              header="Mobile Combustion"
              icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
              child_card={<BarChart chart_icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />} chart_label='Mobile Combustion' chart_meaning= {`GHGe per ${user_info.user_type === "s-admin" ? "Municipality in Laguna." : `Brgy in ${user_info.municipality_name}.`}`} series={[chartConfig.series[0] as any]} isLoading = {isLoading}/>}
              isLoading={isLoading}
              />
            </div>

            <div className="mb-4 px-4 h-20">
              <SimpleCard
                body={`${dashboard_data?.table_data.wasteWaterGHGe.reduce((acc, val) => acc + val, 0).toFixed(2)}`}
                header="Waste Water"
                icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                child_card={<BarChart chart_icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />} chart_label='Waste Water' chart_meaning= {`GHGe per ${user_info.user_type === "s-admin" ? "Municipality in Laguna." : `Brgy in ${user_info.municipality_name}.`}`} series={[chartConfig.series[1] as any]} isLoading = {isLoading}/>}
                isLoading={isLoading}
              />
            </div>

            <div className="mb-4 px-4 h-20">
              <SimpleCard
              body={`${dashboard_data?.table_data.industrialGHGe.reduce((acc, val) => acc + val, 0).toFixed(2)}`}
              header="Industrial"
                icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                child_card={<BarChart chart_icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />} chart_label='Industrial' chart_meaning= {`GHGe per ${user_info.user_type === "s-admin" ? "Municipality in Laguna." : `Brgy in ${user_info.municipality_name}.`}`} series={[chartConfig.series[2] as any]} isLoading = {isLoading}/>}
                isLoading={isLoading}
              />
            </div>

            <div className="mb-4 px-4 h-20">
              <SimpleCard
              body={`${dashboard_data?.table_data.agriculture_cropsGHGe.reduce((acc, val) => acc + val, 0).toFixed(2)}`}
              header="Agriculture Crops"
                icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                child_card={<BarChart chart_icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />} chart_label='Agriculture Crops' chart_meaning= {`GHGe per ${user_info.user_type === "s-admin" ? "Municipality in Laguna." : `Brgy in ${user_info.municipality_name}.`}`} series={[chartConfig.series[3] as any]} isLoading = {isLoading}/>}
                isLoading={isLoading}
              />
            </div>

            <div className="mb-4 px-4 h-20">
              <SimpleCard
                body={`${dashboard_data?.table_data.agriculture_liveStocksGHGe.reduce((acc, val) => acc + val, 0).toFixed(2)}`}
                header="Agriculture Live Stocks"
                icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                child_card={<BarChart chart_icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />} chart_label='Agriculture Live Stocks' chart_meaning= {`GHGe per ${user_info.user_type === "s-admin" ? "Municipality in Laguna." : `Brgy in ${user_info.municipality_name}.`}`} series={[chartConfig.series[4] as any]} isLoading = {isLoading}/>}
                isLoading={isLoading}
              />
            </div>


            
            <div className="mb-4 px-4 h-20">
              <SimpleCard
                body={`${dashboard_data?.table_data.stationaryGHGe.reduce((acc, val) => acc + val, 0).toFixed(2)}`}
                header="Stationary"
                icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                child_card={<BarChart chart_icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />} chart_label='Stationary' chart_meaning= {`GHGe per ${user_info.user_type === "s-admin" ? "Municipality in Laguna." : `Brgy in ${user_info.municipality_name}.`}`} series={[chartConfig.series[5] as any]} isLoading = {isLoading}/>}
                isLoading={isLoading}
              />
            </div>

          

        </div>
        {/* ===============================================================
          SUMMARY TABLE
          =============================================================== */}
      <div className="pt-4 px-4 bg-white rounded-lg overflow-x-auto shadow-md h-4/5">
      <Typography className='bg-darkgreen font-bold text-lg mb-4 rounded-lg py-2 -mt-2 text-center' color='white'>
      GHG Emissions Summary Table
            </Typography>
      {/* <div className="flex flex-col items-center w-full mb-4 gap-2 text-nowrap 2xl:w-4/5">
      <Typography className=' bg-darkgreen px-2 font-bold text-base rounded-lg py-2 -mt-1 text-center mr-2' color='white'>
      Filter by:
            </Typography>
                        <FilterSummary
                        
                            municipalityState={
                                {
                                    state : municipality,
                                    setState : setMunicipality
                                }
                                
                            }
                            brgyState={
                                {
                                    state : brgy,
                                    setState : setBrgy
                                }
                            }
                        

                            yearState={
                                {
                                    state : yearState,
                                    setState : setYearState
                                }
                            }  
                        
                        />
                    </div> */}
                    <div className='mb-2'>
                    <TableWithFooter
                        tableHead={TABLE_HEAD}
                        tableRows={TABLE_ROWS}
                        totalGHGEmissions={totalGHGEmissions}
                        totalProportion= {totalProportion}
                      />
                      </div>
                      </div>

        {/* <div className='basis-full border border-gray-400 bg-white shadow-gray-500 rounded-lg px-4 '>

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

        </div> */}
        </div>

        <div className='flex flex-wrap md:flex-nowrap px-5 basis-3/4 gap-3 h-1/3 w-full'>

          {/* <div className='hidden lg:block lg:basis-2/6 h-5/6 border border-gray-400 rounded-2xl overflow-hidden'>
          
             {dashboard_data && <Table TABLE_ROWS={dashboard_data.table_data}/>}
          </div> */}

          {/* lg:basis-8/12 */}
          
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