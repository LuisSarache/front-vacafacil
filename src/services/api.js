// 🔗 Serviço de API para conectar com o Backend VacaFácil
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
    this.csrfToken = this.generateCSRFToken();
  }

  // 🛡️ Gerar token CSRF
  generateCSRFToken() {
    return btoa(Math.random().toString(36) + Date.now().toString(36));
  }

  // 🛠️ Método base para requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // 🛡️ Proteção CSRF
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method)) {
      if (!this.validateOrigin()) {
        throw new Error('Origem não autorizada');
      }
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken,
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
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
      console.error(`API Error [${endpoint}]:`, error);
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

  // 🔐 Gerenciar token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  handleUnauthorized() {
    this.removeToken();
    window.location.href = '/login';
  }

  // 🛡️ Validar origem da requisição
  validateOrigin() {
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:3000',
      'http://localhost:5174',
      'https://vacafacil.com',
      'https://front-vacafacil.vercel.app'
    ];
    return allowedOrigins.includes(window.location.origin);
  }

  // 🔐 AUTENTICAÇÃO
  async login(email, password) {
    if (!this.validateOrigin()) {
      throw new Error('Origem não autorizada');
    }
    
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    console.log('🔐 Login attempt:', { email, url: `${this.baseURL}/auth/login` });
    
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRF-Token': this.csrfToken,
      },
      body: params,
    });
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Login error:', errorData);
      throw new Error(errorData.detail || 'Erro no login');
    }
    
    const data = await response.json();
    console.log('✅ Login success');
    this.setToken(data.access_token);
    return data;
  }

  async register(userData) {
    // Mapear campos do frontend (inglês) para backend (português)
    const mappedData = {
      email: userData.email,
      nome: userData.name,        // name -> nome
      password: userData.password,
      telefone: userData.phone || null,   // phone -> telefone (opcional)
      fazenda: userData.farmName || null  // farmName -> fazenda (opcional)
    };
    
    // Debug: mostrar dados mapeados
    console.log('Dados originais:', userData);
    console.log('Dados mapeados para backend:', mappedData);
    
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
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch(`${this.baseURL}/vacas/${vacaId}/upload-image`, {
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
      body: JSON.stringify({ plan_id: planoId }),
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