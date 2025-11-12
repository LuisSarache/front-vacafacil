import { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowRight, ArrowLeft, X, Lightbulb } from 'lucide-react';

export const OnboardingTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      target: '[data-tour="dashboard"]',
      title: 'Bem-vindo ao VacaFácil!',
      content: 'Este é seu dashboard principal. Aqui você tem uma visão geral de toda sua fazenda.',
      position: 'bottom'
    },
    {
      target: '[data-tour="rebanho"]',
      title: 'Gestão do Rebanho',
      content: 'Gerencie todas as suas vacas, cadastre novas e acompanhe o histórico de cada animal.',
      position: 'right'
    },
    {
      target: '[data-tour="producao"]',
      title: 'Controle de Produção',
      content: 'Registre a produção diária de leite e acompanhe a performance do seu rebanho.',
      position: 'right'
    },
    {
      target: '[data-tour="financeiro"]',
      title: 'Controle Financeiro',
      content: 'Gerencie receitas, despesas e acompanhe a lucratividade da sua fazenda.',
      position: 'right'
    },
    {
      target: '[data-tour="notifications"]',
      title: 'Notificações',
      content: 'Receba alertas importantes sobre vacinação, secagem e outros eventos.',
      position: 'left'
    }
  ];

  const getCurrentStepElement = () => {
    const step = steps[currentStep];
    if (!step) return null;
    return document.querySelector(step.target);
  };

  const getTooltipPosition = () => {
    const element = getCurrentStepElement();
    if (!element) return { top: 0, left: 0 };

    const rect = element.getBoundingClientRect();
    const step = steps[currentStep];
    
    switch (step.position) {
      case 'bottom':
        return {
          top: rect.bottom + 10,
          left: rect.left + rect.width / 2 - 150
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2 - 75,
          left: rect.right + 10
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2 - 75,
          left: rect.left - 310
        };
      default:
        return {
          top: rect.top - 160,
          left: rect.left + rect.width / 2 - 150
        };
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const element = getCurrentStepElement();
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.position = 'relative';
        element.style.zIndex = '1001';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
        element.style.borderRadius = '8px';
      }
    }

    return () => {
      // Cleanup highlighting
      steps.forEach(step => {
        const element = document.querySelector(step.target);
        if (element) {
          element.style.position = '';
          element.style.zIndex = '';
          element.style.boxShadow = '';
          element.style.borderRadius = '';
        }
      });
    };
  }, [currentStep, isOpen]);

  if (!isOpen || !steps[currentStep]) return null;

  const position = getTooltipPosition();
  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-1000" />
      
      {/* Tooltip */}
      <div
        className="fixed z-1001 bg-white rounded-lg shadow-xl border p-6 w-80"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="font-semibold text-gray-900">{step.title}</h3>
          </div>
          <button onClick={skipTour} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">{step.content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button variant="secondary" size="sm" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
            )}
            <Button size="sm" onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={skipTour}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Pular tour
          </button>
        </div>
      </div>
    </>
  );
};