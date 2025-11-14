import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToastManager } from '../components/ToastManager';
import { useProducao } from '../context/ProducaoContext';
import { exportToCSV } from '../utils/export';
import { useTranslation } from '../utils/i18n';
import { Plus, Download, Calendar, TrendingUp, BarChart3, Target, Award } from 'lucide-react';

export const Producao = () => {
  const { addRegistro } = useProducao();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('tabela');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vacaId: '',
    vacaNome: '',
    periodo: 'Manhã',
    quantidade: ''
  });

  const producaoData = [
    { vaca: 'Mimosa #001', manha: 12, tarde: 13, total: 25 },
    { vaca: 'Estrela #002', manha: 8, tarde: 10, total: 18 },
    { vaca: 'Bonita #003', manha: 11, tarde: 11, total: 22 },
    { vaca: 'Flor #004', manha: 9, tarde: 11, total: 20 }
  ];

  const totalDia = producaoData.reduce((sum, item) => sum + item.total, 0);

  // 🔹 Função para validar horário de ordenha
  const validarHorarioOrdenha = (periodo) => {
    const agora = new Date();
    const hora = agora.getHours();
    const minuto = agora.getMinutes();
    const horaDecimal = hora + minuto / 60;

    if (periodo === 'Manhã') {
      return horaDecimal >= 3.5 && horaDecimal <= 10; // 03:30 às 10:00
    }
    if (periodo === 'Tarde') {
      return horaDecimal >= 16 || horaDecimal <= 0; // 16:00 às 00:00
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Produção de Leite</h1>
          <p className="text-medium/70 mt-1">Controle e acompanhe a produção diária do seu rebanho</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('tabela')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'tabela' ? 'bg-white text-dark shadow-sm' : 'text-medium/70'
              }`}
            >
              Tabela
            </button>
            <button 
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'cards' ? 'bg-white text-dark shadow-sm' : 'text-medium/70'
              }`}
            >
              Cards
            </button>
          </div>
          <Button variant="secondary" className="flex items-center" onClick={() => {
            try {
              exportToCSV(producaoData, 'producao.csv');
              ToastManager.success('Dados exportados!');
            } catch {
              ToastManager.error('Erro ao exportar');
            }
          }}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            className="flex items-center" 
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Ordenha
          </Button>
        </div>
      </div>

      {/* Filtros e Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="glassmorphism-light p-6">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Filtros
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Data
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <Button 
              variant="secondary" 
              className="w-full" 
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                setLoading(false);
                ToastManager.success('Dados atualizados!');
              }}
            >
              Aplicar Filtros
            </Button>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-500" />
            Resumo do Dia
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-medium/70 text-sm">Total Produzido:</span>
              <span className="font-bold text-dark">{totalDia}L</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-medium/70 text-sm">Média por Vaca:</span>
              <span className="font-bold text-dark">{(totalDia / producaoData.length).toFixed(1)}L</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
              <span className="text-medium/70 text-sm">Vacas Ordenhadas:</span>
              <span className="font-bold text-dark">{producaoData.length}</span>
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-orange-500" />
            Comparativo
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-medium/70 text-sm">Ontem:</span>
              <span className="font-bold text-dark">82L</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span className="text-medium/70 text-sm">Variação:</span>
              <span className="font-bold text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +3L
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span className="text-medium/70 text-sm">Média Semanal:</span>
              <span className="font-bold text-dark">78L</span>
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6">
          <h3 className="text-lg font-semibold text-dark mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Metas
          </h3>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-dark">{Math.round((totalDia / 90) * 100)}%</div>
              <div className="text-sm text-medium/70">Meta Diária</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min((totalDia / 90) * 100, 100)}%`}}></div>
              </div>
            </div>
            <div className="text-xs text-medium/70 text-center">
              Meta: 90L/dia
            </div>
          </div>
        </Card>
      </div>

      {/* Dados de Produção */}
      {viewMode === 'tabela' ? (
        <Card className="glassmorphism">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-dark">
              Produção de {new Date(selectedDate).toLocaleDateString('pt-BR')}
            </h3>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <LoadingSpinner size="lg" />
              <p className="text-medium mt-4">Carregando dados de produção...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                      Vaca
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                      Manhã (L)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                      Tarde (L)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                      Total (L)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-dark uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {producaoData.map((item, index) => (
                    <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3">
                            {item.vaca.split('#')[1]}
                          </div>
                          <span className="text-sm font-medium text-dark">{item.vaca}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">
                        {item.manha}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">
                        {item.tarde}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-dark">{item.total}L</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((item.total / 30) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-medium/70">{Math.round((item.total / 30) * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          item.total >= 20 ? 'bg-green-100 text-green-800' : 
                          item.total >= 15 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.total >= 20 ? 'Excelente' : item.total >= 15 ? 'Normal' : 'Baixa'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark">
                      TOTAL
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark">
                      {producaoData.reduce((sum, item) => sum + item.manha, 0)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-dark">
                      {producaoData.reduce((sum, item) => sum + item.tarde, 0)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-dark">
                      {totalDia}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                    <td className="px-6 py-4 whitespace-nowrap"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {producaoData.map((item, index) => (
            <Card key={index} className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {item.vaca.split('#')[1]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark">{item.vaca}</h4>
                    <p className="text-xs text-medium/70">Produção diária</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.total >= 20 ? 'bg-green-100 text-green-800' : 
                  item.total >= 15 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {item.total >= 20 ? 'Excelente' : item.total >= 15 ? 'Normal' : 'Baixa'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm text-medium/70">Manhã:</span>
                  <span className="font-bold text-dark">{item.manha}L</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span className="text-sm text-medium/70">Tarde:</span>
                  <span className="font-bold text-dark">{item.tarde}L</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-dark">Total:</span>
                  <span className="text-xl font-bold text-dark">{item.total}L</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-medium/70 mb-1">
                  <span>Performance</span>
                  <span>{Math.round((item.total / 30) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((item.total / 30) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Gráfico de Tendência */}
      <Card className="glassmorphism p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-dark">Tendência de Produção (7 dias)</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">Últimos 7 dias</Button>
            <Button size="sm" variant="secondary">Últimos 30 dias</Button>
          </div>
        </div>
        <div className="w-full h-64 flex items-center justify-center text-medium/50">
          Gráfico de Tendência aqui
        </div>
      </Card>

      {/* Modal de Registro */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Ordenha">
        <form onSubmit={(e) => {
          e.preventDefault();

          if (!validarHorarioOrdenha(formData.periodo)) {
            ToastManager.error('Agora não é hora dessa ordenha');
            return;
          }

          addRegistro({ ...formData, data: selectedDate });
          ToastManager.success('Produção registrada!');
          setShowModal(false);
          setFormData({ vacaId: '', vacaNome: '', periodo: 'Manhã', quantidade: '' });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Vaca')}</label>
            <select
              value={formData.vacaId}
              onChange={(e) => {
                const selected = e.target.selectedOptions[0];
                setFormData({ ...formData, vacaId: e.target.value, vacaNome: selected.text });
              }}
              className="w-full px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent bg-white text-dark"
              required
            >
              <option value="">Selecione</option>
              <option value="1">Mimosa #001</option>
              <option value="2">Estrela #002</option>
              <option value="3">Bonita #003</option>
              <option value="4">Flor #004</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Período')}</label>
            <select
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
              className="w-full px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent bg-white text-dark"
            >
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Quantidade (L)')}</label>
            <Input
              type="number"
              step="0.1"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
              required
            />
          </div>

          {/* 🔹 Aviso se estiver fora do horário */}
          {!validarHorarioOrdenha(formData.periodo) && (
            <p className="text-red-600 text-sm mt-1">
              Fora do horário permitido para ordenha. Horários permitidos: Manhã (03:30 às 10:00) | Tarde (16:00 às 00:00)
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!validarHorarioOrdenha(formData.periodo)}
            >
              Registrar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
