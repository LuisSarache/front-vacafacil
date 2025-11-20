import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastManager } from '../components/ToastManager';
import { validatePassword } from '../utils/validation';
import { Lock, AlertCircle } from 'lucide-react';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      ToastManager.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      ToastManager.error('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    
    try {
      await apiService.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          new_password: password
        })
      });
      
      ToastManager.success('Senha alterada com sucesso!');
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/login');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao alterar senha. Token pode estar expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-4">Token Inválido</h2>
          <p className="text-medium/70 mb-6">
            O link de recuperação é inválido ou expirou.
          </p>
          
          <Button onClick={() => navigate('/forgot-password')} className="w-full">
            Solicitar Novo Link
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-dark" />
            </div>
            
            <h2 className="text-2xl font-bold text-dark mb-2">Nova Senha</h2>
            <p className="text-medium/70">
              Digite sua nova senha abaixo.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nova Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <Button type="submit" loading={loading} className="w-full">
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
