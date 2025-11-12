import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Rocket } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PlanCard } from '../components/PlanCard';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { ToastManager } from '../components/ToastManager';

export const EscolherPlano = () => {
  const navigate = useNavigate();
  const { plans, upgradePlan } = useSubscription();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePlanSelection = async (planId) => {
    setLoading(true);
    try {
      const result = await upgradePlan(planId);
      if (result.success) {
        ToastManager.success(`Bem-vindo ao VacaFácil ${plans[planId].name}!`);
        navigate('/dashboard');
      } else {
        ToastManager.error(result.error || 'Erro ao processar plano');
      }
    } catch (error) {
      ToastManager.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Usuário escolhe continuar com plano gratuito
    await handlePlanSelection('free');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bem-vindo ao VacaFácil, {user?.name}!
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Escolha o plano ideal para gerenciar sua fazenda com eficiência. 
            Você pode começar gratuitamente e fazer upgrade a qualquer momento.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Crown className="w-4 h-4" />
            <span>Sem compromisso • Cancele quando quiser • Suporte especializado</span>
          </div>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.values(plans).map((plan) => (
            <div key={plan.id} className="relative">
              {plan.id === 'basic' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Mais Escolhido
                  </span>
                </div>
              )}
              
              <PlanCard
                plan={plan}
                onUpgrade={handlePlanSelection}
                isCurrentPlan={false}
              />
            </div>
          ))}
        </div>

        {/* Benefícios */}
        <Card className="p-8 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="text-center mb-6">
            <Rocket className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Por que milhares de produtores escolhem o VacaFácil?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">+40%</div>
              <p className="text-gray-600 dark:text-gray-400">Aumento na produtividade</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">-25%</div>
              <p className="text-gray-600 dark:text-gray-400">Redução nos custos</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-400">Suporte especializado</p>
            </div>
          </div>
        </Card>

        {/* Ações */}
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Não tem certeza ainda? Comece gratuitamente e explore todas as funcionalidades.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSkip}
              variant="secondary"
              size="lg"
              disabled={loading}
              className="min-w-48"
            >
              Começar Gratuitamente
            </Button>
            
            <Button
              onClick={() => handlePlanSelection('basic')}
              loading={loading}
              size="lg"
              className="min-w-48 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Crown className="w-5 h-5 mr-2" />
              Escolher Básico
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
          </p>
        </div>
      </div>
    </div>
  );
};