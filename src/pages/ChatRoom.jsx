import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { apiService } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ArrowLeft, Send, Image as ImageIcon, X } from 'lucide-react';

export const ChatRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Tamanho máximo: 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!mensagem.trim() && !imageFile) return;

    setSending(true);
    try {
      let finalMessage = mensagem;
      
      // Se tiver imagem, adicionar ao texto
      if (imagePreview) {
        finalMessage = `${mensagem}\n[IMAGEM: ${imagePreview}]`;
      }
      
      await chatService.sendMessage(id, finalMessage);
      setMensagem('');
      handleRemoveImage();
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
                    {/* Verificar se tem imagem */}
                    {msg.mensagem.includes('[IMAGEM:') ? (
                      <>
                        {(() => {
                          const match = msg.mensagem.match(/\[IMAGEM: (.+?)\]/);
                          const imageUrl = match ? match[1] : null;
                          const textWithoutImage = msg.mensagem.replace(/\[IMAGEM: .+?\]/, '').trim();
                          return (
                            <>
                              {imageUrl && (
                                <img 
                                  src={imageUrl} 
                                  alt="Imagem enviada"
                                  className="w-full rounded-lg mb-2 max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(imageUrl, '_blank')}
                                />
                              )}
                              {textWithoutImage && <p className="break-words">{textWithoutImage}</p>}
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <p className="break-words">{msg.mensagem}</p>
                    )}
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
        {/* Preview da imagem */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview"
              className="h-20 rounded-lg border-2 border-green-500"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
            className="px-4"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
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
            disabled={sending || (!mensagem.trim() && !imageFile)}
            className="px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
