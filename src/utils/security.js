// Sistema de segurança e logging
class SecurityLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: this.sanitizeData(data),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logs.push(logEntry);
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console[level](`[SECURITY] ${message}`, data);
    }

    // Enviar para servidor em produção (quando implementar backend)
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      this.sendToServer(logEntry);
    }
  }

  sanitizeData(data) {
    // Remove dados sensíveis dos logs
    const sanitized = { ...data };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  async sendToServer(logEntry) {
    try {
      // Implementar quando tiver backend
      // await fetch('/api/security-logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
    } catch (error) {
      console.error('Failed to send security log:', error);
    }
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

// Instância singleton
export const securityLogger = new SecurityLogger();

// Validação de entrada
export const validateInput = (input, type = 'text', maxLength = 1000) => {
  if (typeof input !== 'string') {
    securityLogger.warn('Invalid input type', { type: typeof input, expected: 'string' });
    return false;
  }

  if (input.length > maxLength) {
    securityLogger.warn('Input too long', { length: input.length, maxLength });
    return false;
  }

  // Verificar caracteres perigosos
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      securityLogger.error('Dangerous pattern detected', { pattern: pattern.toString(), input: input.substring(0, 100) });
      return false;
    }
  }

  return true;
};

// Sanitização de HTML
export const sanitizeHtml = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Validação de URL
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    
    if (!allowedProtocols.includes(urlObj.protocol)) {
      securityLogger.warn('Invalid URL protocol', { protocol: urlObj.protocol, url });
      return false;
    }

    return true;
  } catch (error) {
    securityLogger.warn('Invalid URL format', { url, error: error.message });
    return false;
  }
};

// Rate limiting simples
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Limpar requests antigas
    if (this.requests.has(key)) {
      const userRequests = this.requests.get(key).filter(time => time > windowStart);
      this.requests.set(key, userRequests);
    }

    const currentRequests = this.requests.get(key) || [];
    
    if (currentRequests.length >= this.maxRequests) {
      securityLogger.warn('Rate limit exceeded', { key, requests: currentRequests.length });
      return false;
    }

    currentRequests.push(now);
    this.requests.set(key, currentRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Detecção de ataques
export const detectAttack = (input) => {
  const attackPatterns = [
    // XSS
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    
    // SQL Injection
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    
    // Path Traversal
    /\.\.[\/\\]/g,
    
    // Command Injection
    /[;&|`$(){}[\]]/g
  ];

  for (const pattern of attackPatterns) {
    if (pattern.test(input)) {
      securityLogger.error('Potential attack detected', { 
        pattern: pattern.toString(), 
        input: input.substring(0, 100) 
      });
      return true;
    }
  }

  return false;
};

// Monitoramento de eventos suspeitos
export const monitorSuspiciousActivity = () => {
  // Detectar tentativas de abertura de DevTools
  let devtools = { open: false, orientation: null };
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
      if (!devtools.open) {
        devtools.open = true;
        securityLogger.warn('Developer tools opened');
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Detectar tentativas de injeção de código
  const originalEval = window.eval;
  window.eval = function(code) {
    securityLogger.error('eval() usage detected', { code: code.substring(0, 100) });
    throw new Error('eval() is disabled for security reasons');
  };

  // Detectar modificações no DOM suspeitas
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName?.toLowerCase();
            if (tagName === 'script' || tagName === 'iframe') {
              securityLogger.warn('Suspicious DOM modification', { 
                tagName, 
                src: node.src,
                innerHTML: node.innerHTML?.substring(0, 100)
              });
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Inicializar monitoramento
if (typeof window !== 'undefined') {
  monitorSuspiciousActivity();
}