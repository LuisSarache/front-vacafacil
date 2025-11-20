// Sistema de logging profissional
const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
  constructor() {
    this.enabled = isDevelopment;
  }

  log(...args) {
    if (this.enabled) {
      console.log('[LOG]', ...args);
    }
  }

  info(...args) {
    if (this.enabled) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args) {
    if (this.enabled) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args) {
    // Sempre loga erros, mesmo em produção
    console.error('[ERROR]', ...args);
    
    // Em produção, enviar para serviço de monitoramento
    if (!this.enabled) {
      this.sendToMonitoring('error', args);
    }
  }

  debug(...args) {
    if (this.enabled) {
      console.debug('[DEBUG]', ...args);
    }
  }

  sendToMonitoring(level, data) {
    // Implementar integração com Sentry, LogRocket, etc
    // Por enquanto, apenas placeholder
    if (window.Sentry) {
      window.Sentry.captureMessage(JSON.stringify(data), level);
    }
  }
}

export const logger = new Logger();
export default logger;
