import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../services/api';
import { ToastManager } from '../components/ToastManager';

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

  const loadUserSubscription = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSubscriptionStatus();
      
      // Mesclar dados da API com features locais
      const planId = data.plan_type || data.id || 'free';
      const planData = plans[planId] || plans.free;
      const mergedSubscription = {
        ...planData,
        ...data,
        id: planId,
        features: planData.features,
        limits: planData.limits
      };
      
      setSubscription(mergedSubscription);
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(mergedSubscription));
    } catch (error) {
      console.error('Erro ao carregar assinatura da API:', error);
      const saved = localStorage.getItem(`subscription_${user.id}`);
      if (saved) {
        setSubscription(JSON.parse(saved));
      } else {
        const freeSub = {
          ...plans.free,
          userId: user.id,
          startDate: new Date().toISOString(),
          status: 'active'
        };
        setSubscription(freeSub);
      }
    } finally {
      setLoading(false);
    }
  };

  const upgradePlan = async (planId) => {
    try {
      setLoading(true);
      const data = await apiService.subscribe(planId);
      
      // Mesclar dados da API com features locais
      const planData = plans[planId] || plans.free;
      const mergedSubscription = {
        ...planData,
        ...data,
        features: planData.features,
        limits: planData.limits
      };
      
      setSubscription(mergedSubscription);
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(mergedSubscription));
      ToastManager.success('Plano atualizado com sucesso!');
      return { success: true, subscription: mergedSubscription };
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao atualizar plano');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await apiService.cancelSubscription();
      const freeSub = {
        ...plans.free,
        userId: user.id,
        startDate: new Date().toISOString(),
        status: 'active'
      };
      setSubscription(freeSub);
      localStorage.setItem(`subscription_${user.id}`, JSON.stringify(freeSub));
      ToastManager.success('Assinatura cancelada com sucesso!');
      return { success: true };
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao cancelar assinatura');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
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
    if (!subscription || !subscription.features) return false;
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