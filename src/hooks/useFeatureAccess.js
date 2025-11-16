import { useSubscription } from '../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { ToastManager } from '../components/ToastManager';

/**
 * Hook para verificar acesso a funcionalidades baseado no plano
 */
export const useFeatureAccess = () => {
  const { subscription, hasFeature } = useSubscription();
  const navigate = useNavigate();

  /**
   * Verifica se o usuário tem acesso a uma funcionalidade
   * @param {string} feature - Nome da funcionalidade
   * @param {boolean} showError - Se deve mostrar mensagem de erro
   * @returns {boolean} - true se tem acesso, false caso contrário
   */
  const checkAccess = (feature, showError = true) => {
    if (!subscription) {
      if (showError) {
        ToastManager.error('Você precisa escolher um plano primeiro');
        navigate('/escolher-plano');
      }
      return false;
    }

    const hasAccess = hasFeature(feature);

    if (!hasAccess && showError) {
      ToastManager.error(
        `Esta funcionalidade não está disponível no plano ${subscription.name}. Faça upgrade para acessar!`
      );
      navigate('/assinatura');
    }

    return hasAccess;
  };

  /**
   * Verifica se pode acessar o marketplace
   */
  const canAccessMarketplace = () => {
    return checkAccess('marketplace');
  };

  /**
   * Verifica se pode acessar analytics
   */
  const canAccessAnalytics = () => {
    return checkAccess('analytics');
  };

  /**
   * Verifica se pode exportar relatórios
   */
  const canExportReports = () => {
    return checkAccess('relatorios');
  };

  /**
   * Verifica se pode fazer backup
   */
  const canBackup = () => {
    return checkAccess('backup');
  };

  /**
   * Verifica se pode acessar API
   */
  const canAccessAPI = () => {
    return checkAccess('api');
  };

  return {
    checkAccess,
    canAccessMarketplace,
    canAccessAnalytics,
    canExportReports,
    canBackup,
    canAccessAPI,
    currentPlan: subscription?.name || 'Nenhum',
    planId: subscription?.id || null
  };
};
