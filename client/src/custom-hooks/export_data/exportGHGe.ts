import * as XLSX from "xlsx";

const exportGhge = (
  data: any[],
  columns: string[],
  tableHead: string[],
  totalGHGEmissions: string,
  totalProportion: string,
  fileName: string
) => {
  const worksheet = XLSX.utils.aoa_to_sheet([tableHead]); 

  const rowData = data.map((row) => columns.map((col) => row[col]));
  XLSX.utils.sheet_add_aoa(worksheet, rowData, { origin: -1 }); 

  const footerData = [
    [
      "Total Scope 1 Emissions",
      totalGHGEmissions,
      totalProportion + "%",
    ],
  ];

  const startRowIndex = data.length + 2; 
  XLSX.utils.sheet_add_aoa(worksheet, footerData, { origin: startRowIndex });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default exportGhge;
