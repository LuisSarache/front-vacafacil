import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { ToastManager } from '../components/ToastManager';
import { useFinanceiro } from '../context/FinanceiroContext';
import { exportToCSV } from '../utils/export';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, Download, Trash2 } from 'lucide-react';

export const Financeiro = () => {
  const { receitas, despesas, addReceita, addDespesa, deleteReceita, deleteDespesa, getTotalReceitas, getTotalDespesas, getLucro } = useFinanceiro();
  const [activeTab, setActiveTab] = useState('resumo');
  const [showModal, setShowModal] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState('receita');
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    categoria: ''
  });

  const totalReceitas = getTotalReceitas();
  const totalDespesas = getTotalDespesas();
  const lucro = getLucro();
  const margemLucro = totalReceitas > 0 ? ((lucro / totalReceitas) * 100).toFixed(1) : 0;

  const resumoFinanceiro = {
    receitas: totalReceitas,
    despesas: totalDespesas,
    lucro,
    margemLucro
  };

  const despesas = [
    { categoria: 'Ração', valor: 3200, percentual: 38.6 },
    { categoria: 'Medicamentos', valor: 1800, percentual: 21.7 },
    { categoria: 'Funcionários', valor: 2500, percentual: 30.1 },
    { categoria: 'Outros', valor: 800, percentual: 9.6 }
  ];

  const receitas = [
    { fonte: 'Venda de Leite', valor: 14200, percentual: 89.9 },
    { fonte: 'Venda de Animais', valor: 1600, percentual: 10.1 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Custos e Financeiro</h1>
          <p className="text-medium/70 mt-1">Controle financeiro completo da fazenda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center" onClick={() => {
            try {
              const dados = [...receitas.map(r => ({ ...r, tipo: 'Receita' })), ...despesas.map(d => ({ ...d, tipo: 'Despesa' }))];
              exportToCSV(dados, 'financeiro.csv');
              ToastManager.success('Dados exportados!');
            } catch {
              ToastManager.error('Erro ao exportar');
            }
          }}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button className="flex items-center" onClick={() => {
            setTipoTransacao('receita');
            setShowModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Receitas</p>
              <p className="text-2xl font-bold text-dark">
                R$ {resumoFinanceiro.receitas.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">+12% vs mês anterior</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Despesas</p>
              <p className="text-2xl font-bold text-dark">
                R$ {resumoFinanceiro.despesas.toLocaleString()}
              </p>
              <p className="text-xs text-red-600 mt-1">+5% vs mês anterior</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Lucro Líquido</p>
              <p className="text-2xl font-bold text-dark">
                R$ {resumoFinanceiro.lucro.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">Meta: R$ 8.000</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Margem de Lucro</p>
              <p className="text-2xl font-bold text-dark">
                {resumoFinanceiro.margemLucro}%
              </p>
              <p className="text-xs text-purple-600 mt-1">Excelente</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <PieChart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-medium/20">
        <nav className="-mb-px flex space-x-8">
          {['resumo', 'receitas', 'despesas', 'relatorios'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-accent text-dark'
                  : 'border-transparent text-medium/70 hover:text-dark hover:border-medium/30'
              }`}
            >
              {tab === 'relatorios' ? 'relatórios' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'resumo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glassmorphism p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Distribuição de Despesas</h3>
            <div className="space-y-4">
              {despesas.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                    <span className="text-sm font-medium">{item.categoria}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">R$ {item.valor.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{item.percentual}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glassmorphism p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Distribuição de Receitas</h3>
            <div className="space-y-4">
              {receitas.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-sm font-medium">{item.fonte}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">R$ {item.valor.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{item.percentual}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'receitas' && (
        <Card className="glassmorphism">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-dark">Receitas do Mês</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receitas.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.descricao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-green-600">R$ {parseFloat(item.valor).toLocaleString()}</span>
                        <Button size="sm" variant="secondary" className="p-1 ml-2" onClick={() => {
                          deleteReceita(item.id);
                          ToastManager.success('Receita excluída');
                        }}>
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'despesas' && (
        <Card className="glassmorphism">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-dark">Despesas do Mês</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {despesas.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.descricao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-red-600">R$ {parseFloat(item.valor).toLocaleString()}</span>
                        <Button size="sm" variant="secondary" className="p-1 ml-2" onClick={() => {
                          deleteDespesa(item.id);
                          ToastManager.success('Despesa excluída');
                        }}>
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'relatorios' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glassmorphism p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Lucro por Vaca</h3>
            <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border border-purple-100">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-dark mx-auto mb-2" />
                <p className="text-medium">Gráfico interativo em desenvolvimento</p>
              </div>
            </div>
          </Card>

          <Card className="glassmorphism p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Evolução Mensal</h3>
            <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border border-green-100">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-dark mx-auto mb-2" />
                <p className="text-medium">Gráfico interativo em desenvolvimento</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Transação */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Nova ${tipoTransacao === 'receita' ? 'Receita' : 'Despesa'}`}>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (tipoTransacao === 'receita') {
            addReceita(formData);
            ToastManager.success('Receita adicionada!');
          } else {
            addDespesa(formData);
            ToastManager.success('Despesa adicionada!');
          }
          setShowModal(false);
          setFormData({ descricao: '', valor: '', data: new Date().toISOString().split('T')[0], categoria: '' });
        }} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTipoTransacao('receita')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                tipoTransacao === 'receita' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setTipoTransacao('despesa')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                tipoTransacao === 'despesa' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Despesa
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <Input
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
            <Input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="w-full px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent bg-white text-dark"
              required
            >
              <option value="">Selecione</option>
              {tipoTransacao === 'receita' ? (
                <>
                  <option value="Venda">Venda</option>
                  <option value="Leite">Leite</option>
                  <option value="Animais">Animais</option>
                  <option value="Outros">Outros</option>
                </>
              ) : (
                <>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Funcionários">Funcionários</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Outros">Outros</option>
                </>
              )}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};