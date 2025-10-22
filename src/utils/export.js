export const exportToCSV = (data, filename = 'export.csv') => {
  try {
    if (!data || data.length === 0) {
      throw new Error('Nenhum dado para exportar');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    throw error;
  }
};

export const exportToJSON = (data, filename = 'export.json') => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao exportar JSON:', error);
    throw error;
  }
};

export const printTable = (elementId) => {
  try {
    const printContent = document.getElementById(elementId);
    if (!printContent) {
      throw new Error('Elemento não encontrado');
    }

    const windowPrint = window.open('', '', 'width=800,height=600');
    if (!windowPrint) {
      throw new Error('Não foi possível abrir janela de impressão');
    }
    
    windowPrint.document.write('<html><head><title>Imprimir</title>');
    windowPrint.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }</style>');
    windowPrint.document.write('</head><body>');
    windowPrint.document.write(printContent.innerHTML);
    windowPrint.document.write('</body></html>');
    windowPrint.document.close();
    windowPrint.print();
  } catch (error) {
    console.error('Erro ao imprimir:', error);
    throw error;
  }
};
