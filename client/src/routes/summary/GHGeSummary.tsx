import { TableWithFooter } from '../../Components/TableWithFooter';
const GHGeSummary = ()=>{


  const TABLE_HEAD = [
    "Emission Source",
    "GHG Emissions (tonnes CO2e)",
    "Proportion of Total Emissions"
  ];
  
  const TABLE_ROWS = [
    { name: "Scope 1 Emissions (Net of Forestry and Land Use)", ghge: "", proportion: "", isCategory: true },
    { name: "GHG Emissions from Community-Level Residential Stationary Fuel Use", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Community-Level Commercial Stationary Fuel Use", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Community Mobile Combustion", ghge: "0.01", proportion: "0.03%" },
    // { name: "GHG Emissions from Solid Waste Disposal - IPCC FOD Method", ghge: "0.00", proportion: "0.00%" },
    // { name: "GHG Emissions from Other Solid Waste Treatment (ICLEI)", ghge: "0.00", proportion: "0.00%" },
    // { name: "GHG Emissions from Solid Waste Open Burning (ICLEI)", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Wastewater Treatment and Discharge", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Community-Level Agriculture (Crops)", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Community-Level Agriculture (Livestock)", ghge: "0.00", proportion: "0.00%" },
    { name: "GHG Emissions from Industrial Processes and Product Use", ghge: "0.00", proportion: "0.00%" },
    
    // { name: "GHG Emissions from Solid Waste Disposal - Inside LGU Geopolitical Boundaries (ICLEI)", ghge: "0.00", proportion: "0.00%" },
    // { name: "Scope 1 Emissions/Removal (Forestry and Land Use)", ghge: "", proportion: "", isCategory: true },
    // { name: "GHG Emissions from Forestry and Land Use", ghge: "0.00", proportion: "0.00%" },
    // { name: "GHG Removal from Sink", ghge: "0.00", proportion: "0.00%" },
  ];

   return (
    <div className='p-2 mt-2'>
        
                 {/* ETO YUNG GINAWA KONG SUMMARY TABLE */}

          <TableWithFooter
            tableHead={TABLE_HEAD}
            tableRows={TABLE_ROWS}
            totalGHGEmissions={"0"}
            totalProportion={"100.00%"}
          />
                 

    </div>
   )
}




export default GHGeSummary