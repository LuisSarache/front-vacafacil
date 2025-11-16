import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { checkApiHealth } from '../utils/apiConfig';

export const ApiStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isHealthy = await checkApiHealth();
        setApiStatus(isHealthy ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    // Verificar status inicial
    checkStatus();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);

    // Listener para status de rede
    const handleOnline = () => {
      setIsOnline(true);
      checkStatus();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setApiStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-500',
        bg: 'bg-red-50',
        text: 'Sem conexão',
        description: 'Verifique sua conexão com a internet'
      };
    }

    switch (apiStatus) {
      case 'online':
        return {
          icon: Wifi,
          color: 'text-green-500',
          bg: 'bg-green-50',
          text: 'Online',
          description: 'Conectado ao servidor'
        };
      case 'offline':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bg: 'bg-red-50',
          text: 'Servidor offline',
          description: 'Não foi possível conectar ao servidor'
        };
      default:
        return {
          icon: Wifi,
          color: 'text-yellow-500',
          bg: 'bg-yellow-50',
          text: 'Verificando...',
          description: 'Verificando conexão com o servidor'
        };
    }
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  // Só mostrar se houver problema
  if (isOnline && apiStatus === 'online') {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${status.bg} border border-current rounded-lg p-3 shadow-lg`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${status.color}`} />
        <div>
          <div className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </div>
          <div className="text-xs text-gray-600">
            {status.description}
          </div>
        </div>
      </div>
    </div>
  );
};