import { useState } from 'react';
import { Crown, Check, X, CreditCard, Shield, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PlanCard } from '../components/PlanCard';
import { SubscriptionStatus } from '../components/SubscriptionStatus';
import { useSubscription } from '../context/SubscriptionContext';
import { ToastManager } from '../components/ToastManager';

export const Assinatura = () => {
  const { subscription, plans, upgradePlan, cancelSubscription, loading } = useSubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleUpgrade = async (planId) => {
    const result = await upgradePlan(planId);
    if (result.success) {
      ToastManager.success(`Plano ${plans[planId].name} ativado com sucesso!`);
    } else {
      ToastManager.error(result.error || 'Erro ao processar pagamento');
    }
    return result;
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const result = await cancelSubscription();
      if (result.success) {
        ToastManager.success('Assinatura cancelada com sucesso');
        setShowCancelModal(false);
      } else {
        ToastManager.error(result.error || 'Erro ao cancelar assinatura');
      }
    } catch (error) {
      ToastManager.error('Erro inesperado. Tente novamente.');
    } finally {
      setCancelLoading(false);
    }
  };

  const benefits = [
    'Sem taxas de setup ou cancelamento',
    'Suporte técnico especializado',
    'Atualizações automáticas',
    'Backup seguro dos seus dados',
    'Acesso a novas funcionalidades',
    'Garantia de 30 dias'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Escolha seu Plano
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Gerencie sua fazenda com eficiência. Escolha o plano ideal para o tamanho do seu rebanho.
        </p>
      </div>

      {/* Status Atual */}
      {subscription && (
        <div className="flex justify-center">
          <SubscriptionStatus showUpgradeButton={false} />
        </div>
      )}

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Object.values(plans).map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={subscription?.id === plan.id}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>

      {/* Benefícios */}
      <Card className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Por que escolher o VacaFácil?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Garantias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Segurança Total</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Seus dados protegidos com criptografia de ponta
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pagamento Seguro</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Processamento seguro via cartão de crédito
          </p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Suporte 24/7</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ajuda sempre que você precisar
          </p>
        </div>
      </div>

      {/* Cancelar Assinatura */}
      {subscription && subscription.id !== 'free' && subscription.status === 'active' && (
        <Card className="max-w-2xl mx-auto p-6 border-red-200 dark:border-red-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cancelar Assinatura
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Você pode cancelar sua assinatura a qualquer momento. 
              Continuará tendo acesso até o final do período pago.
            </p>
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Cancelar Assinatura
            </Button>
          </div>
        </Card>
      )}

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Cancelar Assinatura
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tem certeza que deseja cancelar sua assinatura? 
                Você perderá acesso às funcionalidades premium.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
                disabled={cancelLoading}
              >
                Manter Assinatura
              </Button>
              <Button
                onClick={handleCancel}
                loading={cancelLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Sim, Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};