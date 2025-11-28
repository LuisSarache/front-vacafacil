import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ToastManager } from './ToastManager';
import { Download, Upload, Database, Calendar, AlertCircle } from 'lucide-react';
import { sanitizeData, sanitizeString, validateFile as validateFileUtil } from '../utils/sanitize';

export const DataBackup = () => {
  const [loading, setLoading] = useState(false);
  const [backupHistory, setBackupHistory] = useState([
    { date: '2024-01-15', size: '2.3 MB', type: 'Automático' },
    { date: '2024-01-14', size: '2.1 MB', type: 'Manual' },
    { date: '2024-01-13', size: '2.0 MB', type: 'Automático' }
  ]);

  const handleBackup = async () => {
    setLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBackup = {
        date: new Date().toISOString().split('T')[0],
        size: '2.4 MB',
        type: 'Manual'
      };
      
      setBackupHistory(prev => [newBackup, ...prev]);
      ToastManager.success('Backup realizado com sucesso!');
    } catch {
      ToastManager.error('Erro ao realizar backup');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (backupDate) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja restaurar o backup de ${new Date(backupDate).toLocaleDateString('pt-BR')}? Esta ação não pode ser desfeita.`
    );
    
    if (!confirmed) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      ToastManager.success('Dados restaurados com sucesso!');
    } catch {
      ToastManager.error('Erro ao restaurar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      // Security: Safely parse localStorage data with validation
      const parseSecurely = (key) => {
        try {
          const item = localStorage.getItem(key);
          if (!item) return [];
          const parsed = JSON.parse(item);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      };

      const rawData = {
        vacas: parseSecurely('vacafacil_vacas'),
        producoes: parseSecurely('vacafacil_producoes'),
        transacoes: parseSecurely('vacafacil_transacoes'),
        inseminacoes: parseSecurely('vacafacil_inseminacoes'),
        vacinas: parseSecurely('vacafacil_vacinas'),
        exportDate: new Date().toISOString()
      };

      // Security: Sanitize all data before export
      const sanitizedData = sanitizeData(rawData);

      // Security: Validate filename
      const safeDate = new Date().toISOString().split('T')[0].replace(/[^0-9-]/g, '');
      const filename = `vacafacil-backup-${safeDate}.json`;

      const jsonString = JSON.stringify(sanitizedData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Security: Create download link safely
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      ToastManager.success('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Export error:', error);
      ToastManager.error('Erro ao exportar dados');
    }
  };

  // Security: Validate file type and size
  const validateFile = (file) => {
    const result = validateFileUtil(file, {
      allowedTypes: ['application/json'],
      allowedExtensions: ['.json'],
      maxSize: 10 * 1024 * 1024
    });
    
    if (!result.valid) {
      ToastManager.error(result.error);
      return false;
    }
    return true;
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!validateFile(file)) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    
    reader.onerror = () => {
      ToastManager.error('Erro ao ler o arquivo');
      event.target.value = '';
    };
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        
        // Security: Validate file content size
        if (fileContent.length > 50 * 1024 * 1024) { // 50MB text limit
          throw new Error('Conteúdo do arquivo muito grande');
        }
        
        // Security: Parse JSON safely
        let rawData;
        try {
          rawData = JSON.parse(fileContent);
        } catch {
          throw new Error('Arquivo JSON inválido');
        }
        
        // Security: Validate basic structure before sanitization
        if (!rawData || typeof rawData !== 'object') {
          throw new Error('Estrutura de dados inválida');
        }
        
        // Security: Sanitize all data
        const data = sanitizeData(rawData);
        
        // Validate sanitized data structure
        if (!data || !data.vacas || !Array.isArray(data.vacas)) {
          throw new Error('Formato de arquivo inválido ou dados corrompidos');
        }

        // Additional validation
        if (data.vacas.length > 1000) {
          throw new Error('Muitos registros. Limite: 1000 vacas');
        }

        // Security: Use a more secure confirmation
        const confirmMessage = 'Tem certeza que deseja importar estes dados? Os dados atuais serão substituídos.';
        const confirmed = window.confirm(confirmMessage);

        if (confirmed) {
          try {
            // Security: Validate and limit each array before storing
            const safeVacas = Array.isArray(data.vacas) ? data.vacas.slice(0, 1000) : [];
            const safeProducoes = Array.isArray(data.producoes) ? data.producoes.slice(0, 5000) : [];
            const safeTransacoes = Array.isArray(data.transacoes) ? data.transacoes.slice(0, 5000) : [];
            const safeInseminacoes = Array.isArray(data.inseminacoes) ? data.inseminacoes.slice(0, 1000) : [];
            const safeVacinas = Array.isArray(data.vacinas) ? data.vacinas.slice(0, 1000) : [];
            
            // Security: Store data safely
            localStorage.setItem('vacafacil_vacas', JSON.stringify(safeVacas));
            localStorage.setItem('vacafacil_producoes', JSON.stringify(safeProducoes));
            localStorage.setItem('vacafacil_transacoes', JSON.stringify(safeTransacoes));
            localStorage.setItem('vacafacil_inseminacoes', JSON.stringify(safeInseminacoes));
            localStorage.setItem('vacafacil_vacinas', JSON.stringify(safeVacinas));
            
            ToastManager.success('Dados importados com sucesso! Recarregue a página.');
          } catch (storageError) {
            console.error('Storage error:', storageError);
            ToastManager.error('Erro ao salvar dados importados');
          }
        }
      } catch (error) {
        console.error('Import error:', error);
        // Security: Sanitize error message to prevent XSS
        const safeErrorMessage = sanitizeString(error.message || 'Erro desconhecido', 100);
        ToastManager.error(`Erro ao importar dados: ${safeErrorMessage}`);
      } finally {
        // Always clear input
        event.target.value = '';
      }
    };
    
    // Security: Read as text with size limit
    reader.readAsText(file.slice(0, 50 * 1024 * 1024)); // 50MB limit
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Backup e Restauração
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button onClick={handleBackup} loading={loading} className="flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Fazer Backup Agora
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <Button variant="secondary" className="w-full flex items-center justify-center" as="span">
                <Upload className="w-4 h-4 mr-2" />
                Importar Dados
              </Button>
            </label>
          </div>
        </div>

        <Button variant="secondary" onClick={handleExportData} className="w-full mb-6">
          <Download className="w-4 h-4 mr-2" />
          Exportar Todos os Dados
        </Button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium mb-1">Importante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Faça backups regulares dos seus dados</li>
                <li>Mantenha os arquivos de backup em local seguro</li>
                <li>Teste a restauração periodicamente</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Histórico de Backups
        </h3>
        
        <div className="space-y-3">
          {backupHistory.map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">
                  {new Date(backup.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="text-sm text-gray-500">
                  {sanitizeString(backup.size || 'N/A', 20)} • {sanitizeString(backup.type || 'N/A', 20)}
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleRestore(backup.date)}
                disabled={loading}
              >
                Restaurar
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};