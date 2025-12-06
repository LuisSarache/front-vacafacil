import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { apiService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Send, Image as ImageIcon, X, User, MessageCircle } from 'lucide-react';

export const Chat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (id) {
      loadConversation(id);
      const interval = setInterval(() => loadConversation(id), 3000);
      return () => clearInterval(interval);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.mensagens]);

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

  const loadConversation = async (conversationId) => {
    try {
      const data = await chatService.getConversation(conversationId);
      
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
      
      setSelectedConversation(data);
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  const selectConversation = (conv) => {
    navigate(`/chat/${conv.id}`);
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
      loadConversation(id);
      loadConversations();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages?.forEach(msg => {
      const date = new Date(msg.created_at).toLocaleDateString('pt-BR');
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const messageGroups = groupMessagesByDate(selectedConversation?.mensagens);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg overflow-hidden shadow-sm">
      {/* Coluna de Contatos - Esquerda */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Conversas</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhuma conversa</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  conv.id === Number(id) ? 'bg-gray-50 border-l-4 border-l-[#6A994E]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {conv.vendedor_nome || 'Vendedor'}
                      </h3>
                      {conv.mensagens_nao_lidas > 0 && (
                        <span className="bg-[#6A994E] text-white text-xs px-1.5 py-0.5 rounded-full">
                          {conv.mensagens_nao_lidas}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conv.ultima_mensagem || 'Sem mensagens'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de Conversa - Direita */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Selecione uma conversa</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">
                    {selectedConversation?.vendedor_nome || 'Vendedor'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedConversation?.localizacao || 'Marketplace'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {Object.keys(messageGroups).length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Nenhuma mensagem ainda</p>
                    <p className="text-gray-400 text-xs mt-1">Inicie a conversa!</p>
                  </div>
                </div>
              ) : (
                Object.entries(messageGroups).map(([date, messages]) => (
                  <div key={date} className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200 shadow-sm">
                        {date}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {messages.map((msg) => {
                        const isMyMessage = msg.sender_id === user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-sm px-3 py-2 rounded-lg shadow-sm ${
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
                                            alt="Imagem"
                                            className="w-full rounded-md mb-1 max-h-48 object-cover cursor-pointer"
                                            onClick={() => window.open(imageUrl, '_blank')}
                                          />
                                        )}
                                        {textWithoutImage && <p className="text-sm">{textWithoutImage}</p>}
                                      </>
                                    );
                                  })()}
                                </>
                              ) : (
                                <p className="text-sm">{msg.mensagem}</p>
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
                      })}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
              {imagePreview && (
                <div className="mb-2 relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview"
                    className="h-16 rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 bg-gray-500 hover:bg-gray-600 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
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
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A994E] focus:border-transparent text-sm"
                  disabled={sending}
                />
                <button
                  type="submit" 
                  disabled={sending || (!mensagem.trim() && !imageFile)}
                  className="px-4 py-2 bg-[#6A994E] hover:bg-[#5a8442] text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
