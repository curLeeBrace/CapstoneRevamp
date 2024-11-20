import * as XLSX from "xlsx";

const exportToExcel = (data: any[], columns: string[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((row) => Object.fromEntries(columns.map((col, i) => [col, row[i]])))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default exportToExcel;
