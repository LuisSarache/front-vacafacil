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

// Convert data to CSV format that Excel can open
const convertToCSV = (data) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = sanitizeValue(row[header] || '');
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value).replace(/"/g, '""');
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

export const exportToExcel = async (data, filename, sheetName = 'Dados') => {
  try {
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
    
    const csvContent = convertToCSV(sanitizedData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
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
    let combinedContent = '';
    
    for (const { data, name } of sheets) {
      if (data.length === 0) continue;
      
      // Security: Sanitize data
      const sanitizedData = data.map(row => {
        const sanitizedRow = {};
        Object.keys(row).forEach(key => {
          sanitizedRow[key] = sanitizeValue(row[key]);
        });
        return sanitizedRow;
      });
      
      combinedContent += `\n\n=== ${name} ===\n`;
      combinedContent += convertToCSV(sanitizedData);
    }
    
    const blob = new Blob([combinedContent], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
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