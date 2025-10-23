import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }

    const interval = setInterval(() => {
      addNotification({
        type: 'info',
        title: 'Lembrete',
        message: 'Verificar produção de leite',
        timestamp: new Date().toISOString()
      });
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Máximo 50 notificações
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });

    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('notifications');
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
