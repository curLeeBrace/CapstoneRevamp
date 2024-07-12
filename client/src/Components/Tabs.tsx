import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
  } from "@material-tailwind/react";
   



  export type TabsProps = {
    data : {
        label : string;
        value : string;
        tabPanelChild : React.ReactNode
    }[]
  }



  export function TabsDefault({data} : TabsProps) {
 
    return (
      <Tabs value="s-data">
        <TabsHeader className="w-96 shadow-md mb-2 shadow-gray-400">
          {data.map(({ label, value }) => (
            <Tab key={value} value={value} className="z-0">
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="border-2 border-gray-300 rounded-lg mb-5 shadow-lg">
          {data.map(({ value, tabPanelChild }) => (
            <TabPanel key={value} value={value}>
              {tabPanelChild}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    );
  }