import { useEffect, useState } from "react";
import SimpleCard from "../../Components/Dashboard/SimpleCard";

import { UserIcon, GlobeAsiaAustraliaIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Carousel } from "@material-tailwind/react";


import Chart from "react-apexcharts";
import SurveyorInfo from "../../Components/Dashboard/SuerveyorInfo";
// import DashboardGHGeSummary from '../../Components/Dashboard/DashboardGHGeSummary';
import useAxiosPrivate from "../../custom-hooks/auth_hooks/useAxiosPrivate";
import useUserInfo from "../../custom-hooks/useUserType";
import { Typography } from "@material-tailwind/react";
import BarChart from "../../Components/Dashboard/BarChart";
// import { TableWithFooter } from '../../Components/TableWithFooter';
// import FilterSummary from './FilterSummary';
// import { AddressReturnDataType } from '../../custom-hooks/useFilterAddrress';

type Emission = {
  co2e: number;
  ch4e: number;
  n2oe: number;
  ghge: number;
};

export type MobileCombustionTableData = {
  loc_name: String;
  emission: Emission;
};

type DashBoardData = {
  mobileCombustionGHGe: number;
  total_surveryor: number;
  total_LU_surveyors: number;
  total_LGU_admins: number;
  total_LU_admins: number;
  table_data: {
    mobileCombustionGHGe: MobileCombustionTableData[];
    wasteWaterGHGe: {
      ghge: number;
      loc_name: string;
    }[];
    industrialGHGe: {
      ghge: number;
      loc_name: string;
    }[];
    agriculture_cropsGHGe: {
      ghge: number;
      loc_name: string;
    }[];
    agriculture_liveStocksGHGe: {
      ghge: number;
      loc_name: string;
    }[];
    // stationaryGHGe : number[],
    residentialGHGe: {
      ghge: number;
      loc_name: string;
    }[];
    commercialGHGe: {
      ghge: number;
      loc_name: string;
    }[];

    forestLandUseGHGe: {
      ghge: number;
      loc_name: string;
    }[];
  };
  total_ghge: number;
};




function DashBoard() {
  const [dashboard_data, setDashBoardData] = useState<DashBoardData>();
  const [isLoading, setisLoading] = useState<boolean>(true);
  const axiosPrivate = useAxiosPrivate();
  const user_info = useUserInfo();
  const [fontSize, setFontSize] = useState(13);
  const increaseFontSize = () => setFontSize((prev) => prev + 1);
  const decreaseFontSize = () =>
    setFontSize((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    axiosPrivate
      .get(
        `/dashboard/overview-data/${user_info.province_code}/${user_info.user_type}/${user_info.municipality_code}`
      )
      .then((res) => {
        setDashBoardData(res.data);
        setisLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const chartConfig = {
    series: [
      {
        name: "Mobile-Combustion GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.mobileCombustionGHGe
              .map((tb_data) => {
                if (user_info.user_type === "lu_admin") {
                  return tb_data.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: tb_data.emission.ghge.toFixed(2),
                      }
                    : null;
                }

                if (user_info.user_type !== "lu_admin" && tb_data.loc_name) {
                  return {
                    x: tb_data.loc_name,
                    y: tb_data.emission.ghge.toFixed(2),
                  };
                }
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },

      {
        name: "Waste-Water GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.wasteWaterGHGe
              .map((wasteWaterData, index) => {
                if (user_info.user_type === "lu_admin") {
                  return wasteWaterData.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: dashboard_data.table_data.wasteWaterGHGe[
                          index
                        ].ghge.toFixed(2),
                      }
                    : null;
                }
                if (user_info.user_type !== "lu_admin") {
                  return {
                    x: wasteWaterData.loc_name,
                    y: dashboard_data.table_data.wasteWaterGHGe[
                      index
                    ].ghge.toFixed(2),
                  };
                }

                // return null;
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },

      {
        name: "Industrial GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.industrialGHGe
              .map((industrialData) => {
                if (user_info.user_type === "lu_admin") {
                  return industrialData.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: industrialData.ghge.toFixed(2),
                      }
                    : null;
                }

                if (user_info.user_type !== "lu_admin") {
                  return {
                    x: industrialData.loc_name,
                    y: industrialData.ghge.toFixed(2),
                  };
                }
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },
      {
        name: "AgricultureCrops GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.agriculture_cropsGHGe
              .map((agriculture_cropsData) => {
                if (user_info.user_type === "lu_admin") {
                  return agriculture_cropsData.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: agriculture_cropsData.ghge.toFixed(2),
                      }
                    : null;
                }

                if (user_info.user_type !== "lu_admin") {
                  return {
                    x: agriculture_cropsData.loc_name,
                    y: agriculture_cropsData.ghge.toFixed(2),
                  };
                }
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },
      {
        name: "AgricultureLiveStocks GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.agriculture_liveStocksGHGe
              .map((agriculture_livestockData) => {
                if (user_info.user_type === "lu_admin") {
                  return agriculture_livestockData.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: agriculture_livestockData.ghge.toFixed(2),
                      }
                    : null;
                }

                if (user_info.user_type !== "lu_admin") {
                  return {
                    x: agriculture_livestockData.loc_name,
                    y: agriculture_livestockData.ghge.toFixed(2),
                  };
                }
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },

      {
        name: "Stationary Residential GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.residentialGHGe
              .map((stationaryResData) => {
                if (user_info.user_type === "lu_admin") {
                  return stationaryResData.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: stationaryResData.ghge.toFixed(2),
                      }
                    : null;
                }

                if (user_info.user_type !== "lu_admin") {
                  return {
                    x: stationaryResData.loc_name,
                    y: stationaryResData.ghge.toFixed(2),
                  };
                }
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },

      {
        name: "Stationary Commercial GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.commercialGHGe
              .map((stationaryCommData) => {
                if (user_info.user_type === "lu_admin") {
                  return stationaryCommData.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: stationaryCommData.ghge.toFixed(2),
                      }
                    : null;
                }
                if (user_info.user_type !== "lu_admin") {
                  return {
                    x: stationaryCommData.loc_name,
                    y: stationaryCommData.ghge.toFixed(2),
                  };
                }
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },
      {
        name: "Forest And Land Use GHGe",
        data: dashboard_data
          ? dashboard_data.table_data.forestLandUseGHGe
              .map((forestLandUseData) => {
                if (user_info.user_type === "lu_admin") {
                  return forestLandUseData.loc_name === "Bubukal"
                    ? {
                        x: "Laguna University",
                        y: forestLandUseData.ghge.toFixed(2),
                      }
                    : null;
                }
                if (user_info.user_type !== "lu_admin") {
                  return {
                    x: forestLandUseData.loc_name,
                    y: forestLandUseData.ghge.toFixed(2),
                  };
                }
              })
              .filter((data) => data !== null)
              .sort((a: any, b: any) => a.x.localeCompare(b.x))
          : [{ x: null, y: null }],
      },
    ],
    options: {
      chart: {
        background: "white",
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
                title: "Increase Font Size",
                class: "custom-icon",
                click: function () {
                  increaseFontSize(); // Action on click
                },
              },
              {
                icon: `<div style="font-size: 16px; margin-left: 10px; cursor: pointer;">A-</div>`, // HTML for the button
                index: 1,
                title: "Decrease Font Size",
                class: "custom-icon",
                click: function () {
                  decreaseFontSize(); // Action on click
                },
              },
            ],
          },
        },
        foreColor: "#101010",
      },
      colors: [
        "#248003",
        "#2942b3",
        "#f58142",
        "#fcba03",
        "#151B54",
        "#800000",
        "#A52A2A",
        "#00FF00",
      ],
      plotOptions: {
        bar: {
          columnWidth: "90%",
          barHeight: "100%",
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "10px", // Adjust the font size here
          fontWeight: "bold",
          colors: ["#fff"],
        },
        offsetY: 0,
      },

      title: {
        text:
          user_info.user_type === "lu_admin"
            ? "Total GHGe in Laguna University"
            : user_info.user_type === "s-admin"
            ? "Total GHGe per Municipality (Laguna Province)"
            : user_info.user_type === "lgu_admin"
            ? `Total GHGe per Brgy. (${user_info.municipality_name})`
            : "Total GHGe per Brgy.",
        align: "center" as "center",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
          color: "#333",
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: `${fontSize}px`,
          },
          padding: {
            left: 20,
            right: 20,
          },
        },
      },
    },
  };

  const lu_img = "/img/lu.jpg";

  return (
    <div className="h-full w-full bg-gray-200 ">
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center gap-3 basis-1/4 px-2 overflow-x-auto mx-6 my-4 pb-2">
          <div className="h-4/5 w-full">
            <SimpleCard
              body={`${dashboard_data?.total_ghge.toFixed(2)}`}
              header={
                user_info.user_type === "lu_admin"
                  ? "Total LU GHGe"
                  : "Total GHGe"
              }
              icon={
                user_info.user_type === "lu_admin" ? (
                  <img src={lu_img} className="h-6 w-6 rounded-lg" />
                ) : (
                  <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                )
              }
              isLoading={isLoading}
            />{" "}
            {/*child_card={<DashboardGHGeSummary/>} */}
          </div>

          <div className="h-4/5 w-full">
            <SimpleCard
              body={
                user_info.user_type === "lu_admin"
                  ? `${dashboard_data?.total_LU_surveyors}`
                  : user_info.user_type === "s-admin"
                  ? `${
                      (dashboard_data?.total_LU_surveyors || 0) +
                      (dashboard_data?.total_surveryor || 0)
                    }`
                  : `${dashboard_data?.total_surveryor}`
              }
              header={
                user_info.user_type === "lu_admin"
                  ? "Total LU Surveyor"
                  : "Total Surveyor"
              }
              icon={
                user_info.user_type === "lu_admin" ? (
                  <img src={lu_img} className="h-6 w-6 rounded-lg" />
                ) : (
                  <UserIcon className="h-6 w-6" />
                )
              }
              child_card={<SurveyorInfo />}
              isLoading={isLoading}
            />
          </div>
          <div className="h-4/5 w-full">
            <SimpleCard
              body={
                user_info.user_type === "lu_admin"
                  ? `${dashboard_data?.total_LU_admins}`
                  : user_info.user_type === "s-admin"
                  ? `${
                      (dashboard_data?.total_LU_admins || 0) +
                      (dashboard_data?.total_LGU_admins || 0)
                    }`
                  : `${dashboard_data?.total_LGU_admins}`
              }
              header={
                user_info.user_type === "lu_admin"
                  ? "Total LU Admin"
                  : "Total LGU Admin"
              }
              icon={
                user_info.user_type === "lu_admin" ? (
                  <img src={lu_img} className="h-6 w-6" />
                ) : (
                  <UserIcon className="h-6 w-6" />
                )
              }
              isLoading={isLoading}
            />
          </div>
        </div>

        
        <div className="flex h-full flex-wrap md:flex-nowrap px-8">
          <div className=" md:w-1/4 w-full  text-xs bg-white  rounded-lg shadow-md flex flex-col gap-1">
          <Typography
              className="bg-darkgreen font-bold text-base  rounded-lg py-2  text-center"
              color="white"
            >
              Green House Gas Emission (Charts)
          </Typography>
            <Carousel nextArrow={({ loop, handleNext, lastIndex }) => (
                <button
                  onClick={handleNext}
                  disabled={!loop && lastIndex}
                  className="!absolute top-2/4 right-4 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-white hover:bg-white/10 active:bg-white/30 grid place-items-center"
                >
                  <ChevronRightIcon strokeWidth={3} className="ml-8 h-7 w-7 text-green-400" />
                </button>
              )}

                prevArrow={ ({ loop, handlePrev, firstIndex }) => {
                  return (
                    <button
                      onClick={handlePrev}
                      disabled={!loop && firstIndex}
                      className="!absolute top-2/4 left-4 -translate-y-2/4 rounded-full select-none transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-12 max-w-[48px] h-12 max-h-[48px] text-white hover:bg-white/10 active:bg-white/30 grid place-items-center"
                    >
                      <ChevronLeftIcon strokeWidth={3} className="-ml-8 h-7 w-7 text-green-400" />
                    </button>
                  )}}

              navigation={ ({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                  {new Array(length).fill("").map((_, i) => (
                    <span
                      key={i}
                      className={`block h-3 w-3 cursor-pointer rounded-full transition-colors content-[''] ${
                        activeIndex === i ? "bg-green-400" : "bg-green-400/50"
                      }`}
                      onClick={() => setActiveIndex(i)}
                    />
                  ))}
                </div>
              )}

            
            >
              <div className="flex flex-col gap-2 mx-4 justify-around ">
                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.mobileCombustionGHGe
                      .reduce((acc, val) => acc + val.emission.ghge, 0)
                      .toFixed(2)}`}
                    header="Mobile Combustion"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Mobile Combustion"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[0] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>

                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.wasteWaterGHGe
                      .reduce((acc, val) => acc + val.ghge, 0)
                      .toFixed(2)}`}
                    header="Waste Water"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Waste Water"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[1] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>
                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.industrialGHGe
                      .reduce((acc, val) => acc + val.ghge, 0)
                      .toFixed(2)}`}
                    header="Industrial"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Industrial"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[2] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>
                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.agriculture_cropsGHGe
                      .reduce((acc, val) => acc + val.ghge, 0)
                      .toFixed(2)}`}
                    header="Agriculture Crops"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Agriculture Crops"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[3] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mx-4 justify-around">
                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.agriculture_liveStocksGHGe
                      .reduce((acc, val) => acc + val.ghge, 0)
                      .toFixed(2)}`}
                    header="Agriculture Live Stocks"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Agriculture Live Stocks"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[4] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>

                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.residentialGHGe
                      ?.reduce((acc, val) => acc + val.ghge, 0)
                      .toFixed(2)}`}
                    header="Stationary (Residential)"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Stationary Fuel Use (Residential)"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[5] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>
                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.commercialGHGe
                      ?.reduce((acc, val) => acc + val.ghge, 0)
                      .toFixed(2)}`}
                    header="Stationary (Commercial)"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Stationary Fuel Use (Commercial)"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[6] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>
                <div className="">
                  <SimpleCard
                    body={`${dashboard_data?.table_data.forestLandUseGHGe
                      ?.reduce((acc, val) => acc + val.ghge, 0)
                      .toFixed(2)}`}
                    header="Forest And Land Use"
                    icon={<GlobeAsiaAustraliaIcon className="h-6 w-6" />}
                    child_card={
                      <BarChart
                        chart_icon={
                          <GlobeAsiaAustraliaIcon className="h-6 w-6" />
                        }
                        chart_label="Forest And Land Use"
                        chart_meaning={
                          user_info.user_type === "s-admin"
                            ? "GHGe per Municipality in Laguna."
                            : user_info.user_type === "lu_admin"
                            ? "GHGe in Laguna University."
                            : `GHGe per Brgy in ${user_info.municipality_name}.`
                        }
                        series={[chartConfig.series[7] as any]}
                        isLoading={isLoading}
                      />
                    }
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </Carousel>
          </div>

          <div className="md:w-4/5 w-full border border-gray-400 bg-white shadow-gray-500 rounded-lg px-4 py-4 h-[500px]">
            {chartConfig ? (
              <Chart
                width={"100%"}
                height={"100%"}
                type={"bar"}
                series={chartConfig.series as any}
                options={chartConfig.options}
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap px-5 basis-3/4 gap-3 h-1/3 w-full">
          {/* lg:basis-8/12 */}
        </div>

        {/* <div className='grid grid-cols-1 grid-rows-3 gap-3'>

              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>
              <LineChart chart_icon ={<Square3Stack3DIcon className="h-6 w-6"/>} chart_label='insert label' chart_meaning='insert meaning'/>

          </div> */}
      </div>
    </div>
  );
}

export default DashBoard;
