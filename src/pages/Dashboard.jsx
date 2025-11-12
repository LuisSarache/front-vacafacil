import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ToastManager } from '../components/ToastManager';
import { InteractiveChart } from '../components/InteractiveChart';
import { SubscriptionStatus } from '../components/SubscriptionStatus';
import { Milk, Users, DollarSign, AlertTriangle, TrendingUp, Calendar, RefreshCw, Bell } from 'lucide-react';

export const Dashboard = () => {
  const [dashboardData, _setDashboardData] = useState({
    producaoHoje: 850,
    vacasLactacao: 45,
    lucroMes: 12500,
    alertas: 3
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const alertas = [
    { tipo: 'Vacina', vaca: 'Mimosa #123', prazo: '2 dias' },
    { tipo: 'Secagem', vaca: 'Estrela #089', prazo: 'Hoje' },
    { tipo: 'Prenhez', vaca: 'Bonita #156', prazo: '1 dia' }
  ];

  const chartData = [
    { date: '2024-01-10', value: 820, label: '10/01' },
    { date: '2024-01-11', value: 850, label: '11/01' },
    { date: '2024-01-12', value: 780, label: '12/01' },
    { date: '2024-01-13', value: 900, label: '13/01' },
    { date: '2024-01-14', value: 870, label: '14/01' },
    { date: '2024-01-15', value: 920, label: '15/01' },
    { date: '2024-01-16', value: 850, label: '16/01' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Dashboard VacaFácil</h1>
          <SubscriptionStatus />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-medium">
            Última atualização: {lastUpdate.toLocaleString('pt-BR')}
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            loading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setLastUpdate(new Date());
                ToastManager.success('Dados atualizados com sucesso!');
              } catch {
                ToastManager.error('Erro ao atualizar dados');
              } finally {
                setLoading(false);
              }
            }}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Produção Hoje</p>
              <p className="text-2xl font-bold text-dark">{dashboardData.producaoHoje}L</p>
              <p className="text-xs text-green-600 mt-1">+5% vs ontem</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Milk className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Vacas em Lactação</p>
              <p className="text-2xl font-bold text-dark">{dashboardData.vacasLactacao}</p>
              <p className="text-xs text-blue-600 mt-1">de 52 total</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Lucro do Mês</p>
              <p className="text-2xl font-bold text-dark">R$ {dashboardData.lucroMes.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">Margem: 47.5%</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="glassmorphism-light p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Alertas</p>
              <p className="text-2xl font-bold text-dark">{dashboardData.alertas}</p>
              <p className="text-xs text-red-600 mt-1">Requer atenção</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alertas */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-red-500" />
            Alertas Importantes
          </h2>
          <Button size="sm" variant="secondary" onClick={() => ToastManager.info('Lista completa em desenvolvimento')}>
            Ver Todos
          </Button>
        </div>
        <div className="space-y-3">
          {alertas.map((alerta, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-l-4 border-red-500 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <span className="font-medium text-red-800">{alerta.tipo}</span>
                  <p className="text-sm text-medium">{alerta.vaca}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-red-600 font-medium">{alerta.prazo}</span>
                <Button size="sm" className="ml-2" onClick={() => ToastManager.info('Funcionalidade em desenvolvimento')}>Resolver</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Gráfico e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Produção dos Últimos 7 Dias</h3>
            <Button size="sm" variant="secondary" onClick={() => ToastManager.info('Detalhes em desenvolvimento')}>
              Ver Detalhes
            </Button>
          </div>
          <InteractiveChart 
            data={chartData}
            title="Produção dos Últimos 7 Dias"
            type="line"
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximas Atividades</h3>
            <Button size="sm" variant="secondary" onClick={() => ToastManager.info('Agenda em desenvolvimento')}>
              Agenda
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-dark">Inseminação</p>
                <p className="text-sm text-medium">Vaca #234 • Hoje 14:00</p>
              </div>
              <Button size="sm" onClick={() => ToastManager.info('Agendamento em desenvolvimento')}>Marcar</Button>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500">
              <Calendar className="w-5 h-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-dark">Vacinação</p>
                <p className="text-sm text-medium">Lote A • Amanhã 08:00</p>
              </div>
              <Button size="sm" onClick={() => ToastManager.info('Agendamento em desenvolvimento')}>Marcar</Button>
            </div>
            <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
              <Calendar className="w-5 h-5 text-purple-600 mr-3" />
              <div className="flex-1">
                <p className="font-medium text-dark">Secagem</p>
                <p className="text-sm text-medium">Estrela #089 • Em 3 dias</p>
              </div>
              <Button size="sm" onClick={() => ToastManager.info('Agendamento em desenvolvimento')}>Marcar</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
           