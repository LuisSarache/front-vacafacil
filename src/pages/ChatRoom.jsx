import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { apiService } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ArrowLeft, Send } from 'lucide-react';

export const ChatRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversation();
    const interval = setInterval(loadConversation, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.mensagens]);

  const loadConversation = async () => {
    try {
      const data = await chatService.getConversation(id);
      
      // Sempre buscar dados do anúncio
      if (data.anuncio_id) {
        try {
          const anuncios = await apiService.request('/marketplace/');
          const anuncio = anuncios.find(a => a.id === data.anuncio_id);
          if (anuncio) {
            data.vendedor_nome = anuncio.vendedor;
            data.localizacao = anuncio.localizacao;
          }
        } catch (err) {
          console.error('Erro ao buscar anúncio:', err);
        }
      }
      
      setConversation(data);
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!mensagem.trim()) return;

    setSending(true);
    try {
      await chatService.sendMessage(id, mensagem);
      setMensagem('');
      loadConversation();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <Card className="glassmorphism p-4 mb-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/marketplace/chat')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="font-bold text-dark text-lg">
              {conversation?.vendedor_nome || conversation?.vendedorNome || conversation?.anuncio?.vendedor || 'Vendedor'}
            </h2>
            <p className="text-sm text-medium/70">
              {conversation?.fazenda || conversation?.localizacao || conversation?.anuncio?.localizacao || 'Marketplace'}
            </p>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <Card className="glassmorphism flex-1 overflow-y-auto p-6 mb-4">
        <div className="space-y-4">
          {conversation?.mensagens?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-medium/50">Nenhuma mensagem ainda. Inicie a conversa!</p>
            </div>
          ) : (
            conversation?.mensagens.map((msg) => {
              const isMyMessage = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl shadow-md ${
                      isMyMessage
                        ? 'bg-[#6A994E] text-white'
                        : 'bg-white text-dark border border-gray-200'
                    }`}
                  >
                    <p className="break-words">{msg.mensagem}</p>
                    <span className={`text-xs mt-2 block ${
                      isMyMessage ? 'text-white/70' : 'text-medium/50'
                    }`}>
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input */}
      <Card className="glassmorphism p-4 shadow-lg">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all"
            disabled={sending}
          />
          <Button 
            type="submit" 
            disabled={sending || !mensagem.trim()}
            className="px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
