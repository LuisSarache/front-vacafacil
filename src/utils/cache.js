class CacheManager {
  constructor() {
    this.cache = new Map();
    this.expirations = new Map();
  }

  set(key, value, ttl = 300000) {
    this.cache.set(key, value);
    
    if (ttl > 0) {
      const expiration = Date.now() + ttl;
      this.expirations.set(key, expiration);
    }
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        value,
        expiration: ttl > 0 ? Date.now() + ttl : null
      }));
    } catch {}
  }

  get(key) {
    if (this.isExpired(key)) {
      this.delete(key);
      return null;
    }
    
    let value = this.cache.get(key);
    
    if (!value) {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const { value: storedValue, expiration } = JSON.parse(stored);
          if (!expiration || expiration > Date.now()) {
            value = storedValue;
            this.cache.set(key, value);
          }
        }
      } catch {}
    }
    
    return value || null;
  }

  isExpired(key) {
    const expiration = this.expirations.get(key);
    return expiration && Date.now() > expiration;
  }

  delete(key) {
    this.cache.delete(key);
    this.expirations.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch {}
  }

  clear() {
    this.cache.clear();
    this.expirations.clear();
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {}
  }
}

export const cacheManager = new CacheManager();
