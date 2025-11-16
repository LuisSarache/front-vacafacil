import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

<<<<<<< Updated upstream
// 🔄 Hook para requisições da API com loading e error handling
export const useApi = (apiCall, dependencies = []) => {
=======
// Hook para requisições GET com cache
export const useApi = (endpoint, params = {}, dependencies = []) => {
>>>>>>> Stashed changes
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

<<<<<<< Updated upstream
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
=======
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.request(endpoint, { 
          method: 'GET',
          ...params 
        });
        setData(result);
      } catch (err) {
        setError(err.message);
        ToastManager.error(`Erro ao carregar dados: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

// Hook para mutations (POST, PUT, DELETE)
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.request(endpoint, options);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      ToastManager.error(`Erro na operação: ${err.message}`);
      return { success: false, error: err.message };
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
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
=======
  return { mutate, loading, error };
};

// Hook específico para autenticação
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await apiService.login(email, password);
      ToastManager.success('Login realizado com sucesso!');
      return { success: true, data: result };
    } catch (err) {
      ToastManager.error(`Erro no login: ${err.message}`);
      return { success: false, error: err.message };
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
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
=======
  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await apiService.register(userData);
      ToastManager.success('Cadastro realizado com sucesso!');
      return { success: true, data: result };
    } catch (err) {
      ToastManager.error(`Erro no cadastro: ${err.message}`);
      return { success: false, error: err.message };
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
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
=======
  const logout = () => {
    apiService.logout();
    ToastManager.info('Logout realizado com sucesso!');
  };

  return { login, register, logout, loading };
>>>>>>> Stashed changes
};