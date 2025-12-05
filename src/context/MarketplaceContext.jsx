import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

const MarketplaceContext = createContext();

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace deve ser usado dentro de MarketplaceProvider');
  }
  return context;
};

export const MarketplaceProvider = ({ children }) => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAnuncios = async (filters = {}) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token_backup');
    if (!token) {
      // Sem token, carregar apenas anúncios locais (sem mocks)
      const saved = localStorage.getItem('marketplace_anuncios');
      if (saved) {
        try {
          setAnuncios(JSON.parse(saved));
        } catch {
          setAnuncios([]);
        }
      } else {
        setAnuncios([]);
      }
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.getAnuncios(filters);
      setAnuncios(data);
      localStorage.setItem('marketplace_anuncios', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao carregar anúncios da API:', error);
      // Em caso de erro, carregar apenas anúncios locais salvos
      const saved = localStorage.getItem('marketplace_anuncios');
      if (saved) {
        try {
          setAnuncios(JSON.parse(saved));
        } catch {
          setAnuncios([]);
        }
      } else {
        setAnuncios([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnuncios();
  }, []);

  const createAnuncio = async (anuncio) => {
    try {
      const novo = await apiService.createAnuncio(anuncio);
      setAnuncios(prev => [novo, ...prev]);
      ToastManager.success('Anúncio criado com sucesso!');
      return novo;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao criar anúncio');
      throw error;
    }
  };

  const updateAnuncio = async (id, data) => {
    try {
      const updated = await apiService.updateAnuncio(id, data);
      setAnuncios(prev => prev.map(a => a.id === id ? updated : a));
      ToastManager.success('Anúncio atualizado com sucesso!');
      return updated;
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao atualizar anúncio');
      throw error;
    }
  };

  const deleteAnuncio = async (id) => {
    try {
      await apiService.deleteAnuncio(id);
      setAnuncios(prev => prev.filter(a => a.id !== id));
      ToastManager.success('Anúncio removido com sucesso!');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao remover anúncio');
      throw error;
    }
  };

  const value = {
    anuncios,
    loading,
    loadAnuncios,
    createAnuncio,
    updateAnuncio,
    deleteAnuncio,
    refresh: loadAnuncios
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};
