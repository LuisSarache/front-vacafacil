import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, X, Loader } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { ToastManager } from './ToastManager';

export const PaymentSimulator = ({ plan, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value.replace(/\D/g, '').slice(0, 16));
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      ToastManager.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso (90% de chance)
      const success = Math.random() > 0.1;
      
      if (success) {
        ToastManager.success('Pagamento aprovado!');
        onSuccess();
      } else {
        ToastManager.error('Pagamento recusado. Tente outro cartão.');
      }
    } catch (error) {
      ToastManager.error('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pagamento Simulado</h3>
                <p className="text-sm text-gray-500">Plano {plan?.name}</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total a pagar:</span>
              <span className="text-2xl font-bold text-blue-600">
                R$ {plan?.price?.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Cobrança mensal recorrente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Cartão
              </label>
              <Input
                value={cardData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome no Cartão
              </label>
              <Input
                value={cardData.name}
                onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())}
                placeholder="NOME COMPLETO"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade
                </label>
                <Input
                  value={cardData.expiry}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <Input
                  value={cardData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="123"
                  maxLength={3}
                  type="password"
                  required
                />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar Pagamento
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="w-full"
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 Pagamento 100% seguro e criptografado
            </p>
            <p className="text-xs text-gray-500 text-center mt-1">
              Este é um ambiente de simulação. Nenhum valor será cobrado.
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
