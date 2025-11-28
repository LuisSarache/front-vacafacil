import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

const FinanceiroContext = createContext();

export function useFinanceiro() {
  const context = useContext(FinanceiroContext);
  if (!context) {
    throw new Error('useFinanceiro deve ser usado dentro de FinanceiroProvider');
  }
  return context;
}

export function FinanceiroProvider({ children }) {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFinanceiro = async () => {
    setLoading(true);
    try {
      const [receitasData, despesasData] = await Promise.all([
        apiService.getReceitas(),
        apiService.getDespesas()
      ]);
      setReceitas(receitasData);
      setDespesas(despesasData);
      localStorage.setItem('financeiro_receitas', JSON.stringify(receitasData));
      localStorage.setItem('financeiro_despesas', JSON.stringify(despesasData));
    } catch (error) {
      console.error('Erro ao carregar financeiro da API:', error);
      const savedReceitas = localStorage.getItem('financeiro_receitas');
      const savedDespesas = localStorage.getItem('financeiro_despesas');
      if (savedReceitas) setReceitas(JSON.parse(savedReceitas));
      if (savedDespesas) setDespesas(JSON.parse(savedDespesas));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceiro();
  }, []);

  const addReceita = async (receita) => {
    try {
      const nova = await apiService.createReceita(receita);
      setReceitas(prev => [...prev, nova]);
      ToastManager.success('Receita adicionada com sucesso!');
      return nova;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao adicionar receita');
      throw error;
    }
  };

  const addDespesa = async (despesa) => {
    try {
      const nova = await apiService.createDespesa(despesa);
      setDespesas(prev => [...prev, nova]);
      ToastManager.success('Despesa adicionada com sucesso!');
      return nova;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao adicionar despesa');
      throw error;
    }
  };

  const deleteReceita = async (id) => {
    try {
      await apiService.deleteReceita(id);
      setReceitas(prev => prev.filter(r => r.id !== id));
      ToastManager.success('Receita removida com sucesso!');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao remover receita');
      throw error;
    }
  };

  const deleteDespesa = async (id) => {
    try {
      await apiService.deleteDespesa(id);
      setDespesas(prev => prev.filter(d => d.id !== id));
      ToastManager.success('Despesa removida com sucesso!');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao remover despesa');
      throw error;
    }
  };

  const getTotalReceitas = () => receitas.reduce((sum, r) => sum + parseFloat(r.valor), 0);
  const getTotalDespesas = () => despesas.reduce((sum, d) => sum + parseFloat(d.valor), 0);
  const getLucro = () => getTotalReceitas() - getTotalDespesas();

  return (
    <FinanceiroContext.Provider value={{
      receitas,
      despesas,
      addReceita,
      addDespesa,
      deleteReceita,
      deleteDespesa,
      getTotalReceitas,
      getTotalDespesas,
      getLucro,
      loading,
      refresh: loadFinanceiro
    }}>
      {children}
    </FinanceiroContext.Provider>
  );
}
