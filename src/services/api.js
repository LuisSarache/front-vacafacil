<<<<<<< Updated upstream
// 🔗 Serviço de API para conectar com o Backend VacaFácil
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
=======
// Configuração da API para conectar com backend do Render
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-vacafacil.onrender.com';
>>>>>>> Stashed changes

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
<<<<<<< Updated upstream
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
=======
  }

  // Método base para requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
>>>>>>> Stashed changes
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
<<<<<<< Updated upstream
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
=======
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
>>>>>>> Stashed changes
      }
      
      return await response.json();
    } catch (error) {
<<<<<<< Updated upstream
      console.error(`API Error [${endpoint}]:`, error);
=======
      console.error('API Request Error:', error);
>>>>>>> Stashed changes
      throw error;
    }
  }

<<<<<<< Updated upstream
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
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'https://vacafacil.com'];
    return allowedOrigins.includes(window.location.origin);
  }

  // 🔐 AUTENTICAÇÃO
  async login(email, password) {
    if (!this.validateOrigin()) {
      throw new Error('Origem não autorizada');
    }
    
=======
  // Autenticação
  async login(email, password) {
>>>>>>> Stashed changes
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
<<<<<<< Updated upstream
      headers: {
        'X-CSRF-Token': this.csrfToken,
      },
=======
>>>>>>> Stashed changes
      body: formData,
    });
    
    if (!response.ok) {
<<<<<<< Updated upstream
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro no login');
    }
    
    const data = await response.json();
    this.setToken(data.access_token);
=======
      throw new Error('Credenciais inválidas');
    }
    
    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('token', this.token);
>>>>>>> Stashed changes
    return data;
  }

  async register(userData) {
<<<<<<< Updated upstream
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
=======
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Vacas
  async getVacas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vacas?${queryString}`);
>>>>>>> Stashed changes
  }

  async getVaca(id) {
    return this.request(`/vacas/${id}`);
  }

  async createVaca(vaca) {
<<<<<<< Updated upstream
    return this.request('/vacas/', {
=======
    return this.request('/vacas', {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  // Produção
  async getProducoes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/producao?${queryString}`);
  }

  async createProducao(producao) {
    return this.request('/producao', {
>>>>>>> Stashed changes
      method: 'POST',
      body: JSON.stringify(producao),
    });
  }

<<<<<<< Updated upstream
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
=======
  // Financeiro
  async getTransacoes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/financeiro?${queryString}`);
  }

  async createTransacao(transacao) {
    return this.request('/financeiro', {
      method: 'POST',
      body: JSON.stringify(transacao),
    });
  }

  // Assinatura
  async getPlans() {
    return this.request('/subscriptions/plans');
  }

  async subscribe(planData) {
    return this.request('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify(planData),
>>>>>>> Stashed changes
    });
  }

  async getSubscriptionStatus() {
    return this.request('/subscriptions/status');
  }

<<<<<<< Updated upstream
=======
  async upgradeSubscription(planType) {
    return this.request('/subscriptions/upgrade', {
      method: 'PUT',
      body: JSON.stringify({ plan_type: planType }),
    });
  }

>>>>>>> Stashed changes
  async cancelSubscription() {
    return this.request('/subscriptions/cancel', {
      method: 'DELETE',
    });
  }

<<<<<<< Updated upstream
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
}

// 🚀 Instância única do serviço
export const apiService = new ApiService();

// 🔄 Função para alternar entre Mock e API Real
export const useRealApi = () => {
  // Para usar a API real, importe apiService
  // Para usar mock, continue usando mockApi
  return apiService;
};

=======
  async getUsageLimits() {
    return this.request('/subscriptions/usage');
  }

  // Reprodução
  async getInseminacoes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reproducao/inseminacoes?${queryString}`);
  }

  async createInseminacao(inseminacao) {
    return this.request('/reproducao/inseminacoes', {
      method: 'POST',
      body: JSON.stringify(inseminacao),
    });
  }

  async getVacinas(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reproducao/vacinas?${queryString}`);
  }

  async createVacina(vacina) {
    return this.request('/reproducao/vacinas', {
      method: 'POST',
      body: JSON.stringify(vacina),
    });
  }

  // Marketplace
  async getAnuncios(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/marketplace?${queryString}`);
  }

  async createAnuncio(anuncio) {
    return this.request('/marketplace', {
      method: 'POST',
      body: JSON.stringify(anuncio),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
>>>>>>> Stashed changes
export default apiService;