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

// type GHGeDataType = {
//   mobileCombustionGHGe : {
//     loc_name : string;
//     emission : {
//       co2e : number;
//       ch4e : number;
//       n2oe : number;
//       ghge : number;
//     }
//   }[],
//   wasteWaterGHGe :number[] ,
//   industrialGHGe :number[],
//   agriculture_cropsGHGe :number[],
//   agriculture_liveStocksGHGe :number[],
//   stationary_resGHGe :number[],
//   stationary_commGHGe :number[],
//   total_ghge : number
// }


const GHGeSummary = ()=>{
  



  const [loc, setLoc] = useState<AddressReturnDataType>()
  const [year, setYear] = useState<string | undefined>(new Date().getFullYear().toString());


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
    },
    totalGHGe : 0,
    totalProportion : "0",
  });


  
  const axiosPrivate = useAxiosPrivate();
  const user_info = useUserInfo();





useEffect(()=>{
  const {user_type, province_code, municipality_code} = user_info



  axiosPrivate.get("/summary-data/ghge-summary",{params:{
    user_type,
    municipality_code : user_type === "s-admin" && province_code ? loc?.address_code : municipality_code || loc?.address_code,
    brgy_code :  user_type === "lgu_admin" && loc?.address_code ? loc?.address_code : undefined,
    year,
    province_code,
  }})
  .then((res)=>{
    const ghge = res.data;




    if(ghge){

      //  =============================
        //    GHG Emissions (tonnes CO2e)
        //  =============================
    
        // const mobileCombustionGHGe = ghge?.mobileCombustionGHGe || [];
        const totalMobileCombustionGHGE = ghge.mobileCombustionGHGe.reduce((acc:any, val:any) => acc + val.emission.ghge, 0).toFixed(2);
        
        // const wasteWaterGHGe = ghge?.wasteWaterGHGe || [];
        const totalWasteWaterGHGE = ghge.wasteWaterGHGe.reduce((acc:any, val:any) => acc + val, 0).toFixed(2);
        
        // const industrialGHGe = ghge?.industrialGHGe || [];
        const totalIndustrialGHGE = ghge.industrialGHGe.reduce((acc:any, val:any) => acc + val, 0).toFixed(2);
        
        // const agricultureCropsGHGe = ghge?.agriculture_cropsGHGe || [];
        const totalAgricultureCropsGHGE = ghge.agriculture_cropsGHGe.reduce((acc:any, val:any) => acc + val, 0).toFixed(2);
    
        // const agricultureLiveStocksGHGe = ghge?.agriculture_liveStocksGHGe || [];
        const totalAgricultureLivestockGHGE = ghge.agriculture_liveStocksGHGe.reduce((acc:any, val:any) => acc + val, 0).toFixed(2);
    
        // const residentialGHGe = ghge?.stationary_resGHGe || [];
        const totalStationaryResidentialGHGE = ghge.stationary_resGHGe.reduce((acc:any, val:any) => acc + val, 0); 
    
        // const commercialGHGe = ghge?.stationary_commGHGe || [];
        const totalStationaryCommercialGHGE = ghge.stationary_commGHGe.reduce((acc:any, val:any) => acc + val, 0);
      
        
        //  =============================
        //  Proportion of Total Emissions
        //  =============================
        const mobileCombustionProportion = calculateProportion(parseFloat(totalMobileCombustionGHGE),ghge.total_ghge);
        const wasteWaterProportion = calculateProportion(parseFloat(totalWasteWaterGHGE), ghge.total_ghge);
        const industrialProportion = calculateProportion(parseFloat(totalIndustrialGHGE), ghge.total_ghge);
        const agricultureCropsProportion = calculateProportion(parseFloat(totalAgricultureCropsGHGE), ghge.total_ghge);
        const agricultureLivestockProportion = calculateProportion(parseFloat(totalAgricultureLivestockGHGE), ghge.total_ghge);
        const residentialStationaryProportion = calculateProportion((totalStationaryResidentialGHGE), ghge.total_ghge);
        const commercialStationaryProportion = calculateProportion((totalStationaryCommercialGHGE), ghge.total_ghge);
        
        
        const totalProportion = (
          parseFloat(mobileCombustionProportion) +
          parseFloat(wasteWaterProportion) +
          parseFloat(industrialProportion) +
          parseFloat(agricultureCropsProportion) +
          parseFloat(agricultureLivestockProportion) +
          parseFloat(residentialStationaryProportion) +
          parseFloat(commercialStationaryProportion) 
      ).toFixed(2);
    
    
    
    
    
    
    
    
    
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
          },
          totalGHGe : ghge.total_ghge,
          totalProportion : totalProportion,
        })
      }







  })
  .catch(err => console.log(err))













  






},[year, loc?.address_name])
















    //   const formatToTwoDecimalPlaces = (value: number) => {
    //     return (Math.floor(value * 100) / 100).toFixed(2);
    // };
      


      
      // const formattedTotalResidential = formatToTwoDecimalPlaces(totalStationaryResidentialGHGE);
      // const formattedTotalCommercial = formatToTwoDecimalPlaces(totalStationaryCommercialGHGE);

    //  ========================================
    //    Total Scope 1 Emissions (GHG Emission)
    //  ========================================
    //   const ghge?.total_ghge = (
    //     parseFloat(totalMobileCombustionGHGE) +
    //     parseFloat(totalWasteWaterGHGE) +
    //     parseFloat(totalIndustrialGHGE) +
    //     parseFloat(totalAgricultureCropsGHGE) +
    //     parseFloat(totalAgricultureLivestockGHGE)+
    //     (totalStationaryResidentialGHGE) +
    //     (totalStationaryCommercialGHGE)
        
    // ).toFixed(2);
    
    // Function to calculate proportion

    const calculateProportion = (value: number, total_ghge: number) => {
      const proportion = total_ghge > 0 ? (value / total_ghge) * 100 : 0;
      return `${proportion.toFixed(2)}%`; // Round to two decimal places
    };
    



    
    
     
  const TABLE_HEAD = [
    `Emission Source (${user_info.user_type === "s-admin" ? loc?.address_name ||"Laguna Province" : loc?.address_name || user_info.municipality_name || ""})`,
    "GHG Emissions (tonnes CO2e)",
    "Proportion of Total Emissions"
  ];
  











   return (
    <div className='mt-2 flex flex-col w-full p-4'>
       <Typography className='bg-darkgreen font-bold text-lg mb-4 rounded-lg py-3 -mt-3 text-center' color='white'>
      GHG Emissions Summary Table
            </Typography>
          <div className='md:flex flex-row w-1/2 md:justify-around self-center mb-4 border-green-400 border-2 rounded-lg py-3'> 
            <div>
              {
                user_info.user_type === "s-admin" ? <Municipality setAddress={setLoc} /> : <BrgyMenu setBrgys={setLoc} municipality_code={user_info.municipality_code}/>
              }
            </div>

            <div><YearMenu useYearState={[year, setYear]}/></div>
          </div>
                 {/* ETO YUNG GINAWA KONG SUMMARY TABLE */}
          {
            tablecontent.tb_rows && 
            <TableWithFooter
            tableHead={TABLE_HEAD}
            tableRows={tablecontent.tb_rows}
            totalGHGEmissions={tablecontent.totalGHGe.toFixed(2)}
            totalProportion={tablecontent.totalProportion}
          />
          }
         
                 

    </div>
   )
}




export default GHGeSummary