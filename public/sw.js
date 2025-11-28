const CACHE_NAME = 'vacafacil-v1';
const ALLOWED_ORIGINS = [
  'https://vacafacil.com', 
  'http://localhost:5173', 
  'http://localhost:3000', 
  'http://localhost:5000',
  'https://front-vacafacil.vercel.app'
];
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/logo.png',
  '/manifest.json'
];

const isValidOrigin = (url) => {
  try {
    const urlObj = new URL(url);
    
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    const hostname = urlObj.hostname.toLowerCase();
    const privateIpPatterns = [
      /^127\./, /^10\./, /^172\.(1[6-9]|2[0-9]|3[0-1])\./, /^192\.168\./,
      /^169\.254\./, /^::1$/, /^fe80:/, /^fc00:/, /^fd00:/
    ];
    
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (isLocalhost && !ALLOWED_ORIGINS.some(origin => origin.includes('localhost'))) {
      return false;
    }
    
    if (!isLocalhost && privateIpPatterns.some(pattern => pattern.test(hostname))) {
      return false;
    }
    
    return ALLOWED_ORIGINS.some(origin => {
      try {
        const allowedUrl = new URL(origin);
        return urlObj.origin === allowedUrl.origin;
      } catch {
        return false;
      }
    }) || urlObj.origin === self.location.origin;
  } catch {
    return false;
  }
};

const isRequestSafe = (request) => {
  try {
    if (!isValidOrigin(request.url)) {
      return false;
    }
    
    const dangerousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-forwarded-host'];
    for (const header of dangerousHeaders) {
      if (request.headers.has(header)) {
        return false;
      }
    }
    
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (contentType && !contentType.startsWith('application/json') && 
          !contentType.startsWith('application/x-www-form-urlencoded') &&
          !contentType.startsWith('multipart/form-data')) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

const sanitizeNotificationData = (data) => {
  if (!data) return 'Nova notificação do VacaFácil';
  try {
    const text = data.text ? data.text() : 'Nova notificação do VacaFácil';
    return text.replace(/<[^>]*>/g, '').substring(0, 200);
  } catch {
    return 'Nova notificação do VacaFácil';
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('Cache installation failed:', error))
  );
});

self.addEventListener('fetch', (event) => {
  try {
    // Skip Service Worker completely for backend API requests
    const requestUrl = new URL(event.request.url);
    const isBackendRequest = requestUrl.origin === 'http://localhost:5000' || 
                             requestUrl.origin === 'https://backend-vacafacil.onrender.com';
    
    if (isBackendRequest) {
      // Let backend requests pass through without any Service Worker interference
      return;
    }

    if (!isRequestSafe(event.request)) {
      event.respondWith(new Response('Forbidden', { status: 403 }));
      return;
    }

    const requestOrigin = event.request.headers.get('Origin');
    if (requestOrigin && !ALLOWED_ORIGINS.includes(requestOrigin) && requestOrigin !== self.location.origin) {
      event.respondWith(new Response('Invalid origin', { status: 403 }));
      return;
    }

    // CSRF validation for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.request.method)) {
      const csrfToken = event.request.headers.get('X-CSRF-Token');
      // Validar apenas se não for requisição de autenticação
      if (!csrfToken && !requestUrl.pathname.includes('/auth/')) {
        event.respondWith(new Response('CSRF token required', { status: 403 }));
        return;
      }
    }
  } catch (error) {
    console.error('Service Worker fetch error:', error);
    event.respondWith(new Response('Service Worker Error', { status: 500 }));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        if (!isValidOrigin(event.request.url)) {
          clearTimeout(timeoutId);
          throw new Error('Invalid URL origin');
        }
        
        try {
          const requestUrl = new URL(event.request.url);
          if (requestUrl.protocol !== 'https:' && requestUrl.protocol !== 'http:') {
            clearTimeout(timeoutId);
            throw new Error('Invalid protocol');
          }
        } catch {
          clearTimeout(timeoutId);
          throw new Error('Malformed URL');
        }
        
        const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        if (!allowedMethods.includes(event.request.method)) {
          clearTimeout(timeoutId);
          throw new Error('Invalid HTTP method');
        }
        
        return fetch(event.request.clone(), {
          signal: controller.signal,
          mode: 'cors',
          credentials: 'same-origin',
          redirect: 'follow'
        })
        .then((fetchResponse) => {
          clearTimeout(timeoutId);
          
          if (!fetchResponse.ok && fetchResponse.status >= 400) {
            throw new Error(`HTTP ${fetchResponse.status}`);
          }
          
          return fetchResponse;
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          
          if (event.request.destination === 'document') {
            return caches.match('/') || new Response('Offline', { status: 503 });
          }
          
          throw error;
        });
      })
      .catch(() => {
        return new Response('Service unavailable', { status: 503 });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', (event) => {
  try {
    const origin = event.origin || self.location.origin;
    
    if (!ALLOWED_ORIGINS.includes(origin) && origin !== self.location.origin) {
      return;
    }
    
    if (event.data && typeof event.data.text === 'function') {
      try {
        const payload = event.data.json();
        if (payload && payload.origin && !ALLOWED_ORIGINS.includes(payload.origin)) {
          return;
        }
      } catch {
        // Continue with sanitized default
      }
    }
    
    const sanitizedBody = sanitizeNotificationData(event.data);
    
    const options = {
      body: sanitizedBody,
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      requireInteraction: false,
      silent: false
    };

    event.waitUntil(
      self.registration.showNotification('VacaFácil', options)
    );
  } catch {
    // Silent fail for push notifications
  }
});

self.addEventListener('notificationclick', (event) => {
  try {
    event.notification.close();
    
    let targetUrl = '/';
    
    if (event.notification.data?.url) {
      const providedUrl = event.notification.data.url;
      
      try {
        if (providedUrl.startsWith('/')) {
          targetUrl = providedUrl;
        } else {
          const urlObj = new URL(providedUrl);
          if (isValidOrigin(urlObj.href)) {
            targetUrl = urlObj.href;
          }
        }
      } catch {
        targetUrl = '/';
      }
    }
    
    const finalUrl = targetUrl.startsWith('/') ? self.location.origin + targetUrl : targetUrl;
    
    if (isValidOrigin(finalUrl)) {
      const notificationOrigin = event.notification.data?.origin;
      if (notificationOrigin && !ALLOWED_ORIGINS.includes(notificationOrigin)) {
        return;
      }
      
      event.waitUntil(
        clients.openWindow(targetUrl)
      );
    }
  } catch {
    // Silent fail for notification clicks
  }
});