import ExcelJS from 'exceljs';

// Security: Sanitize data to prevent injection
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Remove potential formula injection
    if (value.startsWith('=') || value.startsWith('+') || value.startsWith('-') || value.startsWith('@')) {
      return `'${value}`; // Prefix with quote to treat as text
    }
    return value.substring(0, 1000); // Limit length
  }
  return value;
};

export const exportToExcel = async (data, filename, sheetName = 'Dados') => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    
    if (data.length === 0) {
      throw new Error('Nenhum dado para exportar');
    }
    
    // Security: Sanitize data
    const sanitizedData = data.map(row => {
      const sanitizedRow = {};
      Object.keys(row).forEach(key => {
        sanitizedRow[key] = sanitizeValue(row[key]);
      });
      return sanitizedRow;
    });
    
    // Add headers
    const headers = Object.keys(sanitizedData[0]);
    worksheet.addRow(headers);
    
    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add data rows
    sanitizedData.forEach(row => {
      const values = headers.map(header => row[header]);
      worksheet.addRow(values);
    });
    
    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(column.width || 0, 15);
    });
    
    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return false;
  }
};

export const exportMultipleSheets = async (sheets, filename) => {
  try {
    const workbook = new ExcelJS.Workbook();
    
    for (const { data, name } of sheets) {
      if (data.length === 0) continue;
      
      const worksheet = workbook.addWorksheet(name);
      
      // Security: Sanitize data
      const sanitizedData = data.map(row => {
        const sanitizedRow = {};
        Object.keys(row).forEach(key => {
          sanitizedRow[key] = sanitizeValue(row[key]);
        });
        return sanitizedRow;
      });
      
      // Add headers
      const headers = Object.keys(sanitizedData[0]);
      worksheet.addRow(headers);
      
      // Style headers
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      // Add data rows
      sanitizedData.forEach(row => {
        const values = headers.map(header => row[header]);
        worksheet.addRow(values);
      });
      
      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = Math.max(column.width || 0, 15);
      });
    }
    
    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return false;
  }
};