import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Ação',
  message = 'Tem certeza que deseja continuar?',
  type = 'warning', // 'warning', 'danger', 'info', 'success'
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false
}) => {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      confirmVariant: 'primary'
    },
    danger: {
      icon: XCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      confirmVariant: 'primary'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      confirmVariant: 'primary'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      confirmVariant: 'primary'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlayClick={!loading}
      showCloseButton={!loading}
    >
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${config.bgColor} mb-4`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        
        <h3 className="text-lg font-semibold text-dark mb-2">
          {title}
        </h3>
        
        <p className="text-medium/70 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};