import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

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

  const adicionarInseminacao = (inseminacao) => {
    const novaInseminacao = {
      id: Date.now(),
      ...inseminacao,
      data: new Date().toISOString().split('T')[0],
      status: 'aguardando',
      proximaVerificacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setInseminacoes(prev => [...prev, novaInseminacao]);
    return novaInseminacao;
  };

  const adicionarVacina = (vacina) => {
    const novaVacina = {
      id: Date.now(),
      ...vacina,
      dataAplicacao: new Date().toISOString().split('T')[0],
      proximaDose: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setVacinas(prev => [...prev, novaVacina]);
    return novaVacina;
  };

  const adicionarParto = (parto) => {
    const novoParto = {
      id: Date.now(),
      ...parto,
      dataParto: new Date().toISOString().split('T')[0]
    };
    setPartos(prev => [...prev, novoParto]);
    return novoParto;
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
    getVacasPrenhas
  };

  return (
    <ReproducaoContext.Provider value={value}>
      {children}
    </ReproducaoContext.Provider>
  );
};