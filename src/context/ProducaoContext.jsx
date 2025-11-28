import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

const ProducaoContext = createContext();

export function useProducao() {
  const context = useContext(ProducaoContext);
  if (!context) {
    throw new Error('useProducao deve ser usado dentro de ProducaoProvider');
  }
  return context;
}

export function ProducaoProvider({ children }) {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducao = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducao();
      setRegistros(data);
      localStorage.setItem('producao_registros', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao carregar produção da API:', error);
      const saved = localStorage.getItem('producao_registros');
      if (saved) setRegistros(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducao();
  }, []);

  const addRegistro = async (registro) => {
    try {
      const newRegistro = await apiService.createProducao(registro);
      setRegistros(prev => [...prev, newRegistro]);
      ToastManager.success('Produção registrada com sucesso!');
      return newRegistro;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao registrar produção');
      throw error;
    }
  };

  const deleteRegistro = async (id) => {
    try {
      await apiService.deleteProducao(id);
      setRegistros(prev => prev.filter(r => r.id !== id));
      ToastManager.success('Registro removido com sucesso!');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao remover registro');
      throw error;
    }
  };

  const getProducaoPorVaca = (vacaId) => {
    return registros.filter(r => r.vacaId === vacaId);
  };

  const getProducaoPorPeriodo = (dataInicio, dataFim) => {
    return registros.filter(r => {
      const data = new Date(r.data);
      return data >= new Date(dataInicio) && data <= new Date(dataFim);
    });
  };

  return (
    <ProducaoContext.Provider value={{
      registros,
      addRegistro,
      deleteRegistro,
      getProducaoPorVaca,
      getProducaoPorPeriodo,
      loading,
      refresh: loadProducao
    }}>
      {children}
    </ProducaoContext.Provider>
  );
}
