import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToastManager } from '../components/ToastManager';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Search, Plus, Filter, Eye, Edit, Trash2, Download, Upload } from 'lucide-react';

export const Rebanho = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [loading, setLoading] = useState(false);
  const [selectedVacas, setSelectedVacas] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, vacaId: null, vacaNome: '' });

  const vacas = [
    { id: 1, numero: '001', nome: 'Mimosa', raca: 'Holandesa', nascimento: '2020-03-15', status: 'lactacao', producaoMedia: 25 },
    { id: 2, numero: '002', nome: 'Estrela', raca: 'Jersey', nascimento: '2019-08-22', status: 'seca', producaoMedia: 18 },
    { id: 3, numero: '003', nome: 'Bonita', raca: 'Holandesa', nascimento: '2021-01-10', status: 'prenha', producaoMedia: 22 },
    { id: 4, numero: '004', nome: 'Flor', raca: 'Gir', nascimento: '2020-11-05', status: 'lactacao', producaoMedia: 20 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'lactacao': return 'bg-green-100 text-green-800';
      case 'seca': return 'bg-yellow-100 text-yellow-800';
      case 'prenha': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'lactacao': return 'Lactação';
      case 'seca': return 'Seca';
      case 'prenha': return 'Prenha';
      default: return status;
    }
  };

  const filteredVacas = vacas.filter(vaca => {
    const matchesSearch = vaca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vaca.numero.includes(searchTerm);
    const matchesFilter = filterStatus === 'todos' || vaca.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Gestão do Rebanho</h1>
          <p className="text-medium/70 mt-1">Gerencie todas as informações do seu rebanho</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button variant="secondary" size="sm" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="flex items-center" onClick={() => navigate('/rebanho/novo')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Vaca
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="glassmorphism p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium/50 w-4 h-4 pointer-events-none z-10" />
            <Input
              placeholder="Buscar por nome ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-white text-dark"
            >
              <option value="todos">Todos os Status</option>
              <option value="lactacao">Lactação</option>
              <option value="seca">Seca</option>
              <option value="prenha">Prenha</option>
            </select>
            <Button variant="secondary" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </div>
        
        {selectedVacas.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-dark">
              {selectedVacas.length} vaca(s) selecionada(s)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                Ações em Lote
              </Button>
              <Button size="sm" onClick={() => setSelectedVacas([])}>
                Limpar Seleção
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Lista de Vacas */}
      <Card className="glassmorphism">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-medium mt-4">Carregando dados do rebanho...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-medium/30 text-accent focus:ring-accent"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVacas(filteredVacas.map(v => v.id));
                        } else {
                          setSelectedVacas([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Raça
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Nascimento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Produção Média
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredVacas.map((vaca) => (
                  <tr key={vaca.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-medium/30 text-accent focus:ring-accent"
                        checked={selectedVacas.includes(vaca.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVacas([...selectedVacas, vaca.id]);
                          } else {
                            setSelectedVacas(selectedVacas.filter(id => id !== vaca.id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark">
                      #{vaca.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                          {vaca.nome.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-dark">{vaca.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-medium">
                      {vaca.raca}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-medium">
                      {new Date(vaca.nascimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(vaca.status)}`}>
                        {getStatusText(vaca.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-dark">{vaca.producaoMedia}L/dia</div>
                      <div className="text-xs text-medium/70">Média mensal</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="secondary" className="p-2" onClick={() => ToastManager.info('Visualizando detalhes...')}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="p-2" onClick={() => ToastManager.info('Editando vaca...')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="p-2 text-red-600 hover:text-red-800" onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            vacaId: vaca.id,
                            vacaNome: vaca.nome
                          });
                        }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glassmorphism-light p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl font-bold text-dark mb-2">{vacas.length}</div>
          <div className="text-sm text-medium/70">Total de Vacas</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
          </div>
        </Card>
        <Card className="glassmorphism-light p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl font-bold text-dark mb-2">
            {vacas.filter(v => v.status === 'lactacao').length}
          </div>
          <div className="text-sm text-medium/70">Em Lactação</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-green-600 h-2 rounded-full" style={{width: `${(vacas.filter(v => v.status === 'lactacao').length / vacas.length) * 100}%`}}></div>
          </div>
        </Card>
        <Card className="glassmorphism-light p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl font-bold text-dark mb-2">
            {vacas.filter(v => v.status === 'prenha').length}
          </div>
          <div className="text-sm text-medium/70">Prenhas</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(vacas.filter(v => v.status === 'prenha').length / vacas.length) * 100}%`}}></div>
          </div>
        </Card>
        <Card className="glassmorphism-light p-6 text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl font-bold text-dark mb-2">
            {vacas.filter(v => v.status === 'seca').length}
          </div>
          <div className="text-sm text-medium/70">Secas</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-yellow-600 h-2 rounded-full" style={{width: `${(vacas.filter(v => v.status === 'seca').length / vacas.length) * 100}%`}}></div>
          </div>
        </Card>
      </div>
      
      {/* Dialog de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, vacaId: null, vacaNome: '' })}
        onConfirm={async () => {
          // Simular remoção
          await new Promise(resolve => setTimeout(resolve, 1000));
          ToastManager.success(`Vaca ${confirmDialog.vacaNome} removida com sucesso!`);
          setConfirmDialog({ isOpen: false, vacaId: null, vacaNome: '' });
        }}
        type="danger"
        title="Remover Vaca"
        message={`Tem certeza que deseja remover a vaca "${confirmDialog.vacaNome}" do rebanho? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
};