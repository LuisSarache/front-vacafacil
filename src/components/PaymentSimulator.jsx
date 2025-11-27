import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, X, Loader, Lock } from 'lucide-react';
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
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-700" />
              </div>
              <div>
<<<<<<< Updated upstream
                <h3 className="text-xl font-bold text-white">Pagamento Simulado</h3>
                <p className="text-sm text-gray-500">Plano {plan?.name}</p>
=======
                <h3 className="text-xl font-bold text-gray-900">Pagamento</h3>
                <p className="text-sm text-gray-600">Plano {plan?.name}</p>
>>>>>>> Stashed changes
              </div>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Total</span>
              <span className="text-2xl font-bold text-green-700">
                R$ {plan?.price?.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Cobrança mensal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
<<<<<<< Updated upstream
              <label className="block text-sm font-medium text-white mb-2">
=======
              <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              <label className="block text-sm font-medium text-white mb-2">
=======
              <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                <label className="block text-sm font-medium text-white mb-2">
=======
                <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                <label className="block text-sm font-medium text-white mb-2">
=======
                <label className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-white text-center">
              🔒 Pagamento 100% seguro e criptografado
            </p>
            <p className="text-xs text-white text-center mt-1">
              Este é um ambiente de simulação. Nenhum valor será cobrado.
            </p>
=======
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <Lock className="w-4 h-4" />
              <p className="text-xs">
                Pagamento seguro • Ambiente de simulação
              </p>
            </div>
>>>>>>> Stashed changes
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
