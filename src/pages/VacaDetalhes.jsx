import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVacas } from '../context/VacasContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { ToastManager } from '../components/ToastManager';
import { ArrowLeft, Edit, Trash2, Calendar, Milk, Heart, Activity } from 'lucide-react';

export const VacaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVacaById, deleteVaca } = useVacas();
  const [loading, setLoading] = useState(false);

  const vaca = getVacaById(id);

  if (!vaca) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark mb-4">Vaca não encontrada</h2>
        <Button onClick={() => navigate('/rebanho')}>Voltar ao Rebanho</Button>
      </div>
    );
  }

  const producaoHistorico = [
    { data: '2024-01-20', quantidade: 26, periodo: 'Manhã' },
    { data: '2024-01-20', quantidade: 24, periodo: 'Tarde' },
    { data: '2024-01-19', quantidade: 25, periodo: 'Manhã' },
    { data: '2024-01-19', quantidade: 23, periodo: 'Tarde' }
  ];

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja remover ${vaca.nome}?`)) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      deleteVaca(id);
      ToastManager.success('Vaca removida com sucesso!');
      navigate('/rebanho');
    } catch {
      ToastManager.error('Erro ao remover vaca');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'lactacao': return 'success';
      case 'seca': return 'warning';
      case 'prenha': return 'info';
      default: return 'default';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/rebanho')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-dark">{vaca.nome} #{vaca.numero}</h1>
            <p className="text-medium/70 mt-1">{vaca.raca}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/rebanho/editar/${id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="secondary" onClick={handleDelete} loading={loading}>
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </div>

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glassmorphism-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Status</p>
              <Badge variant={getStatusColor(vaca.status)} className="mt-2">
                {getStatusText(vaca.status)}
              </Badge>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="glassmorphism-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Produção Média</p>
              <p className="text-2xl font-bold text-dark">{vaca.producaoMedia}L</p>
            </div>
            <Milk className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="glassmorphism-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Idade</p>
              <p className="text-2xl font-bold text-dark">
                {vaca.nascimento ? Math.floor((new Date() - new Date(vaca.nascimento)) / (365 * 24 * 60 * 60 * 1000)) : 0} anos
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="glassmorphism-light p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medium/70">Peso</p>
              <p className="text-2xl font-bold text-dark">{vaca.peso || 0}kg</p>
            </div>
            <Heart className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glassmorphism p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Informações Gerais</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-medium/70">Número:</span>
              <span className="font-medium text-dark">#{vaca.numero}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medium/70">Raça:</span>
              <span className="font-medium text-dark">{vaca.raca}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medium/70">Data de Nascimento:</span>
              <span className="font-medium text-dark">
                {vaca.nascimento ? new Date(vaca.nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-medium/70">Mãe:</span>
              <span className="font-medium text-dark">{vaca.mae || 'Não informado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medium/70">Pai:</span>
              <span className="font-medium text-dark">{vaca.pai || 'Não informado'}</span>
            </div>
          </div>
        </Card>

        <Card className="glassmorphism p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Saúde e Reprodução</h3>
          <div className="space-y-3">
            {vaca.ultimaInseminacao && (
              <div className="flex justify-between">
                <span className="text-medium/70">Última Inseminação:</span>
                <span className="font-medium text-dark">
                  {new Date(vaca.ultimaInseminacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            {vaca.ultimaVacina && (
              <div className="flex justify-between">
                <span className="text-medium/70">Última Vacina:</span>
                <span className="font-medium text-dark">
                  {new Date(vaca.ultimaVacina).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            {vaca.proximaVacina && (
              <div className="flex justify-between">
                <span className="text-medium/70">Próxima Vacina:</span>
                <span className="font-medium text-dark">
                  {new Date(vaca.proximaVacina).toLocaleDateString('pt-BR')}
                </span>
              </div>
            )}
            {!vaca.ultimaInseminacao && !vaca.ultimaVacina && !vaca.proximaVacina && (
              <p className="text-medium/70 text-sm">Nenhuma informação de saúde registrada</p>
            )}
          </div>
        </Card>
      </div>

      {/* Histórico de Produção */}
      <Card className="glassmorphism p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Histórico de Produção Recente</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-dark uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-dark uppercase">Período</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-dark uppercase">Quantidade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {producaoHistorico.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-dark">
                    {new Date(item.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-medium">{item.periodo}</td>
                  <td className="px-6 py-4 text-sm font-bold text-dark">{item.quantidade}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Observações */}
      {vaca.observacoes && (
        <Card className="glassmorphism p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Observações</h3>
          <p className="text-medium">{vaca.observacoes}</p>
        </Card>
      )}
    </div>
  );
};
