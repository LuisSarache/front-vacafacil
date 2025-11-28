// 🛡️ Utilitários de Sanitização e Segurança

/**
 * Sanitiza strings para prevenir XSS
 * @param {string} str - String a ser sanitizada
 * @param {number} maxLength - Tamanho máximo permitido
 * @returns {string} String sanitizada
 */
export const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .substring(0, maxLength);
};

/**
 * Sanitiza objetos recursivamente
 * @param {any} data - Dados a serem sanitizados
 * @param {number} depth - Profundidade atual da recursão
 * @returns {any} Dados sanitizados
 */
export const sanitizeData = (data, depth = 0) => {
  // Previne recursão profunda
  if (depth > 10) return null;
  
  if (typeof data === 'string') {
    return sanitizeString(data);
  }
  
  if (typeof data === 'number') {
    return isFinite(data) ? data : 0;
  }
  
  if (typeof data === 'boolean') {
    return data;
  }
  
  if (data === null || data === undefined) {
    return null;
  }
  
  if (Array.isArray(data)) {
    return data.slice(0, 1000).map(item => sanitizeData(item, depth + 1)).filter(item => item !== null);
  }
  
  if (typeof data === 'object') {
    const sanitized = {};
    const allowedKeys = [
      'id', 'nome', 'raca', 'idade', 'peso', 'status', 'data', 'valor', 
      'descricao', 'categoria', 'tipo', 'quantidade', 'observacoes', 
      'created_at', 'updated_at', 'email', 'telefone', 'fazenda'
    ];
    
    Object.keys(data).forEach(key => {
      if (typeof key === 'string' && 
          key.length < 100 && 
          key.match(/^[a-zA-Z0-9_-]+$/) &&
          (allowedKeys.includes(key) || key.startsWith('vacafacil_'))) {
        const sanitizedValue = sanitizeData(data[key], depth + 1);
        if (sanitizedValue !== null) {
          sanitized[key] = sanitizedValue;
        }
      }
    });
    
    return sanitized;
  }
  
  return null;
};

/**
 * Valida URL para prevenir SSRF
 * @param {string} url - URL a ser validada
 * @param {string[]} allowedOrigins - Origens permitidas
 * @returns {boolean} True se URL é válida
 */
export const isValidUrl = (url, allowedOrigins = []) => {
  try {
    const urlObj = new URL(url);
    
    // Valida protocolo
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // Valida hostname
    const hostname = urlObj.hostname.toLowerCase();
    const privateIpPatterns = [
      /^127\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./,
      /^169\.254\./, /^::1$/, /^fe80:/, /^fc00:/, /^fd00:/
    ];
    
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocalhost && privateIpPatterns.some(pattern => pattern.test(hostname))) {
      return false;
    }
    
    // Valida origem se fornecida
    if (allowedOrigins.length > 0) {
      return allowedOrigins.some(origin => {
        try {
          const allowedUrl = new URL(origin);
          return urlObj.origin === allowedUrl.origin;
        } catch {
          return false;
        }
      });
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida arquivo para upload
 * @param {File} file - Arquivo a ser validado
 * @param {Object} options - Opções de validação
 * @returns {Object} Resultado da validação
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = ['application/json'],
    allowedExtensions = ['.json'],
    maxSize = 10 * 1024 * 1024 // 10MB
  } = options;
  
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo fornecido' };
  }
  
  // Valida tipo
  const typeValid = allowedTypes.includes(file.type) || 
                    allowedExtensions.some(ext => file.name.endsWith(ext));
  if (!typeValid) {
    return { 
      valid: false, 
      error: `Tipo de arquivo não permitido. Permitidos: ${allowedExtensions.join(', ')}` 
    };
  }
  
  // Valida tamanho
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return { 
      valid: false, 
      error: `Arquivo muito grande. Limite: ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true };
};

/**
 * Gera token CSRF
 * @returns {string} Token CSRF
 */
export const generateCSRFToken = () => {
  return btoa(Math.random().toString(36) + Date.now().toString(36));
};

/**
 * Valida origem da requisição
 * @param {string[]} allowedOrigins - Origens permitidas
 * @returns {boolean} True se origem é válida
 */
export const validateOrigin = (allowedOrigins = []) => {
  if (typeof window === 'undefined') return false;
  return allowedOrigins.includes(window.location.origin);
};
