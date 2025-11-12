// Utility functions for chart data processing
export const generateChartData = (data, type = 'line') => {
  if (!data || data.length === 0) return null;

  switch (type) {
    case 'production':
      return data.map(item => ({
        date: new Date(item.data).toLocaleDateString('pt-BR'),
        value: item.quantidade || 0,
        vaca: item.vaca
      }));
    
    case 'financial':
      return {
        receitas: data.filter(item => item.tipo === 'receita').reduce((sum, item) => sum + item.valor, 0),
        despesas: data.filter(item => item.tipo === 'despesa').reduce((sum, item) => sum + item.valor, 0)
      };
    
    case 'monthly':
      const monthlyData = {};
      data.forEach(item => {
        const month = new Date(item.data).getMonth();
        if (!monthlyData[month]) monthlyData[month] = 0;
        monthlyData[month] += item.quantidade || item.valor || 0;
      });
      return Object.entries(monthlyData).map(([month, value]) => ({
        month: new Date(2024, month).toLocaleDateString('pt-BR', { month: 'short' }),
        value
      }));
    
    default:
      return data;
  }
};

export const calculateKPIs = (producao, financeiro, vacas) => {
  const totalProducao = producao.reduce((sum, item) => sum + (item.quantidade || 0), 0);
  const mediaProducao = totalProducao / (producao.length || 1);
  
  const receitas = financeiro.filter(item => item.tipo === 'receita').reduce((sum, item) => sum + item.valor, 0);
  const despesas = financeiro.filter(item => item.tipo === 'despesa').reduce((sum, item) => sum + item.valor, 0);
  const lucro = receitas - despesas;
  const margemLucro = receitas > 0 ? (lucro / receitas) * 100 : 0;
  
  const vacasLactacao = vacas.filter(vaca => vaca.status === 'lactacao').length;
  const produtividade = vacasLactacao > 0 ? totalProducao / vacasLactacao : 0;

  return {
    totalProducao,
    mediaProducao: Math.round(mediaProducao * 100) / 100,
    lucro,
    margemLucro: Math.round(margemLucro * 100) / 100,
    produtividade: Math.round(produtividade * 100) / 100,
    vacasLactacao
  };
};