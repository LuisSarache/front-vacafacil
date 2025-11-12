import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename, sheetName = 'Dados') => {
  try {
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Converter dados para worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Salvar arquivo
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return false;
  }
};

export const exportMultipleSheets = (sheets, filename) => {
  try {
    const wb = XLSX.utils.book_new();
    
    sheets.forEach(({ data, name }) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, name);
    });
    
    XLSX.writeFile(wb, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return false;
  }
};