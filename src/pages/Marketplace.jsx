import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { ToastManager } from '../components/ToastManager';
import { Search, Filter, ShoppingCart, DollarSign, MapPin, Calendar, Milk } from 'lucide-react';

export const Marketplace = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRaca, setFilterRaca] = useState('todas');
  const [filterTipo, setFilterTipo] = useState('todos');

  const anuncios = [
    {
      id: 1,
      tipo: 'venda',
      titulo: 'Vaca Holandesa - Alta Produção',
      raca: 'Holandesa',
      idade: 3,
      producaoMedia: 28,
      preco: 8500,
      localizacao: 'Pouso Alegre/MG',
      vendedor: 'Fazenda São José',
      telefone: '(35) 99999-9999',
      descricao: 'Vaca em excelente estado, produção média de 28L/dia',
      status: 'disponivel'
    },
    {
      id: 2,
      tipo: 'venda',
      titulo: 'Novilha Jersey - Primeira Cria',
      raca: 'Jersey',
      idade: 2,
      producaoMedia: 0,
      preco: 5500,
      localizacao: 'Varginha/MG',
      vendedor: 'Fazenda Boa Vista',
      telefone: '(35) 98888-8888',
      descricao: 'Novilha prenha, primeira cria prevista para 3 meses',
      status: 'disponivel'
    },
    {
      id: 3,
      tipo: 'compra',
      titulo: 'Procuro Vaca Girolando',
      raca: 'Girolando',
      idade: null,
      producaoMedia: 20,
      preco: 7000,
      localizacao: 'Pouso Alegre/MG',
      vendedor: 'João Silva',
      telefone: '(35) 97777-7777',
      descricao: 'Busco vaca girolando com produção mínima de 20L/dia',
      status: 'procurando'
    }
  ];

  const filteredAnuncios = anuncios.filter(anuncio => {
    const matchesSearch = anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.raca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRaca = filterRaca === 'todas' || anuncio.raca === filterRaca;
    const matchesTipo = filterTipo === 'todos' || anuncio.tipo === filterTipo;
    return matchesSearch && matchesRaca && matchesTipo;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Marketplace</h1>
          <p className="text-medium/70 mt-1">Compre e venda vacas com outros produtores</p>
        </div>
        <Button className="flex items-center" onClick={() => navigate('/marketplace/novo')}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Criar Anúncio
        </Button>
      </div>

      {/* Filtros */}
      <Card className="glassmorphism p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium/50 w-4 h-4 pointer-events-none z-10" />
            <Input
              placeholder="Buscar por raça, título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent bg-white text-dark"
            >
              <option value="todos">Todos</option>
              <option value="venda">Venda</option>
              <option value="compra">Procura</option>
            </select>
            <select
              value={filterRaca}
              onChange={(e) => setFilterRaca(e.target.value)}
              className="px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent bg-white text-dark"
            >
              <option value="todas">Todas as Raças</option>
              <option value="Holandesa">Holandesa</option>
              <option value="Jersey">Jersey</option>
              <option value="Girolando">Girolando</option>
              <option value="Gir">Gir</option>
            </select>
            <Button variant="secondary" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Anúncios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAnuncios.map((anuncio) => (
          <Card key={anuncio.id} className="glassmorphism p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-dark">{anuncio.titulo}</h3>
                <p className="text-sm text-medium/70 mt-1">{anuncio.raca}</p>
              </div>
              <Badge variant={anuncio.tipo === 'venda' ? 'success' : 'info'}>
                {anuncio.tipo === 'venda' ? 'Venda' : 'Procura'}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-medium">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="font-bold text-dark">R$ {anuncio.preco.toLocaleString()}</span>
              </div>
              
              {anuncio.idade && (
                <div className="flex items-center text-sm text-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{anuncio.idade} anos</span>
                </div>
              )}
              
              {anuncio.producaoMedia > 0 && (
                <div className="flex items-center text-sm text-medium">
                  <Milk className="w-4 h-4 mr-2" />
                  <span>{anuncio.producaoMedia}L/dia</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-medium">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{anuncio.localizacao}</span>
              </div>
            </div>

            <p className="text-sm text-medium mb-4">{anuncio.descricao}</p>

            <div className="border-t border-medium/20 pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-medium/70">Anunciante</p>
                <p className="text-sm font-medium text-dark">{anuncio.vendedor}</p>
              </div>
              <Button size="sm" onClick={() => ToastManager.info(`Contato: ${anuncio.telefone}`)}>
                Entrar em Contato
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredAnuncios.length === 0 && (
        <Card className="p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-medium/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-dark mb-2">Nenhum anúncio encontrado</h3>
          <p className="text-medium">Tente ajustar os filtros ou criar um novo anúncio</p>
        </Card>
      )}
    </div>
  );
};
