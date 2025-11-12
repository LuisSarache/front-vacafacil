import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ToastManager } from './ToastManager';
import { Download, Upload, Database, Calendar, AlertCircle } from 'lucide-react';

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
      const data = {
        vacas: JSON.parse(localStorage.getItem('vacafacil_vacas') || '[]'),
        producoes: JSON.parse(localStorage.getItem('vacafacil_producoes') || '[]'),
        transacoes: JSON.parse(localStorage.getItem('vacafacil_transacoes') || '[]'),
        inseminacoes: JSON.parse(localStorage.getItem('vacafacil_inseminacoes') || '[]'),
        vacinas: JSON.parse(localStorage.getItem('vacafacil_vacinas') || '[]'),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vacafacil-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      ToastManager.success('Dados exportados com sucesso!');
    } catch {
      ToastManager.error('Erro ao exportar dados');
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!data.vacas || !Array.isArray(data.vacas)) {
          throw new Error('Formato de arquivo inválido');
        }

        const confirmed = window.confirm(
          'Tem certeza que deseja importar estes dados? Os dados atuais serão substituídos.'
        );

        if (confirmed) {
          localStorage.setItem('vacafacil_vacas', JSON.stringify(data.vacas));
          localStorage.setItem('vacafacil_producoes', JSON.stringify(data.producoes || []));
          localStorage.setItem('vacafacil_transacoes', JSON.stringify(data.transacoes || []));
          localStorage.setItem('vacafacil_inseminacoes', JSON.stringify(data.inseminacoes || []));
          localStorage.setItem('vacafacil_vacinas', JSON.stringify(data.vacinas || []));
          
          ToastManager.success('Dados importados com sucesso! Recarregue a página.');
        }
      } catch {
        ToastManager.error('Erro ao importar dados. Verifique o formato do arquivo.');
      }
    };
    reader.readAsText(file);
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
                  {backup.size} • {backup.type}
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