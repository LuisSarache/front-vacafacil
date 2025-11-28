import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

const ReproducaoContext = createContext();

export const useReproducao = () => {
  const context = useContext(ReproducaoContext);
  if (!context) {
    throw new Error('useReproducao deve ser usado dentro de ReproducaoProvider');
  }
  return context;
};

export const ReproducaoProvider = ({ children }) => {
  const [inseminacoes, setInseminacoes] = useLocalStorage('vacafacil_inseminacoes', []);
  const [vacinas, setVacinas] = useLocalStorage('vacafacil_vacinas', []);
  const [partos, setPartos] = useLocalStorage('vacafacil_partos', []);
  const [loading, setLoading] = useState(false);

  const loadReproducao = async () => {
    setLoading(true);
    try {
      const data = await apiService.getReproducao();
      if (data.inseminacoes) setInseminacoes(data.inseminacoes);
      if (data.vacinas) setVacinas(data.vacinas);
      if (data.partos) setPartos(data.partos);
    } catch (error) {
      console.error('Erro ao carregar reprodução da API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReproducao();
  }, []);

  const adicionarInseminacao = async (inseminacao) => {
    try {
      const novaInseminacao = await apiService.createReproducao({
        ...inseminacao,
        tipo: 'inseminacao',
        data: new Date().toISOString().split('T')[0],
        status: 'aguardando'
      });
      setInseminacoes(prev => [...prev, novaInseminacao]);
      ToastManager.success('Inseminação registrada com sucesso!');
      return novaInseminacao;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao registrar inseminação');
      throw error;
    }
  };

  const adicionarVacina = async (vacina) => {
    try {
      const novaVacina = await apiService.createReproducao({
        ...vacina,
        tipo: 'vacina',
        dataAplicacao: new Date().toISOString().split('T')[0]
      });
      setVacinas(prev => [...prev, novaVacina]);
      ToastManager.success('Vacina registrada com sucesso!');
      return novaVacina;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao registrar vacina');
      throw error;
    }
  };

  const adicionarParto = async (parto) => {
    try {
      const novoParto = await apiService.createReproducao({
        ...parto,
        tipo: 'parto',
        dataParto: new Date().toISOString().split('T')[0]
      });
      setPartos(prev => [...prev, novoParto]);
      ToastManager.success('Parto registrado com sucesso!');
      return novoParto;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao registrar parto');
      throw error;
    }
  };

  const confirmarPrenhez = (inseminacaoId) => {
    setInseminacoes(prev => 
      prev.map(ins => 
        ins.id === inseminacaoId 
          ? { ...ins, status: 'prenha', previsaoParto: new Date(Date.now() + 280 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
          : ins
      )
    );
  };

  const getVacinasVencidas = () => {
    const hoje = new Date().toISOString().split('T')[0];
    return vacinas.filter(vacina => vacina.proximaDose <= hoje);
  };

  const getVacasPrenhas = () => {
    return inseminacoes.filter(ins => ins.status === 'prenha');
  };

  const value = {
    inseminacoes,
    vacinas,
    partos,
    adicionarInseminacao,
    adicionarVacina,
    adicionarParto,
    confirmarPrenhez,
    getVacinasVencidas,
    getVacasPrenhas,
    loading,
    refresh: loadReproducao
  };

  return (
    <ReproducaoContext.Provider value={value}>
      {children}
    </ReproducaoContext.Provider>
  );
};