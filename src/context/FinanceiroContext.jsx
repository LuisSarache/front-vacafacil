import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    try {
      const savedReceitas = localStorage.getItem('financeiro_receitas');
      const savedDespesas = localStorage.getItem('financeiro_despesas');
      
      if (savedReceitas) setReceitas(JSON.parse(savedReceitas));
      else {
        const mockReceitas = [
          { id: 1, descricao: 'Venda de Leite', valor: 2500, data: '2024-01-20', categoria: 'Venda' },
          { id: 2, descricao: 'Venda de Bezerro', valor: 1500, data: '2024-01-15', categoria: 'Venda' }
        ];
        setReceitas(mockReceitas);
        localStorage.setItem('financeiro_receitas', JSON.stringify(mockReceitas));
      }

      if (savedDespesas) setDespesas(JSON.parse(savedDespesas));
      else {
        const mockDespesas = [
          { id: 1, descricao: 'Ração', valor: 800, data: '2024-01-18', categoria: 'Alimentação' },
          { id: 2, descricao: 'Veterinário', valor: 300, data: '2024-01-10', categoria: 'Saúde' }
        ];
        setDespesas(mockDespesas);
        localStorage.setItem('financeiro_despesas', JSON.stringify(mockDespesas));
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    }
  }, []);

  const addReceita = (receita) => {
    try {
      const nova = { id: Date.now(), ...receita };
      const updated = [...receitas, nova];
      setReceitas(updated);
      localStorage.setItem('financeiro_receitas', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao adicionar receita:', error);
      throw error;
    }
  };

  const addDespesa = (despesa) => {
    try {
      const nova = { id: Date.now(), ...despesa };
      const updated = [...despesas, nova];
      setDespesas(updated);
      localStorage.setItem('financeiro_despesas', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      throw error;
    }
  };

  const deleteReceita = (id) => {
    const updated = receitas.filter(r => r.id !== id);
    setReceitas(updated);
    localStorage.setItem('financeiro_receitas', JSON.stringify(updated));
  };

  const deleteDespesa = (id) => {
    const updated = despesas.filter(d => d.id !== id);
    setDespesas(updated);
    localStorage.setItem('financeiro_despesas', JSON.stringify(updated));
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
      getLucro
    }}>
      {children}
    </FinanceiroContext.Provider>
  );
}
