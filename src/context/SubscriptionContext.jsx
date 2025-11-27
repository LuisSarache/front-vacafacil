import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Planos disponíveis
  const plans = {
    free: {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      interval: 'forever',
      features: {
        maxVacas: 5,
        producaoHistorico: 30, // dias
        relatorios: 'basico',
        marketplace: false,
        analytics: false,
        suporte: 'email',
        backup: false,
        api: false
      },
      limits: {
        vacas: 5,
        producaoHistorico: 30,
        relatoriosPorMes: 5,
        exportacoes: 2
      }
    },
    basic: {
      id: 'basic',
      name: 'Básico',
      price: 29.90,
      interval: 'monthly',
      features: {
        maxVacas: 50,
        producaoHistorico: 365, // dias
        relatorios: 'completo',
        marketplace: true,
        analytics: 'basico',
        suporte: 'prioritario',
        backup: false,
        api: false
      },
      limits: {
        vacas: 50,
        producaoHistorico: 365,
        relatoriosPorMes: 50,
        exportacoes: 20
      }
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 59.90,
      interval: 'monthly',
      features: {
        maxVacas: -1, // ilimitado
        producaoHistorico: -1, // ilimitado
        relatorios: 'avancado',
        marketplace: true,
        analytics: 'avancado',
        suporte: '24/7',
        backup: true,
        api: true
      },
      limits: {
        vacas: -1,
        producaoHistorico: -1,
        relatoriosPorMes: -1,
        exportacoes: -1
      }
    }
  };

  // Carregar assinatura do usuário
  useEffect(() => {
    if (user) {
      loadUserSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserSubscription = () => {
    try {
      const savedSubscription = localStorage.getItem(`subscription_${user.id}`);
      if (savedSubscription && savedSubscription !== 'null') {
        const sub = JSON.parse(savedSubscription);
        // Verificar se não expirou
        if (sub.expiresAt && new Date(sub.expiresAt) < new Date()) {
          // Expirou, voltar para gratuito
          const freeSub = {
            ...plans.free,
            userId: user.id,
            startDate: new Date().toISOString(),
            status: 'active'
          };
          setSubscription(freeSub);
          localStorage.setItem(`subscription_${user.id}`, JSON.stringify(freeSub));
        } else {
          setSubscription(sub);
        }
      } else {
        // Novo usuário, atribuir plano gratuito automaticamente
        const freeSub = {
          ...plans.free,
          userId: user.id,
          startDate: new Date().toISOString(),
          status: 'active'
        };
        setSubscription(freeSub);
        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(freeSub));
      }
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      // Em caso de erro, atribuir plano gratuito
      const freeSub = {
        ...plans.free,
        userId: user.id,
        startDate: new Date().toISOString(),
        status: 'active'
      };
      setSubscription(freeSub);
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(freeSub));
    } finally {
      setLoading(false);
    }
  };

  const upgradePlan = async (planId, paymentMethod = 'mock') => {
    try {
      setLoading(true);
      
      const plan = plans[planId];
      if (!plan) throw new Error('Plano não encontrado');

      // Simular pagamento
      const paymentResult = await simulatePayment(plan, paymentMethod);
      
      if (paymentResult.success) {
        const newSubscription = {
          ...plan,
          userId: user.id,
          startDate: new Date().toISOString(),
          expiresAt: planId === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          paymentMethod,
          transactionId: paymentResult.transactionId
        };

        setSubscription(newSubscription);
        localStorage.setItem(`subscription_${user.id}`, JSON.stringify(newSubscription));
        
        return { success: true, subscription: newSubscription };
      } else {
        throw new Error(paymentResult.error);
      }
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      
      // Manter até o fim do período pago
      const updatedSubscription = {
        ...subscription,
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      };

      setSubscription(updatedSubscription);
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(updatedSubscription));
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = async (plan, method) => {
    // Simular delay de pagamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular sucesso (99% de chance para desenvolvimento)
    if (Math.random() > 0.01) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Pagamento recusado. Tente outro cartão.'
      };
    }
  };

  // Verificar limites
  const checkLimit = (feature, currentUsage = 0) => {
    if (!subscription) return false;
    
    const limit = subscription.limits[feature];
    if (limit === -1) return true; // Ilimitado
    
    return currentUsage < limit;
  };

  const getRemainingLimit = (feature, currentUsage = 0) => {
    if (!subscription) return 0;
    
    const limit = subscription.limits[feature];
    if (limit === -1) return Infinity; // Ilimitado
    
    return Math.max(0, limit - currentUsage);
  };

  const hasFeature = (feature) => {
    if (!subscription) return false;
    return subscription.features[feature] === true || subscription.features[feature] !== false;
  };

  const value = {
    subscription,
    plans,
    loading,
    upgradePlan,
    cancelSubscription,
    checkLimit,
    getRemainingLimit,
    hasFeature,
    isActive: subscription?.status === 'active',
    isPro: subscription?.id === 'pro',
    isBasic: subscription?.id === 'basic',
    isFree: subscription?.id === 'free',
    isNewUser: false // Sempre false pois atribuímos plano gratuito automaticamente
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};