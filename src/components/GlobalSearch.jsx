import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useVacas } from '../context/VacasContext';
import { useProducao } from '../context/ProducaoContext';
import { useFinanceiro } from '../context/FinanceiroContext';

export const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { vacas } = useVacas();
  const { producoes } = useProducao();
  const { transacoes } = useFinanceiro();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = [];
    const searchTerm = query.toLowerCase();

    // Buscar vacas
    vacas.forEach(vaca => {
      if (vaca.nome.toLowerCase().includes(searchTerm) || 
          vaca.numero.toString().includes(searchTerm)) {
        searchResults.push({
          type: 'vaca',
          title: `${vaca.nome} #${vaca.numero}`,
          subtitle: `${vaca.raca} - ${vaca.status}`,
          link: `/vaca/${vaca.id}`
        });
      }
    });

    // Buscar produções
    producoes.forEach(prod => {
      if (prod.vaca.toLowerCase().includes(searchTerm)) {
        searchResults.push({
          type: 'producao',
          title: `Produção - ${prod.vaca}`,
          subtitle: `${prod.quantidade}L - ${new Date(prod.data).toLocaleDateString('pt-BR')}`,
          link: '/producao'
        });
      }
    });

    // Buscar transações
    transacoes.forEach(trans => {
      if (trans.descricao.toLowerCase().includes(searchTerm)) {
        searchResults.push({
          type: 'financeiro',
          title: trans.descricao,
          subtitle: `R$ ${trans.valor.toLocaleString('pt-BR')} - ${trans.tipo}`,
          link: '/financeiro'
        });
      }
    });

    setResults(searchResults.slice(0, 10));
  }, [query, vacas, producoes, transacoes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center p-4 border-b">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Buscar vacas, produções, transações..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none text-lg"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => {
                  onClose();
                  // Navigate to result.link
                }}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    result.type === 'vaca' ? 'bg-blue-500' :
                    result.type === 'producao' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{result.title}</div>
                    <div className="text-sm text-gray-500">{result.subtitle}</div>
                  </div>
                </div>
              </div>
            ))
          ) : query.trim() ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum resultado encontrado para "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Digite para buscar...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};