import { useEffect, useState } from 'react';
import { TableWithFooter } from '../../Components/TableWithFooter';
import useUserInfo from '../../custom-hooks/useUserType';
import useAxiosPrivate from '../../custom-hooks/auth_hooks/useAxiosPrivate';
// import FilterComponent from '../../Components/FilterComponent';

import BrgyMenu from '../../custom-hooks/BrgyMenu';
import Municipality from '../../custom-hooks/Municipality';
import YearMenu from '../../Components/YearMenu';

import { AddressReturnDataType } from '../../custom-hooks/useFilterAddrress';
import { Typography } from '@material-tailwind/react';
import { useLocation } from 'react-router-dom';
import { TabsDefault } from '../../Components/Tabs';
import LineGraph from '../../Components/Dashboard/LineGraph';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import axios from './../../api/axios';

const GHGeSummary = ()=>{

  const [loc, setLoc] = useState<AddressReturnDataType>()
  const [year, setYear] = useState<string | undefined>(new Date().getFullYear().toString());
  const [isLoading, setisLoading] = useState<boolean>(true); 
  const [historicalData, setHistoricalData] = useState<{year: string, ghge: number}[]>([]);

  const [tablecontent, setTableContent] = useState({
    tb_rows : undefined as any,
    tb_proportion : {
      mobileCombustionProportion : "0",
      wasteWaterProportion : "0",
      industrialProportion : "0",
      agricultureCropsProportion : "0",
      agricultureLivestockProportion : "0",
      residentialStationaryProportion : "0",
      commercialStationaryProportion : "0",
      forestAndLandUseProportion : "0"
    },
    totalGHGe : 0,
    totalProportion : "0",
  });

  const axiosPrivate = useAxiosPrivate();
  const user_info = useUserInfo();
  const {state} = useLocation();

  useEffect(()=>{
    const {user_type, province_code, municipality_code} = user_info
    setisLoading(true)
    axiosPrivate.get("/summary-data/ghge-summary",{params:{
      user_type,
      municipality_code : user_type === "s-admin" && province_code ? loc?.address_code : municipality_code || loc?.address_code,
      brgy_code :  user_type === "lgu_admin" && loc?.address_code ? loc?.address_code : undefined,
      year,
      province_code,
    }})
    .then((res)=>{
      const ghge = res.data;
      setisLoading(false)

      if(ghge){
        
        const totalMobileCombustionGHGE = ghge.mobileCombustionGHGe.reduce((acc:any, val:any) => acc + val.emission.ghge, 0).toFixed(2);

        const totalWasteWaterGHGE = ghge.wasteWaterGHGe.reduce((acc:any, val:any) => acc + val.ghge, 0).toFixed(2);

        const totalIndustrialGHGE = ghge.industrialGHGe.reduce((acc:any, val:any) => acc + val.ghge, 0).toFixed(2);

        const totalAgricultureCropsGHGE = ghge.agriculture_cropsGHGe.reduce((acc:any, val:any) => acc + val.ghge, 0).toFixed(2);

        const totalAgricultureLivestockGHGE = ghge.agriculture_liveStocksGHGe.reduce((acc:any, val:any) => acc + val.ghge, 0).toFixed(2);

        const totalStationaryResidentialGHGE = ghge.stationary_resGHGe.reduce((acc:any, val:any) => acc + val.ghge, 0).toFixed(2); 

        const totalStationaryCommercialGHGE = ghge.stationary_commGHGe.reduce((acc:any, val:any) => acc + val.ghge, 0).toFixed(2);

        const totalForestAndLandUseContainerGHGE = ghge.forestAndLandUseContainer.reduce((acc:any, val:any) => acc + val.ghge, 0).toFixed(2);

        const calculateProportion = (value: number, total_ghge: number) => {
          const proportion = total_ghge > 0 ? (value / total_ghge) * 100 : 0;
          return `${proportion.toFixed(2)}%`; 
        };

        const mobileCombustionProportion = calculateProportion(parseFloat(totalMobileCombustionGHGE),ghge.total_ghge);
        const wasteWaterProportion = calculateProportion(parseFloat(totalWasteWaterGHGE), ghge.total_ghge);
        const industrialProportion = calculateProportion(parseFloat(totalIndustrialGHGE), ghge.total_ghge);
        const agricultureCropsProportion = calculateProportion(parseFloat(totalAgricultureCropsGHGE), ghge.total_ghge);
        const agricultureLivestockProportion = calculateProportion(parseFloat(totalAgricultureLivestockGHGE), ghge.total_ghge);
        const residentialStationaryProportion = calculateProportion((parseFloat(totalStationaryResidentialGHGE)), ghge.total_ghge);
        const commercialStationaryProportion = calculateProportion((parseFloat(totalStationaryCommercialGHGE)), ghge.total_ghge);
        const falu_proportion = calculateProportion((parseFloat(totalForestAndLandUseContainerGHGE)), ghge.total_ghge);

        const totalProportion = (
          parseFloat(mobileCombustionProportion) +
          parseFloat(wasteWaterProportion) +
          parseFloat(industrialProportion) +
          parseFloat(agricultureCropsProportion) +
          parseFloat(agricultureLivestockProportion) +
          parseFloat(residentialStationaryProportion) +
          parseFloat(commercialStationaryProportion) +
          parseFloat(falu_proportion)
        ).toFixed(2);

        const TABLE_ROWS = [
          { name: "Scope 1 Emissions", ghge: "", proportion: "", isCategory: true },
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
          { name: "Scope 1 Emissions (Forestry and Land Use)", ghge: "", proportion: "", isCategory: true },
          { name: "GHG Emissions from Forestry and Land Use", ghge: totalForestAndLandUseContainerGHGE, proportion:  falu_proportion},
          // { name: "GHG Removal from Sink", ghge:"0.00" , proportion: "0.00%" },
        ];

        setTableContent({
          tb_rows : TABLE_ROWS,
          tb_proportion : {
            mobileCombustionProportion,
            wasteWaterProportion,
            industrialProportion,
            agricultureCropsProportion,
            agricultureLivestockProportion,
            residentialStationaryProportion,
            commercialStationaryProportion,
            forestAndLandUseProportion : falu_proportion
          },
          totalGHGe : ghge.total_ghge,
          totalProportion : totalProportion,
        })
      }

    })
    .catch(err => console.log(err))


  },[year, loc?.address_name])

  useEffect(() => {
    const { user_type, municipality_name } = user_info;
    setisLoading(true);

    axios.get('/summary-data/ghge-historical-data', {
      params: { 
        user_type,
        municipality_name : user_type === "s-admin" ? loc?.address_name : municipality_name

      }
    })
    .then((res) => {
      setHistoricalData(res.data);
    })
    .catch(err => console.log(err))
    .finally(() => setisLoading(false));
  }, [loc]);

  const historicalLineSeries = [{
  name: `${user_info.user_type === "s-admin" ? "Laguna" : user_info.municipality_name} GHGe.`,
  data: historicalData.map(item => ({
    x: item.year,
    y: Math.floor(item.ghge)
  }))
}];



    

  const TABLE_HEAD = [
    `Emission Source (${user_info.user_type === "s-admin" ? loc?.address_name ||"Laguna Province" : loc?.address_name || user_info.municipality_name || ""})`,
    "GHG Emissions (tonnes CO2e)",
    "Proportion of Total Emissions"
  ];


  return (
    <div className='mt-2 flex flex-col w-full p-4'>
      <Typography className='bg-darkgreen font-bold text-lg mb-4 rounded-lg py-3 -mt-3 text-center' color='white'>
        GHG Emissions Summary
      </Typography>
   

      <TabsDefault data={[
        {
          label : 'GHG Summary Table',
          value : 's-data',
          tabPanelChild : (
            <div>
            <div className='lg:flex flex-row md:w-1/2 w-full md:justify-around mx-auto mb-2 -mt-2 border-green-400 border-2 rounded-lg py-2'> 
            <div className='mx-2'>
              {
                user_info.user_type === "s-admin" ? <Municipality setAddress={setLoc} /> :
                <BrgyMenu setBrgys={setLoc} municipality_code={user_info.municipality_code} user_info={user_info}
                  deafult_brgyName={user_info.user_type === 'lu_admin' ? 'Laguna University' : (state && state.brgy_name) } />
              }
            </div>
            <div className='mt-2 lg:mt-0 mx-2'><YearMenu useYearState={[year, setYear]}/></div>
          </div>
              {
                tablecontent.tb_rows && (
                  <TableWithFooter
                    tableHead={TABLE_HEAD}
                    tableRows={tablecontent.tb_rows}
                    totalGHGEmissions={Math.floor(tablecontent.totalGHGe)}  
                    totalProportion={tablecontent.totalProportion}
                    loading={isLoading}
                  />
                )
              } 
            </div>
          )
        },
        {
          label : 'Graph',
          value : 'line-graph',
          tabPanelChild : (
            <div className='h-96'>
              <LineGraph
                chart_icon={<ArrowTrendingUpIcon className="h-full w-full"/>}
                chart_label={`Historical GHG Emissions`}
                chart_meaning={`GHG emissions per year in ${user_info.user_type === "s-admin" ? "Laguna" : user_info.municipality_name}.`}
                series={historicalLineSeries}
                isLoading={isLoading}
                xAxisTitle="Year"                    
                yAxisTitle="Calculated GHG Emissions" 
              />
            </div>
          )
        }
      ]} />
    </div>
   )
}

export default GHGeSummary;
