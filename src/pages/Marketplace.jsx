import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { ToastManager } from '../components/ToastManager';
import { chatService } from '../services/chatService';
import { Search, Filter, ShoppingCart, DollarSign, MapPin, Calendar, Milk, PlusCircle, MessageCircle } from 'lucide-react';

export const Marketplace = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { anuncios, createAnuncio, loading } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRaca, setFilterRaca] = useState('todas');
  const [filterTipo, setFilterTipo] = useState('todos');

  // 🔹 Filtro
  const filteredAnuncios = anuncios.filter(anuncio => {
    const matchesSearch = anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anuncio.raca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRaca = filterRaca === 'todas' || anuncio.raca === filterRaca;
    const matchesTipo = filterTipo === 'todos' || anuncio.tipo === filterTipo;
    return matchesSearch && matchesRaca && matchesTipo;
  });



  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark">Marketplace</h1>
          <p className="text-medium/70 mt-1">Compre e venda vacas com outros produtores</p>
        </div>
        <Button className="flex items-center" onClick={() => navigate('/marketplace/criar-anuncio')}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Criar Anúncio
        </Button>
      </div>

      {/* 🔹 Filtros */}
      <Card className="!bg-white p-6 border border-gray-200">
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

      {/* 🔹 Lista de Anúncios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAnuncios.map((anuncio) => (
          <Card key={anuncio.id} className="!bg-white p-6 border border-gray-200 hover:border-gray-300 transition-all">
            {/* Foto do Animal */}
            <div className="mb-4 rounded-lg overflow-hidden !bg-gray-100">
              {anuncio.foto ? (
                <img 
                  src={anuncio.foto} 
                  alt={anuncio.titulo}
                  className="w-full h-48 object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center text-gray-400">
                  <ShoppingCart className="w-16 h-16" />
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold !text-gray-900">{anuncio.titulo}</h3>
                <p className="text-sm !text-gray-600 mt-1">{anuncio.raca}</p>
              </div>
              <Badge variant={anuncio.tipo === 'venda' ? 'success' : 'info'}>
                {anuncio.tipo === 'venda' ? 'Venda' : 'Procura'}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm !text-gray-700">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="font-bold !text-gray-900">R$ {anuncio.preco.toLocaleString()}</span>
              </div>

              {anuncio.idade && (
                <div className="flex items-center text-sm !text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{anuncio.idade} anos</span>
                </div>
              )}

              {anuncio.producaoMedia > 0 && (
                <div className="flex items-center text-sm !text-gray-600">
                  <Milk className="w-4 h-4 mr-2" />
                  <span>{anuncio.producaoMedia}L/dia</span>
                </div>
              )}

              <div className="flex items-center text-sm !text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{anuncio.localizacao}</span>
              </div>
            </div>

            <p className="text-sm !text-gray-600 mb-4">{anuncio.descricao}</p>

            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <div>
                <p className="text-xs !text-gray-500">Anunciante</p>
                <p className="text-sm font-medium !text-gray-900">{anuncio.vendedor}</p>
              </div>
              {/* Só mostrar botão se não for o próprio anúncio */}
              {anuncio.userId !== user?.id && anuncio.userId !== user?.email && (
                <Button 
                  size="sm" 
                  onClick={async () => {
                    try {
                      const conversation = await chatService.createConversation(
                        anuncio.id, 
                        anuncio.vendedor,
                        anuncio.localizacao
                      );
                      navigate(`/chat/${conversation.id}`);
                    } catch (error) {
                      console.error('Erro ao criar conversa:', error);
                      ToastManager.error('Erro ao iniciar conversa. Tente novamente.');
                    }
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Entrar em Contato
                </Button>
              )}
              {/* Mostrar badge se for seu anúncio */}
              {(anuncio.userId === user?.id || anuncio.userId === user?.email) && (
                <Badge variant="info">Seu Anúncio</Badge>
              )}
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
