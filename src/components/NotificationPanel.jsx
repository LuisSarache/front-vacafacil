import { useState } from 'react';
import { Bell, X, Check, Trash2, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Card } from './Card';
import { Button } from './Button';

export const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right top-12 w-96 max-h-[600px] overflow-hidden z-50 glassmorphism">
            <div className="p-4 border-b border-medium/20 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-dark">Notificações</h3>
                <p className="text-xs text-medium/70">{unreadCount} não lidas</p>
              </div>
              <div className="flex gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Marcar todas como lidas"
                    >
                      <CheckCheck className="w-4 h-4 text-medium" />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Limpar todas"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-medium" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-medium/30 mx-auto mb-2" />
                  <p className="text-medium/70">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-medium/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-dark text-sm">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-medium/70 whitespace-nowrap">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-medium/70 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Marcar como lida
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
