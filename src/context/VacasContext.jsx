import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vacas');
      if (saved) {
        setVacas(JSON.parse(saved));
      } else {
        const mockVacas = [
          { id: 1, numero: '001', nome: 'Mimosa', raca: 'Holandesa', nascimento: '2020-03-15', status: 'lactacao', producaoMedia: 25, peso: 550, mae: 'Estrela #002', pai: 'Touro Campeão' },
          { id: 2, numero: '002', nome: 'Estrela', raca: 'Jersey', nascimento: '2019-08-22', status: 'seca', producaoMedia: 18, peso: 480, mae: 'Bonita #003', pai: 'Touro Elite' },
          { id: 3, numero: '003', nome: 'Bonita', raca: 'Holandesa', nascimento: '2021-01-10', status: 'prenha', producaoMedia: 22, peso: 520, mae: 'Flor #004', pai: 'Touro Master' },
          { id: 4, numero: '004', nome: 'Flor', raca: 'Gir', nascimento: '2020-11-05', status: 'lactacao', producaoMedia: 20, peso: 500, mae: 'Rosa #005', pai: 'Touro Premium' }
        ];
        setVacas(mockVacas);
        localStorage.setItem('vacas', JSON.stringify(mockVacas));
      }
    } catch (error) {
      console.error('Erro ao carregar vacas:', error);
    }
  }, []);

  const addVaca = (vaca) => {
    try {
      const nova = { id: Date.now(), ...vaca };
      const updated = [...vacas, nova];
      setVacas(updated);
      localStorage.setItem('vacas', JSON.stringify(updated));
      return nova;
    } catch (error) {
      console.error('Erro ao adicionar vaca:', error);
      throw error;
    }
  };

  const updateVaca = (id, data) => {
    try {
      const updated = vacas.map(v => v.id === Number(id) ? { ...v, ...data } : v);
      setVacas(updated);
      localStorage.setItem('vacas', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao atualizar vaca:', error);
      throw error;
    }
  };

  const deleteVaca = (id) => {
    try {
      const updated = vacas.filter(v => v.id !== Number(id));
      setVacas(updated);
      localStorage.setItem('vacas', JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao deletar vaca:', error);
      throw error;
    }
  };

  const getVacaById = (id) => {
    return vacas.find(v => v.id === Number(id));
  };

  return (
    <VacasContext.Provider value={{ vacas, addVaca, updateVaca, deleteVaca, getVacaById }}>
      {children}
    </VacasContext.Provider>
  );
}
