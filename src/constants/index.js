// Constantes da Aplicação
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-vacafacil.onrender.com';
export const APP_NAME = 'VacaFácil';
export const APP_VERSION = '2.2.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  REBANHO: '/rebanho',
  PRODUCAO: '/producao',
  FINANCEIRO: '/financeiro',
  MARKETPLACE: '/marketplace',
  ASSINATURA: '/assinatura',
};

export const RACAS = ['Holandesa', 'Jersey', 'Girolando', 'Gir', 'Pardo-Suíça', 'Guzerá'];

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
};

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso!',
    SAVE: 'Dados salvos com sucesso!',
  },
  ERROR: {
    GENERIC: 'Ocorreu um erro. Tente novamente.',
    NETWORK: 'Erro de conexão.',
  },
};
