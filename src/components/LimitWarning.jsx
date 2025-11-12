import { AlertTriangle, Crown, ArrowRight } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const LimitWarning = ({ feature, currentUsage, action = 'usar esta funcionalidade' }) => {
  const { subscription, checkLimit, getRemainingLimit } = useSubscription();
  const navigate = useNavigate();

  if (!subscription || checkLimit(feature, currentUsage)) {
    return null;
  }

  const remaining = getRemainingLimit(feature, currentUsage);
  const limit = subscription.limits[feature];

  const getFeatureName = () => {
    switch (feature) {
      case 'vacas': return 'vacas';
      case 'relatoriosPorMes': return 'relatórios por mês';
      case 'exportacoes': return 'exportações';
      default: return feature;
    }
  };

  const handleUpgrade = () => {
    navigate('/assinatura');
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Limite do plano atingido
          </h4>
          
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            Você atingiu o limite de {limit} {getFeatureName()} do seu plano {subscription.name}. 
            Para {action}, faça upgrade para um plano superior.
          </p>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={handleUpgrade}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Fazer Upgrade
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              A partir de R$ 29,90/mês
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};