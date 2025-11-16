import { Navigate } from 'react-router-dom';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { Card } from './Card';
import { Button } from './Button';
import { Lock, ArrowRight } from 'lucide-react';

/**
 * Componente para proteger rotas baseado em funcionalidades do plano
 */
export const FeatureRoute = ({ children, feature, featureName }) => {
  const { checkAccess, currentPlan } = useFeatureAccess();

  // Verifica acesso sem mostrar erro (vamos mostrar UI customizada)
  const hasAccess = checkAccess(feature, false);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-accent" />
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-4">
            Funcionalidade Bloqueada
          </h2>
          
          <p className="text-medium/70 mb-6">
            O acesso ao <strong>{featureName}</strong> não está disponível no plano <strong>{currentPlan}</strong>.
          </p>
          
          <div className="bg-accent/5 rounded-lg p-4 mb-6">
            <p className="text-sm text-medium/80">
              Faça upgrade do seu plano para desbloquear esta e outras funcionalidades exclusivas!
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => window.location.href = '/assinatura'}
            >
              Ver Planos Disponíveis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="secondary"
              className="w-full"
              onClick={() => window.location.href = '/dashboard'}
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return children;
};
