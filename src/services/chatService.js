import { apiService } from './api';

export const chatService = {
  // Criar conversa com vendedor
  createConversation: (anuncioId, vendedorNome, localizacao) => 
    apiService.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ 
        anuncio_id: anuncioId,
        vendedor_nome: vendedorNome,
        localizacao: localizacao
      })
    }),
  
  // Listar todas as conversas
  getConversations: () => 
    apiService.request('/chat/conversations'),
  
  // Ver conversa específica
  getConversation: (id) => 
    apiService.request(`/chat/conversations/${id}`),
  
  // Enviar mensagem
  sendMessage: (conversationId, mensagem) => 
    apiService.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ conversation_id: conversationId, mensagem })
    }),
  
  // Contar não lidas
  getUnreadCount: () => 
    apiService.request('/chat/unread-count')
};
