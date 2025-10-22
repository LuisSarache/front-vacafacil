import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Download, Calendar, TrendingUp, BarChart3, PieChart, FileText } from 'lucide-react';

export const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');
  const [selectedReport, setSelectedReport] = useState('producao');

  const relatoriosDisponiveis = [
    { id: 'producao', nome: 'Produção por Período', icon: TrendingUp },
    { id: 'ranking', nome: 'Ranking de Vacas', icon: BarChart3 },
    { id: 'lucratividade', nome: 'Lucratividade', icon: PieChart },
    { id: 'reproducao', nome: 'Indicadores de Reprodução', icon: FileText }
  ];

  const dadosProducao = {
    totalPeriodo: 2450,
    mediaDiaria: 85,
    melhorDia: { data: '15/01/2024', producao: 95 },
    piorDia: { data: '08/01/2024', producao: 72 }
  };

  const rankingVacas = [
    { posicao: 1, vaca: 'Mimosa #001', producao: 750, media: 25 },
    { posicao: 2, vaca: 'Bonita #003', producao: 660, media: 22 },
    { posicao: 3, vaca: 'Flor #004', producao: 600, media: 20 },
    { posicao: 4, vaca: 'Estrela #002', producao: 540, media: 18 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark">Relatórios e Gráficos</h1>
        <Button className="flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {relatoriosDisponiveis.map(relatorio => (
                <option key={relatorio.id} value={relatorio.id}>
                  {relatorio.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button className="w-full">
              Gerar Relatório
            </Button>
          </div>
        </div>
      </Card>

      {/* Relatórios Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatoriosDisponiveis.map((relatorio) => (
          <Card key={relatorio.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <relatorio.icon className="w-8 h-8 text-blue-500" />
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{relatorio.nome}</h3>
            <p className="text-sm text-gray-600">Clique para visualizar</p>
          </Card>
        ))}
      </div>

      {/* Conteúdo do Relatório Selecionado */}
      {selectedReport === 'producao' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Resumo de Produção - {selectedPeriod}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Total do Período:</span>
                <span className="font-bold text-blue-600">{dadosProducao.totalPeriodo}L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Média Diária:</span>
                <span className="font-bold text-green-600">{dadosProducao.mediaDiaria}L</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="text-gray-700">Melhor Dia:</span>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{dadosProducao.melhorDia.producao}L</div>
                  <div className="text-xs text-gray-500">{dadosProducao.melhorDia.data}</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Menor Produção:</span>
                <div className="text-right">
                  <div className="font-bold text-red-600">{dadosProducao.piorDia.producao}L</div>
                  <div className="text-xs text-gray-500">{dadosProducao.piorDia.data}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gráfico de Tendência</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de produção em desenvolvimento</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedReport === 'ranking' && (
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Ranking de Vacas Mais Produtivas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produção Total (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Média Diária (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankingVacas.map((vaca) => (
                  <tr key={vaca.posicao} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        vaca.posicao === 1 ? 'bg-yellow-500' : 
                        vaca.posicao === 2 ? 'bg-gray-400' : 
                        vaca.posicao === 3 ? 'bg-orange-600' : 'bg-gray-300'
                      }`}>
                        {vaca.posicao}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vaca.vaca}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vaca.producao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vaca.media}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(vaca.media / 25) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{Math.round((vaca.media / 25) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedReport === 'lucratividade' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análise de Lucratividade</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Receita Total:</span>
                <span className="font-bold text-green-600">R$ 15.800</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Custos Totais:</span>
                <span className="font-bold text-red-600">R$ 8.300</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Lucro Líquido:</span>
                <span className="font-bold text-blue-600">R$ 7.500</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Margem de Lucro:</span>
                <span className="font-bold text-purple-600">47.5%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição de Custos</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de pizza em desenvolvimento</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedReport === 'reproducao' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Taxa de Prenhez</h4>
            <div className="text-3xl font-bold text-green-600 mb-2">75%</div>
            <p className="text-sm text-gray-600">3 de 4 inseminações</p>
          </Card>

          <Card className="p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Intervalo Entre Partos</h4>
            <div className="text-3xl font-bold text-blue-600 mb-2">385</div>
            <p className="text-sm text-gray-600">dias (média)</p>
          </Card>

          <Card className="p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Partos Esperados</h4>
            <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
            <p className="text-sm text-gray-600">próximos 30 dias</p>
          </Card>
        </div>
      )}
    </div>
  );
};