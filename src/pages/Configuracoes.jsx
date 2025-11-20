import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastManager } from '../components/ToastManager';
import { DataBackup } from '../components/DataBackup';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Save, User, Bell, DollarSign, Wifi, Shield, Moon, Sun } from 'lucide-react';

export const Configuracoes = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Perfil
    nomeFazenda: user?.fazenda || '',
    proprietario: user?.nome || user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || user?.phone || '',
    
    // Preços
    precoLeite: 2.50,
    precoRacao: 1.80,
    
    // Notificações
    alertasVacina: true,
    alertasSecagem: true,
    alertasPrenhez: true,
    emailNotificacoes: true,
    
    // Sistema
    backupAutomatico: true,
    sincronizacaoNuvem: false
  });

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      ToastManager.success('Configurações salvas com sucesso!');
    } catch {
      ToastManager.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'precos', label: 'Preços', icon: DollarSign },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Shield },
    { id: 'sistema', label: 'Sistema', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Configurações</h1>
          <p className="text-medium/70 mt-1">Personalize as configurações do sistema</p>
        </div>
        <Button onClick={handleSave} loading={loading} className="flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-medium/20">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-dark'
                  : 'border-transparent text-medium/70 hover:text-dark hover:border-medium/30'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'perfil' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações da Fazenda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Fazenda
              </label>
              <Input
                value={settings.nomeFazenda}
                onChange={(e) => handleInputChange('nomeFazenda', e.target.value)}
                placeholder="Nome da fazenda"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proprietário
              </label>
              <Input
                value={settings.proprietario}
                onChange={(e) => handleInputChange('proprietario', e.target.value)}
                placeholder="Nome do proprietário"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <Input
                value={settings.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'precos' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuração de Preços</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço do Leite (R$/litro)
              </label>
              <Input
                type="number"
                step="0.01"
                value={settings.precoLeite}
                onChange={(e) => handleInputChange('precoLeite', parseFloat(e.target.value))}
                placeholder="2.50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usado para calcular receitas automáticas
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço da Ração (R$/kg)
              </label>
              <Input
                type="number"
                step="0.01"
                value={settings.precoRacao}
                onChange={(e) => handleInputChange('precoRacao', parseFloat(e.target.value))}
                placeholder="1.80"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usado para calcular custos de alimentação
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Integração com Cooperativas</h4>
            <p className="text-sm text-blue-700 mb-3">
              Configure a integração com sua cooperativa para atualização automática de preços.
            </p>
            <Button variant="outline" size="sm">
              Configurar Integração
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'notificacoes' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferências de Notificação</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Alertas do Sistema</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.alertasVacina}
                    onChange={(e) => handleInputChange('alertasVacina', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Alertas de vacinação
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.alertasSecagem}
                    onChange={(e) => handleInputChange('alertasSecagem', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Alertas de secagem
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.alertasPrenhez}
                    onChange={(e) => handleInputChange('alertasPrenhez', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Alertas de prenhez e parto
                  </span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Canais de Notificação</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.emailNotificacoes}
                    onChange={(e) => handleInputChange('emailNotificacoes', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Notificações por e-mail
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'backup' && (
        <DataBackup />
      )}

      {activeTab === 'sistema' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Sistema</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Aparência</h4>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    {isDark ? (
                      <Moon className="w-5 h-5 text-blue-600 mr-3" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-600 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Modo {isDark ? 'Escuro' : 'Claro'}</p>
                      <p className="text-sm text-gray-500">Alterne entre tema claro e escuro</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDark}
                      onChange={toggleTheme}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Backup e Sincronização</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backupAutomatico}
                      onChange={(e) => handleInputChange('backupAutomatico', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Backup automático diário
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.sincronizacaoNuvem}
                      onChange={(e) => handleInputChange('sincronizacaoNuvem', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Sincronização com a nuvem
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integração IoT</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Wifi className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Sensores de Ordenha</p>
                  <p className="text-sm text-gray-500">Conecte sensores para registro automático</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuários e Permissões</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">João Silva</p>
                  <p className="text-sm text-gray-500">Administrador</p>
                </div>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </div>
            <Button variant="outline" className="mt-4">
              <User className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};