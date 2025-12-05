import toast from 'react-hot-toast';

export const ToastManager = {
  success: (message, options = {}) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981'
      },
      ...options,
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#fff',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444'
      },
      ...options,
    });
  },

  info: (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#fff',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      icon: 'ℹ️',
      ...options,
    });
  },

  warning: (message, options = {}) => {
    toast(message, {
      duration: 4500,
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#fff',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      icon: '⚠️',
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: '#fff',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      },
      ...options,
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  }
};
