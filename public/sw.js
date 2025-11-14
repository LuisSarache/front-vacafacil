const CACHE_NAME = 'vacafacil-v1';
const ALLOWED_ORIGINS = ['https://vacafacil.com', 'http://localhost:5173', 'http://localhost:3000'];
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/logo.png',
  '/manifest.json'
];

// Security: Enhanced URL validation to prevent SSRF
const isValidOrigin = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Block dangerous protocols
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // Block private/internal IPs
    const hostname = urlObj.hostname.toLowerCase();
    const privateIpPatterns = [
      /^127\./,           // 127.x.x.x (localhost)
      /^10\./,            // 10.x.x.x (private)
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16-31.x.x (private)
      /^192\.168\./,      // 192.168.x.x (private)
      /^169\.254\./,      // 169.254.x.x (link-local)
      /^::1$/,            // IPv6 localhost
      /^fe80:/,           // IPv6 link-local
      /^fc00:/,           // IPv6 private
      /^fd00:/            // IPv6 private
    ];
    
    // Allow localhost only for development
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (isLocalhost && !ALLOWED_ORIGINS.some(origin => origin.includes('localhost'))) {
      return false;
    }
    
    // Block private IPs in production
    if (!isLocalhost && privateIpPatterns.some(pattern => pattern.test(hostname))) {
      return false;
    }
    
    // Check against allowed origins
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

// Security: Validate request safety
const isRequestSafe = (request) => {
  try {
    // Validate URL
    if (!isValidOrigin(request.url)) {
      return false;
    }
    
    // Check for dangerous headers
    const dangerousHeaders = ['x-forwarded-for', 'x-real-ip', 'x-forwarded-host'];
    for (const header of dangerousHeaders) {
      if (request.headers.has(header)) {
        return false;
      }
    }
    
    // Validate content type for POST requests
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

// Security: Sanitize notification data
const sanitizeNotificationData = (data) => {
  if (!data) return 'Nova notificação do VacaFácil';
  const text = data.text ? data.text() : 'Nova notificação do VacaFácil';
  return text.replace(/<[^>]*>/g, '').substring(0, 200); // Remove HTML and limit length
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('Cache installation failed:', error))
  );
});

// Fetch event with enhanced security
self.addEventListener('fetch', (event) => {
  // Security: Comprehensive request validation
  if (!isRequestSafe(event.request)) {
    console.warn('Blocked unsafe request:', event.request.url);
    return;
  }

  // Security: Additional CSRF protection for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.request.method)) {
    const origin = event.request.headers.get('Origin');
    const referer = event.request.headers.get('Referer');
    
    // Require either Origin or Referer header
    if (!origin && !referer) {
      console.warn('Blocked request without Origin/Referer:', event.request.url);
      return;
    }
    
    // Validate Origin header if present
    if (origin && !isValidOrigin(origin)) {
      console.warn('Blocked request with invalid Origin:', origin);
      return;
    }
    
    // Validate Referer header if present
    if (referer && !isValidOrigin(referer)) {
      console.warn('Blocked request with invalid Referer:', referer);
      return;
    }
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // Security: Enhanced fetch with timeout and validation
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        return fetch(event.request.clone(), {
          signal: controller.signal
        })
        .then((fetchResponse) => {
          clearTimeout(timeoutId);
          
          // Security: Validate response
          if (!fetchResponse.ok && fetchResponse.status >= 400) {
            throw new Error(`HTTP ${fetchResponse.status}`);
          }
          
          return fetchResponse;
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.warn('Fetch failed:', error.message);
          
          // Return offline fallback if available
          if (event.request.destination === 'document') {
            return caches.match('/') || new Response('Offline', { status: 503 });
          }
          
          throw error;
        });
      })
  );
});

// Activate event
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

// Push notification event with sanitization
self.addEventListener('push', (event) => {
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
});

// Notification click event with enhanced validation
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Security: Validate and sanitize target URL
  let targetUrl = '/';
  
  if (event.notification.data?.url) {
    const providedUrl = event.notification.data.url;
    
    // Security: Validate URL format and origin
    try {
      // Handle relative URLs
      if (providedUrl.startsWith('/')) {
        targetUrl = providedUrl;
      } else {
        // Validate absolute URLs
        const urlObj = new URL(providedUrl);
        if (isValidOrigin(urlObj.href)) {
          targetUrl = urlObj.href;
        }
      }
    } catch {
      // Invalid URL, use default
      targetUrl = '/';
    }
  }
  
  // Security: Final validation before opening
  const finalUrl = targetUrl.startsWith('/') ? self.location.origin + targetUrl : targetUrl;
  
  if (isValidOrigin(finalUrl)) {
    event.waitUntil(
      clients.openWindow(targetUrl)
        .catch((error) => {
          console.error('Failed to open window:', error);
        })
    );
  } else {
    console.warn('Blocked notification click to invalid URL:', finalUrl);
  }
});