import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MessageCircle, ArrowLeft, User } from 'lucide-react';

export const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => navigate('/marketplace')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-dark">Chat do Marketplace</h1>
          <p className="text-medium/70 mt-1">Suas conversas com vendedores</p>
        </div>
      </div>
      
      {conversations.length === 0 ? (
        <Card className="glassmorphism p-12 text-center">
          <div className="w-20 h-20 bg-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-dark/50" />
          </div>
          <h3 className="text-xl font-bold text-dark mb-2">Nenhuma conversa ainda</h3>
          <p className="text-medium/70 mb-6">
            Entre em contato com vendedores no Marketplace para iniciar uma conversa
          </p>
          <Button onClick={() => navigate('/marketplace')}>
            Ir para Marketplace
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className="glassmorphism p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02]"
              onClick={() => navigate(`/marketplace/chat/${conv.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-dark to-medium rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-dark truncate">{conv.vendedor_nome || 'Vendedor'}</h3>
                    {conv.mensagens_nao_lidas > 0 && (
                      <span className="bg-[#6A994E] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {conv.mensagens_nao_lidas}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-medium/80 truncate">
                    {conv.fazenda || 'Fazenda'}
                  </p>
                  <p className="text-medium/70 text-sm truncate mt-1">
                    {conv.ultima_mensagem || 'Sem mensagens'}
                  </p>
                </div>
                <MessageCircle className="w-5 h-5 text-dark/30" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
