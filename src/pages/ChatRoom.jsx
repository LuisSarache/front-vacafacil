import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { apiService } from '../services/api';
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
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50">
      {/* Header - Fino e elegante */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/marketplace/chat')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 text-base">
            {conversation?.vendedor_nome || conversation?.vendedorNome || conversation?.anuncio?.vendedor || 'Vendedor'}
          </h2>
          <p className="text-xs text-gray-500">
            {conversation?.fazenda || conversation?.localizacao || conversation?.anuncio?.localizacao || 'Marketplace'}
          </p>
        </div>
      </div>

      {/* Messages - Fundo claro */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-3">
          {conversation?.mensagens?.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Send className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Nenhuma mensagem ainda</p>
              <p className="text-gray-400 text-sm mt-1">Inicie a conversa!</p>
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
                    className={`max-w-md px-4 py-2.5 rounded-lg ${
                      isMyMessage
                        ? 'bg-[#E8F5E9] text-gray-900'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
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
                                  className="w-full rounded-md mb-2 max-h-64 object-cover cursor-pointer"
                                  onClick={() => window.open(imageUrl, '_blank')}
                                />
                              )}
                              {textWithoutImage && <p className="break-words text-sm">{textWithoutImage}</p>}
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <p className="break-words text-sm">{msg.mensagem}</p>
                    )}
                    <span className="text-xs text-gray-500 mt-1 block">
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
      </div>

      {/* Input - Limpo e profissional */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview"
                className="h-20 rounded-md border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <ImageIcon className="w-5 h-5 text-gray-600" />
            </button>
            <input
              type="text"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A994E] focus:border-transparent text-gray-900 placeholder-gray-400"
              disabled={sending}
            />
            <button
              type="submit" 
              disabled={sending || (!mensagem.trim() && !imageFile)}
              className="px-5 py-2.5 bg-[#6A994E] hover:bg-[#5a8442] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
