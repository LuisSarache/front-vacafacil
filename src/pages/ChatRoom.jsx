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
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 mb-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/marketplace/chat')}
            className="p-2 hover:bg-white/20 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-white text-xl">
              {conversation?.vendedor_nome || conversation?.vendedorNome || conversation?.anuncio?.vendedor || 'Vendedor'}
            </h2>
            <p className="text-sm text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              {conversation?.fazenda || conversation?.localizacao || conversation?.anuncio?.localizacao || 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 mb-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl">
        <div className="space-y-4">
          {conversation?.mensagens?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Send className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhuma mensagem ainda</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Inicie a conversa!</p>
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
                    className={`max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all hover:shadow-xl ${
                      isMyMessage
                        ? 'bg-gradient-to-br from-green-600 to-green-700 text-white'
                        : 'bg-white dark:bg-gray-800 text-dark dark:text-white border border-gray-200 dark:border-gray-700'
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
                                <div className="relative group">
                                  <img 
                                    src={imageUrl} 
                                    alt="Imagem enviada"
                                    className="w-full rounded-xl mb-2 max-h-64 object-cover cursor-pointer transition-all"
                                    onClick={() => window.open(imageUrl, '_blank')}
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full transition-all">
                                      Click para ampliar
                                    </span>
                                  </div>
                                </div>
                              )}
                              {textWithoutImage && <p className="break-words">{textWithoutImage}</p>}
                            </>
                          );
                        })()}
                      </>
                    ) : (
                      <p className="break-words">{msg.mensagem}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs ${
                        isMyMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {isMyMessage && (
                        <span className="text-white/70 text-xs">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Preview da imagem */}
        {imagePreview && (
          <div className="mb-3 relative inline-block animate-in fade-in slide-in-from-bottom-2">
            <img 
              src={imagePreview} 
              alt="Preview"
              className="h-24 rounded-xl border-2 border-green-500 shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full p-1.5 hover:scale-110 transition-all shadow-lg"
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
            className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-5 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={sending}
          />
          <button
            type="submit" 
            disabled={sending || (!mensagem.trim() && !imageFile)}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>!imageFile)}
            className="px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
