import toast from 'react-hot-toast';  

export const ToastManager = {
    
    success: (message, options = {}) => {
        toast.success(message, {
          duration: 4000, // 4 segundos
          position: 'top-right',
          style: { borderRadius: '8px', background: '#22c55e', color: '#fff', padding: '12px 16px' },
          ...options,
        });
      },

      error: (message, options = {}) => {
        toast.error(message, {
          duration: 5000,
          position: 'top-right',
          style: { borderRadius: '8px', background: '#ef4444', color: '#fff', padding: '12px 16px' },
          ...options,
        });
      },

      info: (message, options = {}) => {
        toast(message, {
          duration: 4000,
          position: 'top-right',
          style: { borderRadius: '8px', background: '#3b82f6', color: '#fff', padding: '12px 16px' },
          ...options,
        });
      },
    }
