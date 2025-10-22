import { useState } from 'react';
import { Bell, X, Check, Trash2, CheckCheck, Sparkles } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

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
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-110"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-20 left-64 w-[420px] max-h-[650px] z-[101] glassmorphism shadow-2xl rounded-[24px] overflow-hidden border-2 border-white/20 dark:border-white/10 animate-in slide-in-from-top-5 duration-300">
            <div className="p-5 border-b border-medium/20 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-dark/20 via-dark/10 to-transparent dark:from-green-900/30 dark:via-green-900/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dark/10 dark:bg-green-500/20 rounded-xl">
                  <Bell className="w-5 h-5 text-dark dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-dark dark:text-white text-lg flex items-center gap-2">
                    Notificações
                    {unreadCount > 0 && <Sparkles className="w-4 h-4 text-yellow-500" />}
                  </h3>
                  <p className="text-xs text-medium dark:text-gray-400 mt-0.5">
                    {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="p-2 hover:bg-dark/10 dark:hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 group"
                      title="Marcar todas como lidas"
                    >
                      <CheckCheck className="w-4 h-4 text-dark dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300" />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 hover:scale-110 group"
                      title="Limpar todas"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 group"
                >
                  <X className="w-4 h-4 text-medium dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[550px] custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-dark/10 to-dark/5 dark:from-gray-700/30 dark:to-gray-800/20 rounded-[20px] flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-10 h-10 text-medium/30 dark:text-gray-600" />
                  </div>
                  <p className="text-medium dark:text-gray-400 font-medium">Nenhuma notificação</p>
                  <p className="text-xs text-medium/60 dark:text-gray-500 mt-1">Você está em dia!</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 ${
                        !notification.read 
                          ? 'bg-gradient-to-r from-blue-50/80 to-transparent dark:from-blue-900/20 dark:to-transparent border-l-4 border-blue-500 shadow-sm' 
                          : ''
                      } ${index !== notifications.length - 1 ? 'border-b border-medium/10 dark:border-gray-700/30' : ''}`}
                    >
                      <div className="flex gap-4">
                        <div className="text-3xl flex-shrink-0 animate-in zoom-in duration-300">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="font-bold text-dark dark:text-white text-base leading-tight">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-medium/70 dark:text-gray-500 whitespace-nowrap bg-gray-100 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-medium dark:text-gray-300 leading-relaxed mb-3">
                            {notification.message}
                          </p>
                          <div className="flex gap-3">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1.5 font-semibold hover:underline transition-all px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Marcar como lida
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1.5 font-semibold hover:underline transition-all px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
          </div>
        </>
      )}
    </>
  );
};
