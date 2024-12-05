import { saveAs } from 'file-saver'; 
import ExcelJS from 'exceljs';

interface TableRow {
  name: string;
  ghge: string | number;
  proportion: string | number;
  isCategory?: boolean;
}

/**
 *
 * @param data - Array of data rows to be exported.
 * @param columns - Array of column keys corresponding to TableRow properties.
 * @param tableHead - Array of header titles for the Excel table.
 * @param totalGHGEmissions - Total Scope 1 Emissions value.
 * @param totalProportion - Total Proportion value.
 * @param fileName - Desired name for the exported Excel file.
 */
const exportGhge = async (
  data: TableRow[],
  columns: string[],
  tableHead: string[],
  totalGHGEmissions: string | number,
  totalProportion: string | number,
  fileName: string
) => {
  try {
    const templateUrl = '/src/assets/GhgeSummary.xlsx'; 

    const response = await fetch(templateUrl);
    if (!response.ok) {
      throw new Error('Failed to load the Excel template.');
    }
    const arrayBuffer = await response.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.worksheets[0];
    const headerRowNumber = 2; 
    const dataStartRow = headerRowNumber + 1;

    const headerRow = worksheet.getRow(headerRowNumber);
    if (headerRow) { 
      tableHead.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        if (cell) { 
          cell.value = header;

          cell.font = { bold: false };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEEEEEE' }, 
          };
        }
      });
      headerRow.commit?.();
    } else {
      console.error('Header row is undefined');
    }

    data.forEach((rowData, rowIndex) => {
      const rowNumber = dataStartRow + rowIndex;
      const row = worksheet.getRow(rowNumber);
      if (row) { 
        columns.forEach((col, colIndex) => {
          const cell = row.getCell(colIndex + 1);
          if (cell) { 
            let value = rowData[col as keyof TableRow];

            if (col.toLowerCase() === 'proportion' && typeof value === 'number') {
              value = `${value}%`;
            }

            cell.value = value;

            const headerCell = worksheet.getCell(headerRowNumber, colIndex + 1);
            if (headerCell && headerCell.style) {
              cell.style = { ...headerCell.style };
            }

            if (rowData.isCategory) {
              cell.font = { ...cell.font, bold: true };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCCCCC' }, 
              };
            }
          }
        });
        row.commit?.();
      } else {
        console.error(`Row ${rowNumber} is undefined`);
      }
    });

    const footerRowNumber = dataStartRow + data.length;
    const footerRow = worksheet.getRow(footerRowNumber);
    if (footerRow) { 
      const footerData = [
        'Total Scope 1 Emissions',
        totalGHGEmissions,
        `${totalProportion}%`,
      ];

      footerData.forEach((footerCell, footerColIndex) => {
        const cell = footerRow.getCell(footerColIndex + 1);
        if (cell) { 
          cell.value = footerCell;

          const headerCell = worksheet.getCell(headerRowNumber, footerColIndex + 1);
          if (headerCell && headerCell.style) {
            cell.style = { ...headerCell.style };
          }

          cell.font = { ...cell.font, bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '538DD5' },
          };
        }
      });
      footerRow.commit?.();
    } else {
      console.error('Footer row is undefined');
    }

    
    worksheet.eachRow((row) => {
      row.eachCell((cell, columnIndex) => {
        cell.alignment = { wrapText: true }; 

        if (columnIndex === 1) {
          cell.alignment = { horizontal: 'left', wrapText: true };
        } else if (columnIndex === 2 || columnIndex === 3) {
          cell.alignment = { horizontal: 'center', wrapText: true };
        }
      });
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 10;  // Starting with a base width
    
      const columnNumber = column.number ?? 1;  
    
   
      worksheet.eachRow((row) => {
        const cell = row.getCell(columnNumber);  
        const cellValue = cell.value ? cell.value.toString() : ''; 
        maxLength = Math.max(maxLength, cellValue.length + 2);  
      });
    
      column.width = maxLength;
    });
    
    


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting GHGe data:', error);
  }
};

export default exportGhge;
