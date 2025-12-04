export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 30000,
    retries: 3
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'VacaFácil',
    version: import.meta.env.VITE_APP_VERSION || '3.0.0',
    environment: import.meta.env.MODE || 'development'
  },
  features: {
    pwa: true,
    analytics: import.meta.env.MODE === 'production',
    debugMode: import.meta.env.MODE === 'development'
  },
  limits: {
    maxFileSize: 5 * 1024 * 1024,
    maxImageWidth: 1920,
    maxImageHeight: 1080,
    requestsPerMinute: 30
  }
};

export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
