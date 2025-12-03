import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

const VacasContext = createContext();

export function useVacas() {
  const context = useContext(VacasContext);
  if (!context) {
    throw new Error('useVacas deve ser usado dentro de VacasProvider');
  }
  return context;
}

export function VacasProvider({ children }) {
  const [vacas, setVacas] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVacas = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token_backup');
    if (!token) {
      const saved = localStorage.getItem('vacas');
      if (saved) {
        try {
          setVacas(JSON.parse(saved));
        } catch {}
      }
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.getVacas();
      setVacas(data);
      localStorage.setItem('vacas', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao carregar vacas da API:', error);
      const saved = localStorage.getItem('vacas');
      if (saved) {
        try {
          setVacas(JSON.parse(saved));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacas();
  }, []);

  const addVaca = async (vaca) => {
    try {
      const nova = await apiService.createVaca(vaca);
      setVacas(prev => [...prev, nova]);
      ToastManager.success('Vaca cadastrada com sucesso!');
      return nova;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao cadastrar vaca');
      throw error;
    }
  };

  const updateVaca = async (id, data) => {
    try {
      const updated = await apiService.updateVaca(id, data);
      setVacas(prev => prev.map(v => v.id === Number(id) ? updated : v));
      ToastManager.success('Vaca atualizada com sucesso!');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao atualizar vaca');
      throw error;
    }
  };

  const deleteVaca = async (id) => {
    try {
      await apiService.deleteVaca(id);
      setVacas(prev => prev.filter(v => v.id !== Number(id)));
      ToastManager.success('Vaca removida com sucesso!');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao remover vaca');
      throw error;
    }
  };

  const getVacaById = (id) => {
    return vacas.find(v => v.id === Number(id));
  };

  return (
    <VacasContext.Provider value={{ vacas, addVaca, updateVaca, deleteVaca, getVacaById, loading, refresh: loadVacas }}>
      {children}
    </VacasContext.Provider>
  );
}
