import { useState } from 'react';
import { Check, Crown, Zap, Star, CreditCard } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { PaymentSimulator } from './PaymentSimulator';
import { useSubscription } from '../context/SubscriptionContext';
import { ToastManager } from './ToastManager';

export const PlanCard = ({ plan, isCurrentPlan = false, onUpgrade }) => {
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { subscription } = useSubscription();

  const handleUpgrade = async () => {
    if (isCurrentPlan) return;
    
    // Se for plano gratuito, ativa direto
    if (plan.id === 'free') {
      setLoading(true);
      try {
        await onUpgrade(plan.id);
      } catch (error) {
        console.error('Erro ao fazer upgrade:', error);
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Se for plano pago, abre simulador de pagamento
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setLoading(true);
    try {
      await onUpgrade(plan.id);
    } catch (error) {
      console.error('Erro ao ativar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = () => {
    switch (plan.id) {
      case 'free': return <Star className="w-6 h-6" />;
      case 'basic': return <Zap className="w-6 h-6" />;
      case 'pro': return <Crown className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = () => {
    switch (plan.id) {
      case 'free': return 'text-gray-600';
      case 'basic': return 'text-blue-600';
      case 'pro': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getBorderColor = () => {
    if (isCurrentPlan) return 'border-green-500 ring-2 ring-green-200';
    switch (plan.id) {
      case 'free': return 'border-gray-200';
      case 'basic': return 'border-blue-200';
      case 'pro': return 'border-purple-200';
      default: return 'border-gray-200';
    }
  };

  const formatFeature = (key, value) => {
    switch (key) {
      case 'maxVacas':
        return value === -1 ? 'Vacas ilimitadas' : `Até ${value} vacas`;
      case 'producaoHistorico':
        return value === -1 ? 'Histórico completo' : `${value} dias de histórico`;
      case 'relatorios':
        return `Relatórios ${value}`;
      case 'marketplace':
        return value ? 'Marketplace incluído' : 'Sem marketplace';
      case 'analytics':
        return value === false ? 'Sem analytics' : `Analytics ${value}`;
      case 'suporte':
        return `Suporte ${value}`;
      case 'backup':
        return value ? 'Backup em nuvem' : 'Sem backup';
      case 'api':
        return value ? 'Acesso à API' : 'Sem acesso à API';
      default:
        return value.toString();
    }
  };

  return (
    <>
      {showPayment && (
        <PaymentSimulator
          plan={plan}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
      
      <Card className={`relative p-6 ${getBorderColor()} transition-all duration-200 hover:shadow-lg`}>
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Plano Atual
          </span>
        </div>
      )}
      
      {plan.id === 'pro' && (
        <div className="absolute -top-3 right-4">
          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 ${getPlanColor()} mb-4`}>
          {getPlanIcon()}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>
        
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            R$ {plan.price.toFixed(2).replace('.', ',')}
          </span>
          {plan.interval !== 'forever' && (
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              /{plan.interval === 'monthly' ? 'mês' : 'ano'}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {Object.entries(plan.features).map(([key, value]) => (
          <div key={key} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {formatFeature(key, value)}
            </span>
          </div>
        ))}
      </div>

      <Button
        onClick={handleUpgrade}
        loading={loading}
        disabled={isCurrentPlan}
        variant={plan.id === 'pro' ? 'primary' : 'secondary'}
        className="w-full"
      >
        {isCurrentPlan ? 'Plano Atual' : 
         plan.id === 'free' ? 'Usar Gratuito' : 
         <><CreditCard className="w-4 h-4 mr-2 inline" />{`Assinar ${plan.name}`}</>}
      </Button>

      {plan.id !== 'free' && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
          Cancele a qualquer momento
        </p>
      )}
    </Card>
    </>
  );
};