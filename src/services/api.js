// 🔗 Serviço de API para conectar com o Backend VacaFácil
import { isValidUrl, generateCSRFToken, validateOrigin } from '../utils/sanitize';
import { rateLimiter } from '../utils/rateLimit';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'https://vacafacil.com',
  'https://front-vacafacil.vercel.app'
];

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getToken();
    this.csrfToken = generateCSRFToken();
  }

  // 🔐 Obter token de forma segura
  getToken() {
    try {
      return sessionStorage.getItem('token') || null;
    } catch {
      return null;
    }
  }

  // 🛠️ Método base para requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Rate limiting
    if (!rateLimiter.canMakeRequest(endpoint, 30, 60000)) {
      throw new Error('Muitas requisições. Aguarde um momento.');
    }
    
    // Valida URL antes de fazer requisição
    if (!isValidUrl(url, [this.baseURL])) {
      throw new Error('URL inválida ou não permitida');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken,
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      credentials: 'same-origin',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Token expirado - tentar renovar
        if (response.status === 401 && this.token && endpoint !== '/auth/refresh') {
          try {
            await this.refreshToken();
            // Tentar novamente com novo token
            config.headers.Authorization = `Bearer ${this.token}`;
            const retryResponse = await fetch(url, config);
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          } catch {
            this.handleUnauthorized();
          }
        }
        
        if (response.status === 401) {
          this.handleUnauthorized();
        }
        
        const errorData = await response.json().catch(() => ({}));
        
        // Melhor tratamento para erro 422 (validação)
        if (response.status === 422) {
          const errorMessage = errorData.detail || 'Dados inválidos';
          if (Array.isArray(errorData.detail)) {
            const errors = errorData.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
            throw new Error(`Erro de validação: ${errors}`);
          }
          throw new Error(`Erro de validação: ${errorMessage}`);
        }
        
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // Melhor tratamento de erros
      if (error.message === 'Failed to fetch') {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente.');
      }
      throw error;
    }
  }

  // 🔄 Renovar token
  async refreshToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Não foi possível renovar o token');
    }
    
    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  // 🔐 Gerenciar token de forma segura
  setToken(token) {
    this.token = token;
    try {
      // Usar sessionStorage ao invés de localStorage para tokens
      sessionStorage.setItem('token', token);
      // Manter backup em localStorage apenas para persistência entre sessões
      localStorage.setItem('token_backup', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  removeToken() {
    this.token = null;
    try {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('token_backup');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  handleUnauthorized() {
    this.removeToken();
    window.location.href = '/login';
  }

  // 🛡️ Validar origem da requisição
  validateOrigin() {
    return validateOrigin(ALLOWED_ORIGINS);
  }

  // 🔐 AUTENTICAÇÃO
  async login(email, password) {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRF-Token': this.csrfToken,
        },
        body: params,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Se backend não responder, pode estar offline
        if (response.status === 0 || response.status >= 500) {
          throw new Error('Backend offline ou inacessível. Tente novamente em alguns segundos.');
        }
        
        throw new Error(errorData.detail || 'Email ou senha incorretos');
      }
      
      const data = await response.json();
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    const mappedData = {
      email: userData.email,
      nome: userData.name,
      password: userData.password,
      telefone: userData.phone || null,
      fazenda: userData.farmName || null
    };
    
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(mappedData),
    });
  }

  async getCurrentUser() {
    return this.request('/users/me');
  }

  logout() {
    this.removeToken();
    localStorage.removeItem('user');
  }

  // 🐄 VACAS
  async getVacas(params = {}) {
    // Suporte para paginação e filtros
    const defaultParams = {
      page: 1,
      limit: 50,
      ...params
    };
    const queryString = new URLSearchParams(defaultParams).toString();
    return this.request(`/vacas/?${queryString}`);
  }

  async getVaca(id) {
    return this.request(`/vacas/${id}`);
  }

  async createVaca(vaca) {
    return this.request('/vacas/', {
      method: 'POST',
      body: JSON.stringify(vaca),
    });
  }

  async updateVaca(id, vaca) {
    return this.request(`/vacas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vaca),
    });
  }

  async deleteVaca(id) {
    return this.request(`/vacas/${id}`, {
      method: 'DELETE',
    });
  }

  // 📷 Upload de imagem da vaca
  async uploadVacaImage(vacaId, imageFile) {
    const url = `${this.baseURL}/vacas/${vacaId}/upload-image`;
    
    // Valida URL
    if (!isValidUrl(url, [this.baseURL])) {
      throw new Error('URL inválida');
    }
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'X-CSRF-Token': this.csrfToken,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao fazer upload da imagem');
    }
    
    return await response.json();
  }

  // 🥛 PRODUÇÃO
  async getProducao(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/producao/?${queryString}`);
  }

  async createProducao(producao) {
    return this.request('/producao/', {
      method: 'POST',
      body: JSON.stringify(producao),
    });
  }

  async updateProducao(id, producao) {
    return this.request(`/producao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producao),
    });
  }

  async deleteProducao(id) {
    return this.request(`/producao/${id}`, {
      method: 'DELETE',
    });
  }

  // 💰 FINANCEIRO
  async getReceitas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/financeiro/receitas?${queryString}`);
  }

  async createReceita(receita) {
    return this.request('/financeiro/receitas', {
      method: 'POST',
      body: JSON.stringify(receita),
    });
  }

  async getDespesas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/financeiro/despesas?${queryString}`);
  }

  async createDespesa(despesa) {
    return this.request('/financeiro/despesas', {
      method: 'POST',
      body: JSON.stringify(despesa),
    });
  }

  async deleteReceita(id) {
    return this.request(`/financeiro/receitas/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteDespesa(id) {
    return this.request(`/financeiro/despesas/${id}`, {
      method: 'DELETE',
    });
  }

  // 🩺 REPRODUÇÃO
  async getReproducao(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reproducao/?${queryString}`);
  }

  async createReproducao(reproducao) {
    return this.request('/reproducao/', {
      method: 'POST',
      body: JSON.stringify(reproducao),
    });
  }

  // 🛒 MARKETPLACE
  async getAnuncios(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/marketplace/?${queryString}`);
  }

  async createAnuncio(anuncio) {
    return this.request('/marketplace/', {
      method: 'POST',
      body: JSON.stringify(anuncio),
    });
  }

  async updateAnuncio(id, anuncio) {
    return this.request(`/marketplace/${id}`, {
      method: 'PUT',
      body: JSON.stringify(anuncio),
    });
  }

  async deleteAnuncio(id) {
    return this.request(`/marketplace/${id}`, {
      method: 'DELETE',
    });
  }

  // 💳 ASSINATURA
  async getPlanos() {
    return this.request('/subscriptions/plans');
  }

  async subscribe(planoId) {
    return this.request('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ plan_type: planoId }),
    });
  }

  async getSubscriptionStatus() {
    return this.request('/subscriptions/status');
  }

  async cancelSubscription() {
    return this.request('/subscriptions/cancel', {
      method: 'DELETE',
    });
  }

  // 📊 RELATÓRIOS
  async getRelatorioProducao(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/relatorios/producao?${queryString}`);
  }

  async getRelatorioFinanceiro(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/relatorios/financeiro?${queryString}`);
  }

  async getRelatorioRebanho(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/relatorios/rebanho?${queryString}`);
  }

  // 📄 Gerar relatórios PDF/Excel no backend
  async gerarRelatorioPDF(tipo, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/relatorios/${tipo}/pdf?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'X-CSRF-Token': this.csrfToken,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao gerar relatório PDF');
    }
    
    const blob = await response.blob();
    return blob;
  }

  async gerarRelatorioExcel(tipo, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/relatorios/${tipo}/excel?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'X-CSRF-Token': this.csrfToken,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao gerar relatório Excel');
    }
    
    const blob = await response.blob();
    return blob;
  }

  // 🔍 BUSCA
  async search(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/search?${queryString}`);
  }

  // 📈 DASHBOARD
  async getDashboardData() {
    return this.request('/dashboard/stats');
  }

  // 🔔 NOTIFICAÇÕES
  async getNotifications() {
    return this.request('/notifications/');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async sendNotification(userId, data) {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, ...data }),
    });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // 📧 CONTATO
  async sendContactMessage(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// 🚀 Instância única do serviço
export const apiService = new ApiService();

// 🔄 Função para alternar entre Mock e API Real
export const useRealApi = () => {
  // Para usar a API real, importe apiService
  // Para usar mock, continue usando mockApi
  return apiService;
};

export default apiService;