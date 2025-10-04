import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToastManager } from '../components/ToastManager';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { Plus, Calendar, Heart, Baby, Syringe, AlertCircle, Filter, Search } from 'lucide-react';

export const Reproducao = () => {
  const [activeTab, setActiveTab] = useState('inseminacao');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'inseminacao', 'vacina', etc
  const [searchTerm, setSearchTerm] = useState('');

  const inseminacoes = [
    { vaca: 'Mimosa #001', data: '2024-01-10', touro: 'Campeão', status: 'aguardando', proximaVerificacao: '2024-02-10' },
    { vaca: 'Flor #004', data: '2024-01-05', touro: 'Forte', status: 'prenha', previsaoParto: '2024-10-05' }
  ];

  const prenhas = [
    { vaca: 'Bonita #003', inseminacao: '2023-12-15', previsaoParto: '2024-09-15', diasGestacao: 180 },
    { vaca: 'Flor #004', inseminacao: '2024-01-05', previsaoParto: '2024-10-05', diasGestacao: 15 }
  ];

  const partos = [
    { vaca: 'Estrela #002', dataParto: '2024-01-01', sexoBezerro: 'Fêmea', pesoBezerro: 35, observacoes: 'Parto normal' }
  ];

  const vacinas = [
    { vaca: 'Mimosa #001', vacina: 'Brucelose', dataAplicacao: '2024-01-15', proximaDose: '2024-07-15' },
    { vaca: 'Bonita #003', vacina: 'Raiva', dataAplicacao: '2024-01-10', proximaDose: '2024-01-10' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'prenha': return 'bg-green-100 text-green-800';
      case 'aguardando': return 'bg-yellow-100 text-yellow-800';
      case 'vazia': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Reprodução e Saúde</h1>
          <p className="text-medium/70 mt-1">Controle reprodutivo e sanitário do rebanho</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button className="flex items-center" onClick={() => {
            setModalType('inseminacao');
            setShowModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Vacas Prenhas</p>
              <p className="text-2xl font-bold text-dark">{prenhas.length}</p>
              <p className="text-xs text-green-600 mt-1">Taxa: 75%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Inseminações</p>
              <p className="text-2xl font-bold text-dark">{inseminacoes.length}</p>
              <p className="text-xs text-blue-600 mt-1">Este mês</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Syringe className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Partos este Mês</p>
              <p className="text-2xl font-bold text-dark">{partos.length}</p>
              <p className="text-xs text-purple-600 mt-1">2 esperados</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Baby className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Vacinas Pendentes</p>
              <p className="text-2xl font-bold text-dark">2</p>
              <p className="text-xs text-red-600 mt-1">Urgente</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['inseminacao', 'prenhas', 'partos', 'vacinas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'inseminacao' ? 'Inseminação' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'inseminacao' && (
        <Card className="glassmorphism">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark">Controle de Inseminações</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar vaca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                  />
                </div>
                <Button size="sm" onClick={() => {
                  setModalType('inseminacao');
                  setShowModal(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Inseminação
                </Button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-medium mt-4">Carregando dados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase">Vaca</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase">Data</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase">Touro</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase">Próxima Verificação</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {inseminacoes.map((item, index) => (
                    <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                            {item.vaca.split('#')[1]}
                          </div>
                          <span className="text-sm font-medium text-dark">{item.vaca}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">
                        {item.touro}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={item.status === 'prenha' ? 'success' : 'warning'}>
                          {item.status === 'aguardando' ? 'Aguardando' : 'Prenha'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                        {item.proximaVerificacao ? new Date(item.proximaVerificacao).toLocaleDateString('pt-BR') : 
                         item.previsaoParto ? new Date(item.previsaoParto).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          <Button size="sm" variant="secondary" className="p-2">
                            Editar
                          </Button>
                          <Button size="sm" variant="secondary" className="p-2">
                            Verificar
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
      )}

      {activeTab === 'prenhas' && (
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Vacas Prenhas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inseminação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previsão Parto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dias Gestação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prenhas.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.vaca}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.inseminacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.previsaoParto).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.diasGestacao} dias
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Prenha
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'partos' && (
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Histórico de Partos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Parto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexo Bezerro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peso (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partos.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.vaca}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.dataParto).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sexoBezerro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.pesoBezerro}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.observacoes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'vacinas' && (
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Controle de Vacinas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vacina</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Aplicação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Dose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vacinas.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.vaca}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.vacina}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.dataAplicacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.proximaDose).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        new Date(item.proximaDose) <= new Date() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {new Date(item.proximaDose) <= new Date() ? 'Pendente' : 'Em dia'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {/* Modal para Novos Registros */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Nova ${modalType === 'inseminacao' ? 'Inseminação' : 'Vacinação'}`}
        size="md"
      >
        <form className="space-y-4">
          <FormField
            label="Vaca"
            as="select"
            placeholder="Selecione a vaca"
            options={['Mimosa #001', 'Estrela #002', 'Bonita #003', 'Flor #004']}
            required
          />
          
          {modalType === 'inseminacao' ? (
            <>
              <FormField
                label="Data da Inseminação"
                type="date"
                required
              />
              <FormField
                label="Touro"
                placeholder="Nome do touro"
                required
              />
            </>
          ) : (
            <>
              <FormField
                label="Tipo de Vacina"
                as="select"
                placeholder="Selecione a vacina"
                options={['Brucelose', 'Raiva', 'Febre Aftosa', 'IBR/BVD']}
                required
              />
              <FormField
                label="Data de Aplicação"
                type="date"
                required
              />
            </>
          )}
          
          <FormField
            label="Observações"
            as="textarea"
            placeholder="Informações adicionais..."
            rows={3}
          />
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                ToastManager.success(`${modalType === 'inseminacao' ? 'Inseminação' : 'Vacinação'} registrada com sucesso!`);
                setShowModal(false);
              }}
            >
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};