import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('producao_registros');
      if (saved) {
        setRegistros(JSON.parse(saved));
      } else {
        const mockData = [
          { id: 1, vacaId: 1, vacaNome: 'Mimosa #001', data: '2024-01-20', periodo: 'Manhã', quantidade: 26 },
          { id: 2, vacaId: 1, vacaNome: 'Mimosa #001', data: '2024-01-20', periodo: 'Tarde', quantidade: 24 },
          { id: 3, vacaId: 2, vacaNome: 'Estrela #002', data: '2024-01-20', periodo: 'Manhã', quantidade: 18 }
        ];
        setRegistros(mockData);
        localStorage.setItem('producao_registros', JSON.stringify(mockData));
      }
    } catch (error) {
      console.error('Erro ao carregar produção:', error);
    }
  }, []);

  const addRegistro = (registro) => {
    const newRegistro = {
      id: Date.now(),
      ...registro
    };
    const updated = [...registros, newRegistro];
    setRegistros(updated);
    localStorage.setItem('producao_registros', JSON.stringify(updated));
  };

  const deleteRegistro = (id) => {
    const updated = registros.filter(r => r.id !== id);
    setRegistros(updated);
    localStorage.setItem('producao_registros', JSON.stringify(updated));
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
      getProducaoPorPeriodo
    }}>
      {children}
    </ProducaoContext.Provider>
  );
}
