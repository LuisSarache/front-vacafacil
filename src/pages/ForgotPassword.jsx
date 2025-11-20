import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastManager } from '../components/ToastManager';
import { validateEmail } from '../utils/validation';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      ToastManager.error('E-mail inválido');
      return;
    }
    
    setLoading(true);
    
    try {
      await apiService.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      
      setSuccess(true);
      ToastManager.success('Email enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      ToastManager.error(error.message || 'Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-dark mb-4">Email Enviado!</h2>
            
            <p className="text-medium/70 mb-6">
              Enviamos instruções para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e spam.
            </p>
            
            <Link to="/login">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Login
              </Button>
            </Link>
          </Card>
        </motion.div>
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
              <Mail className="w-8 h-8 text-dark" />
            </div>
            
            <h2 className="text-2xl font-bold text-dark mb-2">Esqueceu sua senha?</h2>
            <p className="text-medium/70">
              Digite seu email e enviaremos instruções para redefinir sua senha.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Button type="submit" loading={loading} className="w-full">
              {loading ? 'Enviando...' : 'Enviar Email'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-dark hover:text-medium transition-colors">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Voltar para o login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
