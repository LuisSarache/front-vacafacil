// PWA utilities
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      return registration;
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    });
  }
};

export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
};

export const promptInstall = () => {
  let deferredPrompt;
  let isInstallHandled = false;
  
  // Security: Only allow one install prompt handler
  if (window.__installPromptHandlerRegistered) {
    return;
  }
  window.__installPromptHandlerRegistered = true;
  
  const handleInstallPrompt = (e) => {
    // Security: Validate event origin and trust
    if (!e.isTrusted || isInstallHandled) {
      return;
    }
    
    // Security: Validate event source
    if (e.origin && e.origin !== window.location.origin) {
      return;
    }
    
    e.preventDefault();
    deferredPrompt = e;
    isInstallHandled = true;
    
    // Security: Create secure install button handler
    const createSecureInstallHandler = () => {
      const installButton = document.getElementById('install-button');
      if (!installButton) return;
      
      // Security: Validate button integrity
      if (!installButton.dataset || installButton.dataset.trusted !== 'true') {
        return;
      }
      
      installButton.style.display = 'block';
      
      const handleInstallClick = (clickEvent) => {
        // Security: Validate click event
        if (!clickEvent.isTrusted || !deferredPrompt) {
          return;
        }
        
        // Security: Prevent multiple executions
        installButton.removeEventListener('click', handleInstallClick);
        installButton.disabled = true;
        
        try {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            installButton.style.display = 'none';
          }).catch((error) => {
            console.error('Install prompt error:', error);
            deferredPrompt = null;
            installButton.disabled = false;
          });
        } catch (error) {
          console.error('Install prompt failed:', error);
          installButton.disabled = false;
        }
      };
      
      installButton.addEventListener('click', handleInstallClick, { once: true });
    };
    
    // Security: Delay handler creation to prevent race conditions
    setTimeout(createSecureInstallHandler, 100);
  };
  
  window.addEventListener('beforeinstallprompt', handleInstallPrompt, { once: true });
};

export const enableOfflineMode = () => {
  // Security: Validate cache API availability
  if (!('caches' in window) || !('serviceWorker' in navigator)) {
    console.warn('Cache API or Service Worker not supported');
    return;
  }
  
  const CACHE_NAME = 'vacafacil-v1';
  const urlsToCache = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/logo.png'
  ];
  
  // Security: Validate URLs before caching
  const validUrls = urlsToCache.filter(url => {
    try {
      new URL(url, window.location.origin);
      return true;
    } catch {
      console.warn('Invalid URL for caching:', url);
      return false;
    }
  });
  
  // Cache resources with error handling
  caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(validUrls);
    })
    .catch(error => {
      console.error('Failed to cache resources:', error);
    });
};