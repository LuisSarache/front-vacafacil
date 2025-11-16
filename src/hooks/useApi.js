import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

// 🔄 Hook para requisições da API com loading e error handling
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
      ToastManager.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// 🐄 Hook específico para Vacas
export const useVacas = (params = {}) => {
  return useApi(() => apiService.getVacas(params), [JSON.stringify(params)]);
};

// 🥛 Hook específico para Produção
export const useProducao = (params = {}) => {
  return useApi(() => apiService.getProducao(params), [JSON.stringify(params)]);
};

// 💰 Hook específico para Financeiro
export const useFinanceiroApi = () => {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFinanceiro = async () => {
    try {
      setLoading(true);
      const [receitasData, despesasData] = await Promise.all([
        apiService.getReceitas(),
        apiService.getDespesas()
      ]);
      setReceitas(receitasData);
      setDespesas(despesasData);
    } catch (error) {
      ToastManager.error('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceiro();
  }, []);

  const addReceita = async (receita) => {
    try {
      const newReceita = await apiService.createReceita(receita);
      setReceitas(prev => [...prev, newReceita]);
      ToastManager.success('Receita adicionada com sucesso!');
    } catch (error) {
      ToastManager.error('Erro ao adicionar receita');
      throw error;
    }
  };

  const addDespesa = async (despesa) => {
    try {
      const newDespesa = await apiService.createDespesa(despesa);
      setDespesas(prev => [...prev, newDespesa]);
      ToastManager.success('Despesa adicionada com sucesso!');
    } catch (error) {
      ToastManager.error('Erro ao adicionar despesa');
      throw error;
    }
  };

  const deleteReceita = async (id) => {
    try {
      await apiService.deleteReceita(id);
      setReceitas(prev => prev.filter(r => r.id !== id));
      ToastManager.success('Receita excluída com sucesso!');
    } catch (error) {
      ToastManager.error('Erro ao excluir receita');
    }
  };

  const deleteDespesa = async (id) => {
    try {
      await apiService.deleteDespesa(id);
      setDespesas(prev => prev.filter(d => d.id !== id));
      ToastManager.success('Despesa excluída com sucesso!');
    } catch (error) {
      ToastManager.error('Erro ao excluir despesa');
    }
  };

  return {
    receitas,
    despesas,
    loading,
    addReceita,
    addDespesa,
    deleteReceita,
    deleteDespesa,
    refetch: fetchFinanceiro
  };
};

// 🛒 Hook específico para Marketplace
export const useMarketplace = (params = {}) => {
  return useApi(() => apiService.getAnuncios(params), [JSON.stringify(params)]);
};

// 📊 Hook específico para Dashboard
export const useDashboard = () => {
  return useApi(() => apiService.getDashboardData(), []);
};

// 🔔 Hook específico para Notificações
export const useNotifications = () => {
  const { data, loading, error, refetch } = useApi(() => apiService.getNotifications(), []);

  const markAsRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id);
      refetch();
    } catch (error) {
      ToastManager.error('Erro ao marcar notificação como lida');
    }
  };

  return {
    notifications: data || [],
    loading,
    error,
    markAsRead,
    refetch
  };
};

// 🔍 Hook para Busca
export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (query, filters = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await apiService.search(query, filters);
      setResults(data);
    } catch (error) {
      ToastManager.error('Erro na busca');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, search };
};

// 💳 Hook para Assinatura
export const useSubscription = () => {
  const [status, setStatus] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusData, planosData] = await Promise.all([
        apiService.getSubscriptionStatus(),
        apiService.getPlanos()
      ]);
      setStatus(statusData);
      setPlanos(planosData);
    } catch (error) {
      ToastManager.error('Erro ao carregar dados da assinatura');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const subscribe = async (planoId) => {
    try {
      const result = await apiService.subscribe(planoId);
      setStatus(result);
      ToastManager.success('Assinatura realizada com sucesso!');
      return result;
    } catch (error) {
      ToastManager.error('Erro ao realizar assinatura');
      throw error;
    }
  };

  const cancel = async () => {
    try {
      await apiService.cancelSubscription();
      await fetchData(); // Recarregar dados
      ToastManager.success('Assinatura cancelada com sucesso!');
    } catch (error) {
      ToastManager.error('Erro ao cancelar assinatura');
    }
  };

  return {
    status,
    planos,
    loading,
    subscribe,
    cancel,
    refetch: fetchData
  };
};