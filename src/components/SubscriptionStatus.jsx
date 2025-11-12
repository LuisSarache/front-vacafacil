import { Crown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { Button } from './Button';

export const SubscriptionStatus = ({ showUpgradeButton = true }) => {
  const { subscription, isActive, isPro, isBasic, isFree } = useSubscription();

  if (!subscription) return null;

  const getStatusColor = () => {
    if (!isActive) return 'text-red-600 bg-red-50 border-red-200';
    if (isPro) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (isBasic) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = () => {
    if (!isActive) return <AlertTriangle className="w-4 h-4" />;
    if (isPro) return <Crown className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const formatExpiryDate = () => {
    if (!subscription.expiresAt) return null;
    const date = new Date(subscription.expiresAt);
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysUntilExpiry = () => {
    if (!subscription.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(subscription.expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilExpiry();
  const isExpiringSoon = daysLeft && daysLeft <= 7;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      
      <span>
        Plano {subscription.name}
        {subscription.status === 'cancelled' && ' (Cancelado)'}
      </span>

      {subscription.expiresAt && (
        <span className="text-xs opacity-75">
          • Expira em {formatExpiryDate()}
        </span>
      )}

      {isExpiringSoon && isActive && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          {daysLeft} dias restantes
        </span>
      )}

      {showUpgradeButton && isFree && (
        <Button size="sm" variant="primary" className="ml-2">
          Fazer Upgrade
        </Button>
      )}
    </div>
  );
};