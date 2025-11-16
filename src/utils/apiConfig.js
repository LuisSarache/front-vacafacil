// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://backend-vacafacil.onrender.com',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Interceptor para retry automático
export const withRetry = async (fn, attempts = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    return await fn();
  } catch (error) {
    if (attempts > 1 && error.name !== 'AbortError') {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return withRetry(fn, attempts - 1);
    }
    throw error;
  }
};

// Função para verificar conectividade
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Headers padrão
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Função para lidar com erros da API
export const handleApiError = (error) => {
  if (error.status === 401) {
    // Token expirado ou inválido
    localStorage.removeItem('token');
    window.location.href = '/login';
    return 'Sessão expirada. Faça login novamente.';
  }
  
  if (error.status === 403) {
    return 'Acesso negado. Verifique suas permissões.';
  }
  
  if (error.status === 404) {
    return 'Recurso não encontrado.';
  }
  
  if (error.status >= 500) {
    return 'Erro interno do servidor. Tente novamente mais tarde.';
  }
  
  return error.message || 'Erro desconhecido.';
};